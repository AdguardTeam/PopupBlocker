import { I18nInterface } from '@adguard/translate';
import translations from '../locales/translations.json';

// TODO get this from twosky.config after Locales type get exported from @adguard/translate
const BASE_LOCALE = 'en';

const getLocale = (locale) => {
    if (locale in translations) {
        return locale;
    }

    const dashed = locale.replace('_', '-');
    if (dashed in translations) {
        return dashed;
    }

    const lowercased = locale.toLowerCase();
    if (lowercased in translations) {
        return lowercased;
    }

    const lowercaseddashed = dashed.toLowerCase();
    if (lowercaseddashed in translations) {
        return lowercaseddashed;
    }

    const splitted = lowercaseddashed.split('-')[0];
    if (splitted in translations) {
        return splitted;
    }

    return null;
};

const getBaseUILanguage = (): typeof BASE_LOCALE => BASE_LOCALE;

// TODO replace any after export Locales from @adguard/translate
/**
 * Returns currently selected locale or base locale
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUILanguage = (): any => {
    let language: string;
    if (window.navigator.languages) {
        // eslint-disable-next-line prefer-destructuring
        language = window.navigator.languages[0];
    } else {
        language = window.navigator.language;
    }

    const locale = getLocale(language);

    if (!locale) {
        return getBaseUILanguage();
    }

    return locale;
};

const getBaseMessage = (key: string) => {
    const baseLocale = getBaseUILanguage();
    const localeMessages = translations[baseLocale];
    let message: string;
    if (localeMessages && key in localeMessages) {
        message = localeMessages[key].message;
    } else {
        // eslint-disable-next-line max-len, no-console
        console.error(`[AdGuard PopUp Blocker] Couldn't find message by key "${key}" in base locale. Please report support`);
        message = key;
    }
    return message;
};

/**
 * Returns message by key
 */
const getMessage = (key: string): string => {
    const locale = getUILanguage();
    const localeMessages = translations[locale];
    let message;
    if (localeMessages && key in localeMessages) {
        message = localeMessages[key].message;
    } else {
        message = getBaseMessage(key);
    }
    return message;
};

export const i18n: I18nInterface = {
    getMessage,
    getUILanguage,
    getBaseMessage: (key: string): string => key,
    getBaseUILanguage,
};
