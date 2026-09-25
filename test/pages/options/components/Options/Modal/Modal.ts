import { h, render } from 'preact';
import { Modal } from '../../../../../../src/pages/options/components/Options/Modal/Modal';

const { expect } = chai;

describe('Options modal close icon', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        render(null, container);
        container.remove();
    });

    it('closes the modal when the shared SVG artwork is clicked', () => {
        let closed = false;
        render(h(Modal, {
            hideModal: () => { closed = true; },
            addItem: () => {},
        }), container);

        const icon = container.querySelector('.settings__close svg');
        expect(icon.getBoundingClientRect().width).to.equal(15);
        expect(icon.getBoundingClientRect().height).to.equal(15);
        expect(icon.getAttribute('aria-hidden')).to.equal('true');
        icon.querySelector('path').dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(closed).to.equal(true);
    });
});
