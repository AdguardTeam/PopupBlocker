import { useEffect, StateUpdater } from 'preact/hooks';
import { AppState } from '../constants';
import { OPTIONS_API_PROP } from '../../../shared/constants';

const USERSCRIPT_DETECT_TIMEOUT_MS = 1000;
const USERSCRIPT_DETECT_INTERVAL_MS = 250;
const isUserscriptLoaded = () => typeof window[OPTIONS_API_PROP] !== 'undefined';

/**
 * Checks if popupblocker userscript is present on a page
 * by looking for options api on window
 * These are put into global scope on options page only
 */
export const useDetectUserscript = (detectSetter: StateUpdater<AppState>) => {
    useEffect(() => {
        let intervalId: number;
        let timeoutId: number;

        const stopWith = (detected: AppState) => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);

            detectSetter(detected);
        };

        // Wait until userscript is detected
        intervalId = window.setInterval(() => {
            if (isUserscriptLoaded()) {
                stopWith(AppState.Installed);
            }
        }, USERSCRIPT_DETECT_INTERVAL_MS);

        // or until time is out
        timeoutId = window.setTimeout(() => stopWith(AppState.NotInstalled), USERSCRIPT_DETECT_TIMEOUT_MS);

        return () => stopWith(AppState.NotInstalled);
    }, [detectSetter]);
};
