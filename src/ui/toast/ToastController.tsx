import { render } from 'preact';
import { isUndef, functionBind } from '../../shared';
import { FrameInjector, IFrameInjector } from '../utils/FrameInjector';
import { concatStyle } from '../utils/ui-utils';
import TextSizeWatcher from '../utils/TextSizeWatcher';

import { NotificationHead, Toast } from '../../pages/notifications/components';

const px = 'px';

const enum ToastState {
    NONE,
    WAXING,
    FULL,
    WANING,
}

export default class ToastController {
    constructor(
        private defaultDuration?:number,
    ) {
        this.updateIframePosition = functionBind.call(this.updateIframePosition, this);
        this.updateIframePositionOnLoad = functionBind.call(this.updateIframePositionOnLoad, this);
    }

    private $state: ToastState = ToastState.NONE;

    private stateTransitionTimer?: number | ReturnType<typeof setTimeout>;

    private currentDuration: number | undefined;

    private toastEl?: Element | null;

    private textSizeWatcher?: TextSizeWatcher;

    private frameInjector?: IFrameInjector;

    // private static TOAST_STYLE = RESOURCE_TOAST_CSS;

    private static TOAST_FRAME_STYLE = [
        'position', 'fixed',
        'bottom', 15 + px,
        'width', 0 + px,
        'height', 0 + px,
        'border', 'none',
        // eslint-disable-next-line no-bitwise
        'z-index', String(-1 - (1 << 31)),
    ];

    private static TRANSITION_DURATION = 300;

    showNotification(message: string) {
        // Stores duration of the current toast
        this.currentDuration = this.defaultDuration;

        // Dismiss existing toast, if there was any.
        const prevState = this.$state;
        this.dismissCurrentNotification();

        const frameInjector = this.frameInjector = new FrameInjector();
        frameInjector.getFrameElement().style.cssText = concatStyle(ToastController.TOAST_FRAME_STYLE, false);

        frameInjector.addListener(() => {
            if (isUndef(this.frameInjector)) { return; }
            const iframe = this.frameInjector.getFrameElement();
            const doc = iframe.contentDocument;
            const head = doc?.documentElement.querySelector('head');

            if (head && doc) {
                render(<NotificationHead />, head);
                render(<Toast message={message} />, doc?.body);
            }

            this.toastEl = doc?.querySelector('.toast');
        });

        frameInjector.addListener(this.updateIframePositionOnLoad);

        frameInjector.addListener(() => {
            this.setState(
                prevState === ToastState.FULL || prevState === ToastState.WANING
                    ? ToastState.FULL
                    : ToastState.WAXING,
            );
        });

        frameInjector.inject();
    }

    private updateIframePositionOnLoad() {
        if (this.toastEl) {
            this.updateIframePosition();

            const textSizeWatcher = this.textSizeWatcher = new TextSizeWatcher(this.toastEl);
            textSizeWatcher.addListener(this.updateIframePosition);
        }
    }

    private updateIframePosition() {
        const styleTag = this.toastEl?.firstElementChild;
        if (styleTag) {
            // @ts-ignore
            const { offsetWidth, offsetHeight } = styleTag;
            const iframeStyle = this.frameInjector?.getFrameElement().style;
            if (iframeStyle) {
                iframeStyle.left = `calc(50% - ${offsetWidth / 2}px)`;
                iframeStyle.width = offsetWidth + px;
                iframeStyle.height = offsetHeight + px;
            }
        }
    }

    dismissCurrentNotification() {
        const { frameInjector } = this;
        if (isUndef(frameInjector)) { return; }
        frameInjector.$destroy();
        clearTimeout(this.stateTransitionTimer);

        const { textSizeWatcher } = this;
        if (isUndef(textSizeWatcher)) { return; }
        textSizeWatcher.$destroy();

        this.frameInjector = this.toastEl = this.stateTransitionTimer = this.textSizeWatcher = undefined;
    }

    private setState(state:ToastState) {
        clearTimeout(this.stateTransitionTimer);
        switch (state) {
            case ToastState.WAXING:
                requestAnimationFrame(() => {
                    this.toastEl?.classList.add('toast--active');
                });
                this.stateTransitionTimer = setTimeout(() => {
                    this.setState(ToastState.FULL);
                }, ToastController.TRANSITION_DURATION);
                break;
            case ToastState.FULL:
                this.toastEl?.classList.add('toast--active');
                this.stateTransitionTimer = setTimeout(() => {
                    this.setState(ToastState.WANING);
                }, this.currentDuration);
                break;
            case ToastState.WANING:
                this.toastEl?.classList.remove('toast--active');
                this.stateTransitionTimer = setTimeout(() => {
                    this.setState(ToastState.NONE);
                }, ToastController.TRANSITION_DURATION);
                break;
            case ToastState.NONE:
                this.dismissCurrentNotification();
                this.stateTransitionTimer = undefined;
                break;
            default:
                break;
        }
        this.$state = state;
    }
}
