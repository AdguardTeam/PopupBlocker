import { Theme, THEME_MIRROR_KEY } from './constants';
import { parseTheme } from './apply';

/**
 * The options page's `localStorage` mirror of the stored theme.
 * See `THEME_MIRROR_KEY` for why the page keeps one.
 */

/**
 * Reads the mirror. Wrapped because `localStorage` throws when cookies are blocked.
 *
 * @returns the mirrored theme, or null if there is none or the storage is unavailable
 */
export const readThemeMirror = (): Theme | null => {
    try {
        return parseTheme(window.localStorage.getItem(THEME_MIRROR_KEY));
    } catch (e) {
        return null;
    }
};

/**
 * Writes the mirror.
 *
 * @param theme the choice to mirror
 */
export const writeThemeMirror = (theme: Theme): void => {
    try {
        window.localStorage.setItem(THEME_MIRROR_KEY, theme);
    } catch (e) {
        // storage is unavailable, the choice simply won't survive a reload
    }
};
