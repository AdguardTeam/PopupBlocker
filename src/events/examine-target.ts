/* eslint-disable no-param-reassign, no-restricted-syntax, no-labels */
import { setBeforeunloadHandler } from '../dom/unload';
import {
    maskContentTest,
    isArtificialStackingContextRoot,
    numsAreClose,
    rectAlmostCoversView,
} from './element-tests';
import {
    isMouseEvent,
    isTouchEvent,
    isElement,
    isHTMLElement,
    isIFrame,
    closest,
    getTagName,
    abort,
    log,
    getContentWindow,
    getOwnPropertyDescriptor,
} from '../shared';
import { adguard } from '../page-script-namespace';
import { InterContextMessageHubInterface, IMessageHandler } from '../messaging/InterContextMessageHubInterface';
import { MessageTypes } from '../messaging/MessageTypes';
import { PopupContext } from '../dom/open';

const elementsFromPoint = document.elementsFromPoint || document.msElementsFromPoint;

const getEventPath = (() => {
    const eventPType = Event.prototype;
    const pathDesc = getOwnPropertyDescriptor(eventPType, 'path');
    return pathDesc ? pathDesc.get : eventPType.composedPath;
})();

export const preventPointerEvent = (el:Element):void => {
    if (!isHTMLElement(el)) { return; }
    el.style.setProperty('display', 'none', 'important');
    el.style.setProperty('pointer-events', 'none', 'important');
};

function getDefaultEventHandlerTarget(el:Element):DefaultEventHandlerInfo {
    let hasDefaultEventHandler = false;
    let defaultEventHandlerTarget = null;
    const target = closest(el, 'iframe,input,a,area,button,[onclick],[onmousedown],[onmouseup]');
    if (target) {
        hasDefaultEventHandler = true;
        const tagName = getTagName(target);
        if (tagName === 'A' || tagName === 'AREA') {
            defaultEventHandlerTarget = (<HTMLAnchorElement | HTMLAreaElement>target).href;
        }
    }
    return { hasDefaultEventHandler, defaultEventHandlerTarget };
}

interface DefaultEventHandlerInfo {
    hasDefaultEventHandler?:boolean
    defaultEventHandlerTarget?:string
}

interface IExamineSingleCandidateResult extends DefaultEventHandlerInfo {
    maskRoot?:Element
}

// This can be made less repetitive by using generator functions, but since we have to support IE..
function examineEventPath(path:EventTarget[]):IExamineSingleCandidateResult {
    let maskRoot:Element;
    let hasArtificialStackingContextRoot = false;
    let info:IExamineSingleCandidateResult;
    for (let i = 0, l = path.length; i < l; i += 1) {
        const el = path[i];
        if (!isElement(el)) { break; }
        if (!info || !info.hasDefaultEventHandler) {
            info = getDefaultEventHandlerTarget(el);
        }
        if (!hasArtificialStackingContextRoot && isArtificialStackingContextRoot(el)) {
            hasArtificialStackingContextRoot = true;
            if (maskContentTest(<Element>path[0])) {
                maskRoot = el;
            }
        }
    }
    info.maskRoot = maskRoot;
    return info;
}

function examineBubblingPath(el:Element):IExamineSingleCandidateResult {
    let maskRoot:Element;
    let hasArtificialStackingContextRoot = false;

    let info:IExamineSingleCandidateResult;
    const root = el;
    while (el) {
        if (!isElement(el)) { break; }
        if (!info || !info.hasDefaultEventHandler) {
            info = getDefaultEventHandlerTarget(el);
        }
        if (!hasArtificialStackingContextRoot && isArtificialStackingContextRoot(el)) {
            hasArtificialStackingContextRoot = true;
            if (maskContentTest(root)) {
                maskRoot = el;
            }
        }
        el = el.parentElement;
    }
    info.maskRoot = maskRoot;
    return info;
}

class DispatchMouseEventMessageHandler implements IMessageHandler<initMouseEventsTuple> {
    handleMessage(initMouseEventArgs:initMouseEventsTuple):void {
        const clientX = initMouseEventArgs[7];
        const clientY = initMouseEventArgs[8];
        const target = this.hub.hostWindow.document.elementFromPoint(clientX, clientY);
        this.dispatchMouseEventOnTarget(initMouseEventArgs, target);
    }

    dispatchMouseEventOnTarget(args:initMouseEventsTuple, target:Element) {
        if (isIFrame(target)) {
            const rect = target.getBoundingClientRect();
            args[7] -= rect.left;
            args[8] -= rect.top;
            args[3] = null; // Window object cannot be cloned
            this.hub.trigger<initMouseEventsTuple>(
                MessageTypes.DISPATCH_MOUSE_EVENT,
                args,
                getContentWindow.call(target),
            );
        } else {
            this.performClickOnTarget(<HTMLElement>target);
        }
    }

    private pressed = false;

    private performClickOnTarget(target:HTMLElement) {
        // The purpose of this is to prevent triggering click for both `mousedown` and `click`,
        // or `mousedown` and `mouseup`.
        if (this.pressed) { return; }
        this.pressed = true;
        setTimeout(() => {
            this.pressed = false;
        }, 100);
        // Using click(). Manually dispatching a cloned event may not trigger an intended behavior.
        // For example, when a cloned mousedown event is dispatched to a target and a real mouseup
        // event is dispatched to the target, it won't cause a `click` event.
        target.click();
    }

    constructor(
        private hub:InterContextMessageHubInterface,
    ) { }
}

let mainFrameMessageHandler:DispatchMouseEventMessageHandler;

export function installDispatchMouseEventMessageTransferrer(messageHub:InterContextMessageHubInterface) {
    const handler = new DispatchMouseEventMessageHandler(messageHub);
    messageHub.on<initMouseEventsTuple>(MessageTypes.DISPATCH_MOUSE_EVENT, handler);
    if (messageHub === adguard.messageHub) {
        mainFrameMessageHandler = handler;
    }
}

interface initMouseEventsTuple {
    0:string, // type
    1:boolean, // canBubble
    2:boolean, // cancelable
    3:Window, // view
    4:number, // detail
    5:number, // screenX
    6:number, // screenY
    7:number, // clientX
    8:number, // clientY
    9:boolean, // ctrlKey
    10:boolean, // altKey
    11:boolean, // shiftKey
    12:boolean, // metaKey
    13:number, // button
    14:EventTarget // relatedTarget
}

const initMouseEventArgs = [
    'type',
    'canBubble',
    'cancelable',
    'view',
    'detail',
    'screenX',
    'screenY',
    'clientX',
    'clientY',
    'ctrlKey',
    'altKey',
    'shiftKey',
    'metaKey',
    'button',
    'relatedTarget',
];

/**
 * Some popup scripts adds transparent overlays on each of page's links which disappears only when
 * popups are opened. To restore the expected behavior, we need to detect if the event is 'masked'
 * by artificial layers and redirect it to the correct element.

 * examineTarget function examines target and performs operations that are sensitive to the
 * inspected information.
 *
 *  - Neutralizes masks
 *  - Dispatch mouse event to shadowed targets if there was at least one mask above it
 *  - Set beforeunload event handler if target won't trigger navigation
 *  - If "real intended target" is an anchor, having href identical to the "popup url", abort.
 *
 * bubbling
 *    ^
 *    |                                                                   Goal(needsRecovery, not maskLike)
 *    |
 *    |      ⋮
 *    |    el_02                                  ⋮
 *    |    el_01            el_11     el_a1
 *    |   (target = el_00)  el_10  …  el_a0 el_a+10 (=el_a1)
 *                          --------------------------------------------------> ElementsFromPoint
 *
 *  When an element Goal was found, it should neutralize all maskLikes met during the search.
 *
 *  [needsRecovery] IFRAME, A, INPUT, BUTTON, AREA,
 *         has either of: onclick, onmousedown, onmouseup attributes
 *  [maskLike] Let R be the closest stacking context of E.
 *         If R has very high z-index, and E is very empty.
 *         every element between E and R must be invisible or barely be contained in E.
 *         E almost covers T.
 *
 * @todo We may need to prevent `preventDefault` in touch events
 */
const examineTarget = elementsFromPoint ? (currentEvent:Event, popupHref:string, popupContext?:PopupContext):void => {
    log.print('Event is:', currentEvent);
    if (!currentEvent.isTrusted) { return; }
    let target:EventTarget;
    let x:number; let
        y:number;
    // Normalize mouseevent and touchevent
    if (isMouseEvent(currentEvent)) {
        // mouse event
        log.print('It is a mouse event');
        target = currentEvent.target;
        x = currentEvent.clientX;
        y = currentEvent.clientY;
    } else if (isTouchEvent(currentEvent)) {
        // This is just a stuff. It needs more research.
        target = currentEvent.target;
        const touch = currentEvent.changedTouches[0];
        if (!touch) { return; }
        x = touch.clientX;
        y = touch.clientY;
    }
    if (!target || !isElement(target)) { return; }

    /**
     * Use Document#elementsFromPoint API to get a candidate of real target.
     * It is IMPORTANT to call this api on a context where the event is originating from,
     * otherwise the result can be platform-dependent.
     */
    const originDocument = (<MouseEvent | TouchEvent>currentEvent).view.document;
    const candidates:Element[] | NodeListOf<Element> = elementsFromPoint.call(originDocument, x, y);
    if (!candidates) { return; }
    log.print('ElementsFromPoint:', candidates);

    const potentialMaskData:{ maskRoot:Element, mask:Element }[] = [];

    let candidate:Element = target;
    let result:IExamineSingleCandidateResult;

    if (candidate !== candidates[0]) {
        log.print('target has modified within event handlers');
    }

    /**
     * @return true if found a goal; false if we should stop iterating over candidates
     * undefined otherwise;
     */
    // eslint-disable-next-line consistent-return
    const subroutine_forSingleCandidate = () => {
        if (result.hasDefaultEventHandler) {
            if (!result.maskRoot) {
                // this is the candidate. do things with this
                return true;
            }
            // Otherwise, we do maskContentTest and prevent pointer event
            preventPointerEvent(candidate);
        } else if (result.maskRoot) {
            // Put this to a list of potential mask elements.
            potentialMaskData.push({
                maskRoot: result.maskRoot,
                mask: candidate,
            });
        } else {
            // Not a needsRecovery, nor a mask,
            // It means we need to quit this
            setBeforeunloadHandler();
            return false;
        }
    };

    subroutine_iterateUntilGoal: {
        // Un-rolling first iteration, to use `event.path` when supported.
        if (getEventPath) {
            candidate = target;
            result = examineEventPath(getEventPath.call(currentEvent));
            const flag = subroutine_forSingleCandidate();
            if (flag === true) {
                break subroutine_iterateUntilGoal;
            } else if (flag === false) {
                return;
            }
        }

        for (let i = getEventPath && candidates[0] === target ? 1 : 0, l = candidates.length; i < l; i += 1) {
            candidate = candidates[i];
            result = examineBubblingPath(candidate);
            const flag = subroutine_forSingleCandidate();
            if (flag === true) {
                break subroutine_iterateUntilGoal;
            } else if (flag === false) {
                return;
            }
        }
    }

    // We have a defaultEventHandler, and a several masklikes above it.
    const { defaultEventHandlerTarget } = result;
    if (defaultEventHandlerTarget) {
        if (popupContext) {
            popupContext.defaultEventHandlerTarget = defaultEventHandlerTarget;
        }
        if (popupHref === defaultEventHandlerTarget) {
            log.print('Throwing, because the target url is an href of an eventTarget or its ancestor');
            abort();
        }
    }

    // We first check that those masks are real masks.
    let subroutine_checkMaskData_returnValueBuffer = true;
    subroutine_checkMaskData: {
        if (potentialMaskData.length === 0) {
            subroutine_checkMaskData_returnValueBuffer = false;
            break subroutine_checkMaskData;
        }
        const { innerWidth: w, innerHeight: h } = originDocument.defaultView;

        const candidateRect = candidate.getBoundingClientRect(); <HTMLElement>candidate;
        for (let i = 0, l = potentialMaskData.length; i < l; i += 1) {
            const maskData = potentialMaskData[i];
            if (!maskContentTest(maskData.mask)) {
                subroutine_checkMaskData_returnValueBuffer = false;
                break subroutine_checkMaskData;
            }
            const {
                left, right, top, bottom,
            } = candidate.getBoundingClientRect();
            if (
                (
                    numsAreClose(candidateRect.top, top, 1)
                    && numsAreClose(candidateRect.left, left, 1)
                    && numsAreClose(candidateRect.bottom, bottom, 1)
                    && numsAreClose(candidateRect.right, right, 1)
                ) || rectAlmostCoversView(candidateRect, w, h)
            ) {
                // All good
            } else {
                subroutine_checkMaskData_returnValueBuffer = false;
                break subroutine_checkMaskData;
            }
        }
        // All good
    }

    if (subroutine_checkMaskData_returnValueBuffer) {
        // Neutralize masks
        for (let i = 0, l = potentialMaskData.length; i < l; i += 1) {
            const maskData = potentialMaskData[i];
            preventPointerEvent(maskData.maskRoot);
        }
        const args = <initMouseEventsTuple><any>initMouseEventArgs.map((prop) => currentEvent[prop]);
        mainFrameMessageHandler.dispatchMouseEventOnTarget(args, candidate);
    }
} : () => {};

export default log.connect(examineTarget, 'Examining Target');
