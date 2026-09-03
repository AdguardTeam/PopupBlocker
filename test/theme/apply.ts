import {
    applyStoredTheme,
    getSystemTheme,
    oppositeTheme,
    parseTheme,
    Theme,
} from '../../src/theme';
import { THEME_ATTR } from '../../src/theme/constants';

const { expect } = chai;

describe('parseTheme', () => {
    it('accepts the known themes', () => {
        expect(parseTheme('light')).to.equal(Theme.Light);
        expect(parseTheme('dark')).to.equal(Theme.Dark);
    });

    it('treats an empty value as "follow the OS"', () => {
        expect(parseTheme('')).to.equal(null);
        expect(parseTheme(null)).to.equal(null);
        expect(parseTheme(undefined)).to.equal(null);
    });

    it('rejects strings that are not exactly a theme', () => {
        expect(parseTheme('Dark')).to.equal(null);
        expect(parseTheme(' dark')).to.equal(null);
        expect(parseTheme('dark ')).to.equal(null);
        expect(parseTheme('auto')).to.equal(null);
        expect(parseTheme('system')).to.equal(null);
    });

    it('rejects values of other types', () => {
        expect(parseTheme(0)).to.equal(null);
        expect(parseTheme(1)).to.equal(null);
        expect(parseTheme(true)).to.equal(null);
        expect(parseTheme({})).to.equal(null);
        expect(parseTheme(['dark'])).to.equal(null);
        expect(parseTheme({ toString: () => 'dark' })).to.equal(null);
    });
});

describe('oppositeTheme', () => {
    it('flips between the two themes', () => {
        expect(oppositeTheme(Theme.Light)).to.equal(Theme.Dark);
        expect(oppositeTheme(Theme.Dark)).to.equal(Theme.Light);
    });

    it('is its own inverse', () => {
        expect(oppositeTheme(oppositeTheme(Theme.Light))).to.equal(Theme.Light);
        expect(oppositeTheme(oppositeTheme(Theme.Dark))).to.equal(Theme.Dark);
    });
});

describe('applyStoredTheme', () => {
    // A throwaway document, so that the test runner's own page is never themed
    let doc: Document;

    beforeEach(() => {
        doc = document.implementation.createHTMLDocument('');
    });

    it('pins an explicit choice on the root element', () => {
        applyStoredTheme(doc, Theme.Dark);
        expect(doc.documentElement.getAttribute(THEME_ATTR)).to.equal('dark');

        applyStoredTheme(doc, Theme.Light);
        expect(doc.documentElement.getAttribute(THEME_ATTR)).to.equal('light');
    });

    it('removes the attribute when there is no choice, handing control to the OS rules', () => {
        doc.documentElement.setAttribute(THEME_ATTR, Theme.Dark);

        applyStoredTheme(doc, null);
        expect(doc.documentElement.hasAttribute(THEME_ATTR)).to.equal(false);
    });

    it('leaves a document that already follows the OS untouched', () => {
        applyStoredTheme(doc, null);
        expect(doc.documentElement.hasAttribute(THEME_ATTR)).to.equal(false);
    });

    it('writes a value that parseTheme reads back', () => {
        applyStoredTheme(doc, Theme.Dark);
        expect(parseTheme(doc.documentElement.getAttribute(THEME_ATTR))).to.equal(Theme.Dark);
    });
});

describe('getSystemTheme', () => {
    const createMockWindow = (matchMedia?: () => unknown) => ({ matchMedia }) as unknown as Window;

    it('reports dark when the media query matches', () => {
        const win = createMockWindow(() => ({ matches: true }));
        expect(getSystemTheme(win)).to.equal(Theme.Dark);
    });

    it('reports light when the media query does not match', () => {
        const win = createMockWindow(() => ({ matches: false }));
        expect(getSystemTheme(win)).to.equal(Theme.Light);
    });

    it('falls back to light when matchMedia is missing', () => {
        const win = createMockWindow(undefined);
        expect(getSystemTheme(win)).to.equal(Theme.Light);
    });

    it('falls back to light when matchMedia throws', () => {
        const win = createMockWindow(() => { throw new Error('not allowed'); });
        expect(getSystemTheme(win)).to.equal(Theme.Light);
    });
});
