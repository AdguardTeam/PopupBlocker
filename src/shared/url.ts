const reCommonProtocol = /^http/;

/**
 * Parses a url and returns 3 strings.
 * The first string is a `displayUrl`, which will be used to show as
 * a shortened url. The second string is a `canonicalUrl`, which is used to match against whitelist data in storage.
 * The third string is a full absolute url.
 */
const createUrl = (href:string):[string, string, string] => {
    const location = document.createElement('a');
    location.href = href;
    // https://gist.github.com/disnet/289f113e368f1bfb06f3
    if (location.host == "") {
        location.href = location.href;
    }

    let displayUrl:string, canonicalUrl:string;
    let protocol = location.protocol;
    if (reCommonProtocol.test(protocol)) {
        displayUrl = href.slice(protocol.length + 2);
        canonicalUrl = location.hostname;
    } else {
        displayUrl = href;
        let i = href.indexOf(',');
        canonicalUrl = i === -1 ? href : href.slice(0, i);
    }
    return [displayUrl, canonicalUrl, location.href];
};

export default createUrl;
