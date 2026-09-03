import { gmWrapper } from './GMWrapper';
import { StorageKey } from './storage-key';
import { parseTheme, Theme } from '../theme';

export interface ThemeOptionInterface {
    getStored(): Theme | null
    setStored(theme: Theme): void
}

/**
 * Represents the userscript's theme option.
 *
 * Unlike {@link Option} this holds a single scalar rather than a list, and an empty value
 * is meaningful: it means "follow the operating system".
 */
class ThemeOption implements ThemeOptionInterface {
    /**
     * Reads the explicitly chosen theme, if there is one.
     *
     * @returns The stored theme, or null when the user follows the operating system.
     */
    getStored = (): Theme | null => parseTheme(gmWrapper.getValue<string>(StorageKey.Theme, ''));

    /**
     * Stores an explicit theme choice.
     *
     * @param theme Theme to persist.
     */
    setStored = (theme: Theme): void => {
        gmWrapper.setValue(StorageKey.Theme, theme);
    };
}

export const themeOption = new ThemeOption();
