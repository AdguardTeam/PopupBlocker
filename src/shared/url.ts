interface url {
    displayUrl:string, // to be used to show in alerts
    canonicalUrl:string // to be used to test against blacklist/whitelist rules
}

const reCommonProtocol = /^http/;
const createUrl = (href:string):url => {
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
    return {
        displayUrl,
        canonicalUrl
    };
};

export default createUrl;
