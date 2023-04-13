// userscript options api methods,
// also used to detect userscript on options page
export const OPTIONS_API_PROP = 'optionsApi';

export const OPTIONS_PAGE_CONTEXT_NAME = '__popupBlocker_options_page__';

// __userscriptResourceEnv__ and __userscriptResourceVersion__ will be replaced
// with corresponding values at build time
// eslint-disable-next-line max-len
export const OPTIONS_PAGE_URL = 'https://popupblocker.adguard.com/__userscriptResourceEnv__/__userscriptResourceVersion__/options.html';

// eslint-disable-next-line max-len
export const OPTIONS_PAGE_URL_ALIAS = 'https://adguardteam.github.io/PopupBlocker/__userscriptResourceEnv__/__userscriptResourceVersion__/options.html';
