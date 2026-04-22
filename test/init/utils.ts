import { isOptionsPage } from '../../src/init/utils';
import { OPTIONS_PAGE_URL, OPTIONS_PAGE_URL_ALIAS } from '../../src/shared/constants';

const { expect } = chai;

const createMockWindow = (href: string) => ({
    location: { href },
}) as unknown as Window & typeof globalThis;

describe('isOptionsPage', () => {
    it('matches channeled options page URL', () => {
        // OPTIONS_PAGE_URL has build-time placeholders in test builds,
        // but we test against whatever value the constant holds
        const win = createMockWindow(OPTIONS_PAGE_URL);
        expect(isOptionsPage(win)).to.equal(true);
    });

    it('matches channeled alias options page URL', () => {
        const win = createMockWindow(OPTIONS_PAGE_URL_ALIAS);
        expect(isOptionsPage(win)).to.equal(true);
    });

    it('matches root-level options page URL', () => {
        const win = createMockWindow('https://popupblocker.adguard.com/options.html');
        expect(isOptionsPage(win)).to.equal(true);
    });

    it('matches localhost options page URL', () => {
        const win = createMockWindow('http://localhost:8080/options.html');
        expect(isOptionsPage(win)).to.equal(true);
    });

    it('matches 127.0.0.1 options page URL', () => {
        const win = createMockWindow('http://127.0.0.1:3000/path/options.html');
        expect(isOptionsPage(win)).to.equal(true);
    });

    it('does not match unrelated URLs', () => {
        const win = createMockWindow('https://example.com/options.html');
        expect(isOptionsPage(win)).to.equal(false);
    });

    it('does not match non-options pages on the same domain', () => {
        const win = createMockWindow('https://popupblocker.adguard.com/index.html');
        expect(isOptionsPage(win)).to.equal(false);
    });
});
