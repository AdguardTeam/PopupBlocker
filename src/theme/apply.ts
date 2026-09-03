import { Theme, THEME_ATTR } from './constants';

/**
 * Narrows an arbitrary stored value to a known theme.
 *
 * @param value raw value read from storage
 * @returns the theme, or null if nothing valid is stored
 */
export const parseTheme = (value: unknown): Theme | null => (
    value === Theme.Light || value === Theme.Dark ? value : null
);

/**
 * Reads the theme the operating system asks for.
 *
 * Only needed to label the theme switch — the stylesheets follow the OS on their own
 * through `prefers-color-scheme`. `matchMedia` is therefore treated as best-effort: if it
 * is missing or throws, we fall back to light rather than letting the failure propagate.
 * Callers include notification rendering, where a throw would abort the whole alert.
 *
 * @param context window to read the media query from
 * @returns the OS theme, or light if it cannot be read
 */
export const getSystemTheme = (context: Window): Theme => {
    try {
        return context.matchMedia('(prefers-color-scheme: dark)').matches
            ? Theme.Dark
            : Theme.Light;
    } catch (e) {
        return Theme.Light;
    }
};

/**
 * Pins an explicitly chosen theme on a document, or hands control back to the
 * `prefers-color-scheme` rules when there is no choice to honour.
 *
 * Leaving the attribute off in the latter case is deliberate: it lets the stylesheets
 * follow the OS natively, in every browser, with no JS involved — including ones whose
 * `MediaQueryList` predates `addEventListener`.
 *
 * @param doc document to theme, e.g. a notification iframe's document
 * @param stored stored theme, or null to follow the OS
 */
export const applyStoredTheme = (doc: Document, stored: Theme | null): void => {
    if (stored) {
        doc.documentElement.setAttribute(THEME_ATTR, stored);
    } else {
        doc.documentElement.removeAttribute(THEME_ATTR);
    }
};

/**
 * Returns the theme opposite to the given one.
 *
 * @param theme current theme
 * @returns the other theme
 */
export const oppositeTheme = (theme: Theme): Theme => (
    theme === Theme.Dark ? Theme.Light : Theme.Dark
);
