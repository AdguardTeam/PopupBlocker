import { h } from 'preact';
import { translate } from '@adguard/translate';
import { i18n } from './i18n';

/**
 * Retrieves localized messages by key, formats and converts into react components or string
 */
export const preactTranslator = translate.createPreactTranslator(i18n, {
    createElement: h,
});
