/**
 * @fileoverview A custom getMessage implementation for userscripts.
 */

declare var RESOURCE_USERSCRIPT_TRANSLATIONS: stringmap<stringmap<string>>;

const translations = RESOURCE_USERSCRIPT_TRANSLATIONS;

/**
 * AdGuard for Windows noramlizes locales like this.
 */
function normalizeLocale(locale: string): string {
    return locale.replace('_', '-');
}

const supportedLocales = Object.keys(translations).map(locale => normalizeLocale(locale));

const defaultLocale = 'en';
let currentLocale = null;

function setLocaleIfSupported(locale: string): boolean {
    if (supportedLocales.indexOf(locale) !== -1) {
        currentLocale = locale;
        return true;
    }
    return false;
}

function setLocale() {
    if (typeof AdguardSettings !== 'undefined') {
        let locale = normalizeLocale(AdguardSettings.locale);
        if (setLocaleIfSupported(locale)) { return; }
    }
    let lang = normalizeLocale(navigator.language);
    if (setLocaleIfSupported(lang)) { return; }
    let i = lang.indexOf('-');
    if (i !== -1) {
        lang = lang.slice(0, i);
    }
    if (setLocaleIfSupported(lang)) { return; }
    currentLocale = defaultLocale;
}

setLocale();

export default (messageId: string): string => {
    let message = translations[currentLocale][messageId];
    if (!message) {
        message = translations[defaultLocale][messageId];
        // @ifdef DEBUG
        if (!message) {
            throw messageId + ' not localized';
        }
        // @endif
    }
    return message;
};
