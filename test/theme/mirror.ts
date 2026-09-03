import {
    readThemeMirror,
    Theme,
    THEME_MIRROR_KEY,
    writeThemeMirror,
} from '../../src/theme';

const { expect } = chai;

describe('theme mirror', () => {
    const clear = () => {
        window.localStorage.removeItem(THEME_MIRROR_KEY);
    };

    beforeEach(clear);
    afterEach(clear);

    it('reads null when nothing is mirrored', () => {
        expect(readThemeMirror()).to.equal(null);
    });

    it('round-trips a stored choice', () => {
        writeThemeMirror(Theme.Dark);
        expect(window.localStorage.getItem(THEME_MIRROR_KEY)).to.equal('dark');
        expect(readThemeMirror()).to.equal(Theme.Dark);
    });

    it('reads null for a value that is not a theme', () => {
        window.localStorage.setItem(THEME_MIRROR_KEY, 'blue');
        expect(readThemeMirror()).to.equal(null);
    });

    it('survives the storage being unavailable', function () {
        // Cookies being blocked makes the `localStorage` getter itself throw; imitate that.
        const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
        if (!descriptor || !descriptor.configurable) {
            this.skip();
            return;
        }
        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            get: () => {
                throw new Error('blocked');
            },
        });
        try {
            expect(() => writeThemeMirror(Theme.Dark)).to.not.throw();
            expect(readThemeMirror()).to.equal(null);
        } finally {
            Object.defineProperty(window, 'localStorage', descriptor);
        }
    });
});
