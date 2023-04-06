/**
 * @fileoverview This instance enables firing callbacks when text size changes, e.g. due to external font being applied.
 * The logic is exactly the same as one described in http://smnh.me/web-font-loading-detection-without-timers/
 */

import { SingleEventEmitter } from '../../shared';

const px = 'px';

export default class TextSizeWatcher extends SingleEventEmitter {
    constructor(private root:Element) {
        super('scroll');
        this.createDetectorElement();
    }

    /**
     * Returns !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz
     */
    private static getTestText() {
        const codePoints = [];
        for (let i = 0x21; i <= 0x7a; i += 1) {
            codePoints.push(i);
        }
        return String.fromCharCode.apply(null, codePoints);
    }

    private wrapper:HTMLElement;

    private innerWrapper:HTMLElement;

    private createDetectorElement() {
        const document = this.root.ownerDocument;
        const wrapper = this.wrapper = document.createElement('div');
        const content = document.createElement('div');
        const innerWrapper = this.innerWrapper = document.createElement('div');
        const innerContent = document.createElement('div');
        wrapper.style.cssText = 'left:9999px;positiion:absolute;overflow:hidden';
        content.style.cssText = 'position:relative;white-space:nowrap;font-family:serif';
        innerWrapper.style.cssText = 'position:absolute;width:100%;height:100%;overflow:hidden';

        const contentText = document.createTextNode(TextSizeWatcher.getTestText());
        content.appendChild(contentText);

        wrapper
            .appendChild(content)
            .appendChild(innerWrapper)
            .appendChild(innerContent);

        this.root.appendChild(wrapper);

        const { offsetWidth, offsetHeight } = content;

        const wrapperStyle = wrapper.style;
        const innerContentStyle = innerContent.style;

        wrapperStyle.width = innerContentStyle.width = offsetWidth - 1 + px;
        wrapperStyle.height = innerContentStyle.height = offsetHeight - 1 + px;

        TextSizeWatcher.scrollElementToBottomRightCorner(wrapper);
        TextSizeWatcher.scrollElementToBottomRightCorner(innerContent);

        this.$install(wrapper);
        this.$install(innerWrapper);
    }

    private static scrollElementToBottomRightCorner(el:HTMLElement) {
        const {
            scrollWidth, clientWidth, scrollHeight, clientHeight,
        } = el;
        // eslint-disable-next-line no-param-reassign
        el.scrollLeft = scrollWidth - clientWidth;
        // eslint-disable-next-line no-param-reassign
        el.scrollTop = scrollHeight - clientHeight;
    }

    $destroy() {
        this.$uninstall(this.wrapper);
        this.$uninstall(this.innerWrapper);
    }
}
