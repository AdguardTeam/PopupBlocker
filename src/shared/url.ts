const reCommonProtocol = /^http/;

/**
 * There are certain browser quirks regarding how they treat non-string values
 * provided as arguments of `window.open`, and we can't rely on third-party scripts
 * playing nicely with it.
 * undefined --> 'about:blank'
 * null --> 'about:blank', except for Firefox, in which it is converted to 'null'.
 * false --> 'about:blank', except for Edge, in which it is converted to 'false'.
 * These behaviors are different from how anchor tag's href attributes behaves with non-string values.
 */
export const convertToString = (href:any):string => {
    if (typeof href !== 'string') {
        if (href instanceof Object) {
            // eslint-disable-next-line no-param-reassign
            href = String(href);
        } else {
            // eslint-disable-next-line no-param-reassign
            href = '';
        }
    }
    return href;
};

/**
 * Creates an object that implements properties of Location api.
 * It resolves the provided href within a context of a current browsing context.
 */
export const createLocation = (href:string):URL => {
    const anchor = document.createElement('a');
    anchor.href = href;
    // https://gist.github.com/disnet/289f113e368f1bfb06f3
    if (anchor.host === '') {
        // eslint-disable-next-line no-self-assign
        anchor.href = anchor.href;
    }
    return <any>anchor;
};

/**
 * Parses a url and returns 3 strings.
 * The first string is a `displayUrl`, which will be used to show as
 * a shortened url. The second string is a `canonicalUrl`, which is used to match against allowlist data in gmWrapper.
 * The third string is a full absolute url.
 */
export const createUrl = (href:any):[string, string, string] => {
    // eslint-disable-next-line no-param-reassign
    href = convertToString(href);
    const location = createLocation(href);
    let displayUrl: string;
    let canonicalUrl: string;
    const { protocol } = location;
    if (reCommonProtocol.test(protocol)) {
        displayUrl = location.href.slice(protocol.length + 2);
        canonicalUrl = location.hostname;
    } else {
        displayUrl = href;
        const i = href.indexOf(',');
        canonicalUrl = i === -1 ? href : href.slice(0, i);
    }
    return [displayUrl, canonicalUrl, location.href];
};

/**
 * Determines whether 2 contexts A and B are in the same origin.
 * @param url_A absolute or relative url of the context A
 * @param location_B location object of the context B
 * @param domain_B `document.domain` of the context B
 */
export function isSameOrigin(url_A:string, location_B:Location, domain_B:string):boolean {
    const location_A = createLocation(url_A);
    // eslint-disable-next-line no-script-url
    if (location_A.protocol === 'javascript:' || location_A.href === 'about:blank') {
        return true;
    }
    if (location_A.protocol === 'data:') {
        return false;
    }
    return location_A.hostname === domain_B
        && location_A.port === location_B.port
        && location_A.protocol === location_B.protocol;
}
