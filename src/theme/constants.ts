/**
 * Available themes.
 *
 * Note that "follow the operating system" is not a member here — it is represented by
 * the absence of a stored value, which lets the `prefers-color-scheme` rules in
 * `src/pages/common/styles/blocks/theme.pcss` take over.
 */
export const enum Theme {
    Light = 'light',
    Dark = 'dark',
}

/**
 * Attribute set on `<html>` to force a theme regardless of the OS setting.
 * Must stay in sync with the `[data-theme]` selectors in `theme.pcss`.
 */
export const THEME_ATTR = 'data-theme';

/**
 * Key of the options page's `localStorage` mirror of the stored theme.
 *
 * The options page is a plain web page, so it cannot reach the userscript storage until
 * the userscript exposes it (which takes up to a second, and never happens when the
 * userscript is not installed). The mirror lets the page render in the right theme
 * immediately and keeps the switch working on its own.
 */
export const THEME_MIRROR_KEY = 'popupblocker-theme';
