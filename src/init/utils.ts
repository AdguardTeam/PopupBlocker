import { optionsApi } from '../storage/Option';
import {
    OPTIONS_API_PROP,
    OPTIONS_PAGE_URL,
    OPTIONS_PAGE_URL_ALIAS,
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
 */
export function isOptionsPage(context: Window & typeof globalThis): boolean {
    const LOCAL_OPTIONS_URL_REGEX = /(localhost:|http:\/\/127\.0\.0\.1).*(\/options\.html)/;

    const OPTIONS_PAGE_URLS = [
        OPTIONS_PAGE_URL,
        OPTIONS_PAGE_URL_ALIAS,
    ];

    const { href } = context.location;
    return OPTIONS_PAGE_URLS.some((url) => url === href)
        // allow page debugging
        || LOCAL_OPTIONS_URL_REGEX.test(href);
}

/**
 * Exposes options api on options page.
 *
 * @param context global context
 */
export function exposeStorage(context: Window & typeof globalThis) {
    context[OPTIONS_API_PROP] = optionsApi;
}
