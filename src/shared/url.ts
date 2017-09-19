const reCommonProtocol = /^http/;

/**
 * Parses a url and returns 3 strings.
 * The first string is a `displayUrl`, which will be used to show as
 * a shortened url. The second string is a `canonicalUrl`, which is used to match against whitelist data in storage.
 * The third string is a full absolute url.
 */
const createUrl = (href:any):[string, string, string] => {
    href = convertToString(href);
    const location = createLocation(href);
    let displayUrl:string, canonicalUrl:string;
    let protocol = location.protocol;
    if (reCommonProtocol.test(protocol)) {
        displayUrl = location.href.slice(protocol.length + 2);
        canonicalUrl = location.hostname;
    } else {
        displayUrl = href;
        let i = href.indexOf(',');
        canonicalUrl = i === -1 ? href : href.slice(0, i);
    }
    return [displayUrl, canonicalUrl, location.href];
};

/**
 * There are certain browser quirks regarding how they treat non-string values
 * provided as arguments of `window.open`, and we can't rely on third-party scripts
 * playing nicely with it.
 * undefined --> 'about:blank'
 * null --> 'about:blank', except for Firefox, in which it is converted to 'null'.
 * false --> 'about:blank', except for Edge, in which it is converted to 'false'.
 * These behaviors are different from how anchor tag's href attributes behaves with non-string values.
 */
const convertToString = (href:any):string => {
    if (typeof href !== 'string') {
        if (href instanceof Object) {
            href = String(href);
        } else {
            href = '';
        }
    }
    return href;
};

/**
 * Creates an object that implements properties of Location api.
 */
export const createLocation = (href:string):HTMLAnchorElement => {
    let anchor = document.createElement('a');
    anchor.href = href;
    // https://gist.github.com/disnet/289f113e368f1bfb06f3
    if (anchor.host == "") {
        anchor.href = anchor.href;
    }
    return anchor;
};

export default createUrl;
