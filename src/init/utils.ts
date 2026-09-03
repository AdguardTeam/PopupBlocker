import { optionsApi } from '../storage/Option';
import { themeOption } from '../storage/ThemeOption';
import {
    OPTIONS_API_PROP,
    OPTIONS_PAGE_URL,
    OPTIONS_PAGE_URL_ALIAS,
    OPTIONS_PAGE_URL_ROOT,
    THEME_OPTION_PROP,
} from '../shared';

/**
 * Appends and removes script tag with a given content
 * @param text script tag content
 */
export const appendScript = (text: string): void => {
    const script = document.createElement('script');

    script.textContent = text;
    const el = document.body || document.head || document.documentElement;
    el.appendChild(script);
    el.removeChild(script);
};

/**
 * Checks if current page is own options page
 *
 * @param context global context
 * @returns true if the page is the options page
 */
export function isOptionsPage(context: Window & typeof globalThis): boolean {
    const LOCAL_OPTIONS_URL_REGEX = /(localhost:|http:\/\/127\.0\.0\.1).*(\/options\.html)/;

    const OPTIONS_PAGE_URLS = [
        OPTIONS_PAGE_URL,
        OPTIONS_PAGE_URL_ALIAS,
        OPTIONS_PAGE_URL_ROOT,
    ];

    const { href } = context.location;
    return OPTIONS_PAGE_URLS.some((url) => url === href)
        // allow page debugging
        || LOCAL_OPTIONS_URL_REGEX.test(href);
}

/**
 * Exposes options api on options page.
 *
 * The theme option is composed in here rather than inside `optionsApi` itself to keep
 * `Option.ts` and `ThemeOption.ts` free of a cyclic dependency through `storage-key.ts`.
 *
 * @param context global context
 */
export function exposeStorage(context: Window & typeof globalThis) {
    context[OPTIONS_API_PROP] = {
        ...optionsApi,
        [THEME_OPTION_PROP]: themeOption,
    };
}
