/**
 * @fileoverview
 * 'whitelist': comma-separated list of domain names that are allowed as popup destinations.
 * [domain]:DomainOption, JSON.stringify'd
 * 'salt': key that is used to hash messages sent to the top frame.
 */

function getValue(key:string, defaultValue:string) {
    let val = GM_getValue(key);
    if (typeof val === 'undefined') {
        GM_setValue(key, defaultValue);
        return defaultValue;
    } else { return val; }
}

const INITIAL_DOMAIN_OPTION = JSON.stringify({
    whitelisted: false,
    use_strict: false
});

export const domainOption = <DomainOption>JSON.parse(GM_getValue(location.host, INITIAL_DOMAIN_OPTION));
export const whitelistedDestinations = getValue('whitelist', '').split(',').filter(host => host.length);

export function requestDestinationWhitelist(dest) {
    whitelistedDestinations.push(dest);
    GM_setValue('whitelist', whitelistedDestinations.join(','));

}

export function requestDomainWhitelist(domain) {
    domainOption['whitelisted'] = true;
    GM_setValue(domain, JSON.stringify(domainOption));
}
