import { setBeforeunloadHandler } from '../dom/unload';
import { hasDefaultHandler, maskContentTest, maybeOverlay, isArtificialStackingContextRoot } from './element_tests';
import { isMouseEvent, isTouchEvent, isElement, isHTMLElement, isIFrame } from '../shared/instanceof';
import { matches, closest, getTagName } from '../shared/dom';
import abort from '../shared/abort';
import * as log from '../shared/debug';
import adguard from '../page_script_namespace';
import IInterContextMessageHub, { IMessageHandler } from '../messaging/IInterContextMessageHub';
import { getContentWindow, getOwnPropertyDescriptor } from '../shared/protected_api';
import { MessageTypes } from '../messaging/MessageTypes';

const elementsFromPoint = document.elementsFromPoint || document.msElementsFromPoint;

const getEventPath = (function() {
    const eventPType = Event.prototype;
    let pathDesc = getOwnPropertyDescriptor(eventPType, 'path');
    return pathDesc ? pathDesc.get : eventPType.composedPath;
})();

/**
 * Some popup scripts adds transparent overlays on each of page's links which disappears only when
 * popups are opened. To restore the expected behavior, we need to detect if the event is 'masked'
 * by artificial layers and redirect it to the correct element.
 
 * examineTarget function examines target and performs operations that are sensitive to the
 * inspected information.
 * 
 *  - Neutralizes masks
 *  - Dispatch mouse event to shadowed targets if there were masks
 *  - Set beforeunload event handler if target won't trigger navigation
 *  - If "real intended target" is an anchor, having href identical to the "popup url", abort.
 *
 * bubbling 
 *    ^ 
 *    |                                                                   T(needsRecovery, not maskLike)
 *    |
 *    |      ⋮ 
 *    |    el_02                                  ⋮
 *    |    el_01            el_11     el_a1
 *    |   (target = el_00)  el_10  …  el_a0 el_a+10 (=el_a1)
 *                          --------------------------------------------------> ElementsFromPoint
 * 
 *  When an element T was found, it should neutralize all maskLikes met during the search.
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
const examineTarget = elementsFromPoint ? (currentEvent:Event, popupHref:string):void => {
    log.print('Event is:', currentEvent);
    if (!currentEvent.isTrusted) { return; }
    let target:EventTarget;
    let x:number, y:number;
    let a:number;
    // Normalize mouseevent and touchevent
    if (isMouseEvent(currentEvent)) {
        // mouse event
        log.print("It is a mouse event");
        target = currentEvent.target;
        x = currentEvent.clientX;
        y = currentEvent.clientY;
    } else if (isTouchEvent(currentEvent)) {
        // This is just a stuff. It needs more research.
        target = currentEvent.target;
        let touch = currentEvent.changedTouches[0];
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
    const originDocument = (<MouseEvent|TouchEvent>currentEvent).view.document;
    let candidates:Element[]|NodeListOf<Element> = elementsFromPoint.call(originDocument, x, y);
    if (!candidates) { return; }
    log.print('ElementsFromPoint:', candidates);

    const potentialMaskData:{maskRoot:Element, mask:Element}[] = [];

    let candidate:Element;
    let result:IExamineSingleCandidateResult;

    /**
     * @return true if found a goal; false if we should stop iterating over candidates
     * undefined otherwise;
     */
    const onExamineResult = (result:IExamineSingleCandidateResult) => {
        if (result.hasDefaultEventHandler) {
            if (!result.maskRoot) {
                // this is the candidate. do things with this
                return true;
            }
            // Otherwise, we do maskContentTest and prevent pointer event
            preventPointerEvent(candidate);
        } else {
            if (result.maskRoot) {
                // Put this to a list of potential mask elements.
                potentialMaskData.push({
                    maskRoot: result.maskRoot,
                    mask: candidate
                });
            } else {
                // Not a needsRecovery, nor a mask,
                // It means we need to quit this
                setBeforeunloadHandler();
                return false;
            }
        }
    }

    iterateUntilFindTargetThatNeedsRecovery: {
        if (getEventPath) {
            // If event.path is supported, use it
            result = examineEventPath(getEventPath.call(currentEvent));
            let flag = onExamineResult(result);
            if (flag === true) {
                break iterateUntilFindTargetThatNeedsRecovery;
            } else if (flag === false) {
                return;
            }
        }

        for (let i = getEventPath && candidates[0] === target ? 1 : 0, l = candidates.length; i < l; i++) {
            candidate = candidates[0];
            result = examineBubblingPath(candidate);
            let flag = onExamineResult(result);
            if (flag === true) {
                break iterateUntilFindTargetThatNeedsRecovery;
            } else if (flag === false) {
                return;
            }
        }
    }

    // We have a defaultEventHandler, and a several masklikes above it.
    if (popupHref === result.defaultEventHandlerTarget) {
        log.print("Throwing, because the target url is an href of an eventTarget or its ancestor");
        abort();
    }

    // We first check that those masks are real 'Msks'. 
    
    const checkMaskData = () => {
        let candidateRect = candidate.getBoundingClientRect();<HTMLElement>candidate;
        for (let maskData of potentialMaskData) {
            if (!maskContentTest(maskData.mask)) {
                return false;
            }
            let maskRect = candidate.getBoundingClientRect();
            if (
                valuesAreClose(candidateRect.top, maskRect.top, 1) && 
                valuesAreClose(candidateRect.left, maskRect.left, 1) && 
                valuesAreClose(candidateRect.bottom, maskRect.bottom, 1) &&
                valuesAreClose(candidateRect.right, maskRect.right, 1)
            ) {
                // All good
            } else {
                // Not good
                return false;
            }
        }
        // All good
        return true;
    };

    if (checkMaskData()) {
        // Neutralize masks
        for (let maskData of potentialMaskData) {
            preventPointerEvent(maskData.maskRoot);
        }
        let args = <initMouseEventArgs><any>initMouseEventArgs.map((prop) => currentEvent[prop]);
        mainFrameMessagHandler.dispatchMouseEventOnTarget(args, candidate);
    }
} : () => {};

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
    for (let i = 0, l = path.length; i < l; i++) {
        let el = path[i];
        if (!isElement(el)) { break; }
        if (!info.hasDefaultEventHandler) {
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

    let info:IExamineSingleCandidateResult
    let root = el;
    while (el) {
        if (!isElement(el)) { break; }
        if (!info.hasDefaultEventHandler) {
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

function getDefaultEventHandlerTarget(el:Element):DefaultEventHandlerInfo {
    let hasDefaultEventHandler = false;
    let defaultEventHandlerTarget = null;
    let target = closest(el, 'iframe,input,a,area,button,[onclick],[onmousedown],[onmouseup]');
    if (target) {
        hasDefaultEventHandler = true;
        let tagName = getTagName(target);
        if (tagName === 'A' || tagName === 'AREA')   {
            defaultEventHandlerTarget = (<HTMLAnchorElement|HTMLAreaElement>target).href;
        }
    }
    return { hasDefaultEventHandler, defaultEventHandlerTarget };
}


export const preventPointerEvent = (el:Element):void => {
    if (!isHTMLElement(el)) { return; }
    el.style.setProperty('display', "none", important);
    el.style.setProperty('pointer-events', "none", important);
};

var important = 'important';

export default log.connect(examineTarget, 'Examining Target');

let mainFrameMessagHandler:DispatchMouseEventMessageHandler;

export function installDispatchMouseEventMessageTransferrer(messageHub:IInterContextMessageHub) {
    const handler = new DispatchMouseEventMessageHandler(messageHub);
    messageHub.on<initMouseEventArgs>(MessageTypes.DISPATCH_MOUSE_EVENT, handler);
    if (messageHub === adguard.messageHub) {
        mainFrameMessagHandler = handler;
    }
}

class DispatchMouseEventMessageHandler implements IMessageHandler<initMouseEventArgs> {
    handleMessage(initMouseEventArgs:initMouseEventArgs, source?:Window):void {
        const clientX = initMouseEventArgs[7];
        const clientY = initMouseEventArgs[8];
        const target = this.hub.hostWindow.document.elementFromPoint(clientX, clientY);
        this.dispatchMouseEventOnTarget(initMouseEventArgs, target);
    }
    dispatchMouseEventOnTarget(args:initMouseEventArgs, target:Element) {
        if (isIFrame(target)) {
            let rect = target.getBoundingClientRect();
            args[7] -= rect.left;
            args[8] -= rect.top;
            args[3] = null; // Window object cannot be cloned
            this.hub.trigger<initMouseEventArgs>(MessageTypes.DISPATCH_MOUSE_EVENT, args, getContentWindow.call(target));
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
        private hub:IInterContextMessageHub
    ) { }
}

const initMouseEventArgs = 'type,canBubble,cancelable,view,detail,screenX,screenY,clientX,clientY,ctrlKey,altKey,shiftKey,metaKey,button,relatedTarget'.split(',');

interface initMouseEventArgs {
    0:string,       // type
    1:boolean,      // canBubble
    2:boolean,      // cancelable
    3:Window,       // view
    4:number,       // detail
    5:number,       // screenX
    6:number,       // screenY
    7:number,       // clientX
    8:number,       // clientY
    9:boolean,      // ctrlKey
    10:boolean,     // altKey
    11:boolean,     // shiftKey
    12:boolean,     // metaKey
    13:number,      // button
    14:EventTarget  // relatedTarget
}
function valuesAreClose (x:number, y: number, threshold:number) {
    return (((x - y) / threshold) | 0) === 0;
}