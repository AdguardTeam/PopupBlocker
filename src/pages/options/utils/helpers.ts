import { translator } from '../../../i18n/translator';

const VALID_DOMAIN_REGEX = /^((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}(?::[\d]{0,5})?$/;

// Checks if given input is a valid domain
export const isValidDomain = (domain: string): boolean => VALID_DOMAIN_REGEX.test(domain);

export const getOwnScriptManagerName = (manager: string) => {
    const isAdGuard = manager === 'AdGuard';
    if (!isAdGuard) {
        return manager;
    }
    const MAC_OS = 'Mac';
    const WIN_OS = 'Windows';
    const os = window.navigator.userAgent.includes(MAC_OS) ? MAC_OS : WIN_OS;
    const recommendedMessage = translator.getMessage('noinst_rec');
    return `AdGuard for ${os} ${recommendedMessage}`;
};
