import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'preact/hooks';
import {
    applyStoredTheme,
    getSystemTheme,
    oppositeTheme,
    parseTheme,
    readThemeMirror,
    Theme,
    THEME_MIRROR_KEY,
    writeThemeMirror,
} from '../../../theme';
import { OPTIONS_API_PROP, THEME_OPTION_PROP } from '../../../shared/constants';
import { AppState } from '../constants';

/**
 * Reads the theme option from the userscript, if the userscript is present.
 *
 * The options page is also served to visitors without the userscript installed,
 * so this is expected to be missing.
 *
 * @returns the theme option, or undefined if the userscript is not present
 */
const getThemeOption = () => window[OPTIONS_API_PROP]?.[THEME_OPTION_PROP];

/**
 * Subscribes to theme changes made in another options page tab.
 *
 * Writing the `localStorage` mirror raises a `storage` event in every other same-origin
 * document, so a toggle in one tab reaches the rest. The event never fires in the tab
 * that made the change, so the toggle itself needs no guard against it.
 *
 * The new theme is taken from the event rather than re-read from the userscript storage:
 * `GM_getValue` is served from a per-document cache that the receiving tab has not
 * necessarily refreshed yet, so reading it here can hand back the previous value.
 *
 * @param onChange called with the theme another tab switched to
 * @returns an unsubscribe function
 */
const watchOtherTabs = (onChange: (theme: Theme | null) => void): (() => void) => {
    const onStorage = (event: StorageEvent) => {
        if (event.key === THEME_MIRROR_KEY) {
            onChange(parseTheme(event.newValue));
            return;
        }
        // `key` is null when the whole store is cleared
        if (event.key === null) {
            onChange(readThemeMirror());
        }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
};

/**
 * Subscribes to OS theme changes, across both `MediaQueryList` listener generations.
 *
 * Note that the theme itself does not depend on this — with no stored choice the
 * `data-theme` attribute is left off and the stylesheets follow the OS on their own.
 * This only keeps the switch's label in step, so failing to subscribe is harmless.
 *
 * @param onChange called whenever the OS theme flips
 * @returns an unsubscribe function, or undefined if subscribing was not possible
 */
const watchSystemTheme = (onChange: () => void): (() => void) | undefined => {
    let query: MediaQueryList;
    try {
        query = window.matchMedia('(prefers-color-scheme: dark)');
    } catch (e) {
        return undefined;
    }

    if (typeof query.addEventListener === 'function') {
        query.addEventListener('change', onChange);
        return () => query.removeEventListener('change', onChange);
    }

    // Safari < 14 and other older engines only implement the deprecated form
    if (typeof query.addListener === 'function') {
        query.addListener(onChange);
        return () => query.removeListener(onChange);
    }

    return undefined;
};

/**
 * Drives the options page theme.
 *
 * There are two stores and they are not available at the same time:
 * - the `localStorage` mirror, readable synchronously on the very first paint;
 * - the userscript storage, which only appears once the userscript exposes its api
 *   and which is what the blocked-popup notification reads.
 *
 * The userscript storage is authoritative once it shows up. Until then — and forever,
 * if the userscript is not installed — the mirror is used on its own.
 *
 * @param appState userscript detection state, so the reconciliation runs exactly once
 *  the api is known to be there
 * @returns the displayed theme and a toggle
 */
export const useTheme = (appState: AppState): [Theme, () => void] => {
    // The explicit choice, if any. `null` means "follow the OS", which is expressed by
    // leaving `data-theme` off rather than by pinning a resolved value.
    const [stored, setStored] = useState<Theme | null>(readThemeMirror);
    const [systemTheme, setSystemTheme] = useState(() => getSystemTheme(window));

    // A choice made on this page before the userscript api showed up. It could only reach
    // the mirror at the time, but it is newer than whatever the userscript storage holds,
    // so the reconciliation below has to hand it over rather than revert it.
    const pendingChoice = useRef<Theme | null>(null);

    const theme = stored ?? systemTheme;

    // Reconcile with the userscript storage as soon as it becomes available
    useEffect(() => {
        if (appState !== AppState.Installed) {
            return;
        }
        const themeOption = getThemeOption();
        if (!themeOption) {
            return;
        }

        const pending = pendingChoice.current;
        if (pending) {
            pendingChoice.current = null;
            // The mirror is preferred as it also reflects a later toggle made in another tab
            themeOption.setStored(readThemeMirror() ?? pending);
            return;
        }

        const userscriptTheme = themeOption.getStored();
        const mirrored = readThemeMirror();

        if (userscriptTheme) {
            // The userscript wins, e.g. it was changed from another browser profile
            if (userscriptTheme !== mirrored) {
                writeThemeMirror(userscriptTheme);
            }
            setStored(userscriptTheme);
        } else if (mirrored) {
            // The choice was made before the userscript was installed, hand it over
            // so that the notification popup honours it too
            themeOption.setStored(mirrored);
        }
    }, [appState]);

    useEffect(() => watchSystemTheme(() => setSystemTheme(getSystemTheme(window))), []);

    useEffect(() => watchOtherTabs(setStored), []);

    useEffect(() => {
        applyStoredTheme(document, stored);
    }, [stored]);

    const toggle = useCallback(() => {
        const next = oppositeTheme(theme);
        writeThemeMirror(next);
        // Persisting to the userscript storage is what makes the blocked-popup
        // notification pick the theme up
        const themeOption = getThemeOption();
        if (themeOption) {
            themeOption.setStored(next);
        } else {
            // The api is not there yet, or not at all; hand the choice over once it shows up
            pendingChoice.current = next;
        }
        setStored(next);
    }, [theme]);

    return [theme, toggle];
};
