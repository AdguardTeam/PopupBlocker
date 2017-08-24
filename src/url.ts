interface url {
    display:string, // to be used to show in alerts
    canonical:string // to be used to test against blacklist/whitelist rules
}

const reCommonProtocol = /^http/;

const createUrl = (href:string):url => {
    const location = document.createElement('a');
    location.href = href;
    // https://gist.github.com/disnet/289f113e368f1bfb06f3
    if (location.host == "") {
        location.href = location.href;
    }

    let display:string, canonical:string;

    let protocol = location.protocol;
    if (reCommonProtocol.test(protocol)) {
        display = href.slice(protocol.length + 2);
        canonical = location.hostname;
    } else {
        display = href;
        canonical = href.slice(0, href.indexOf(','));
    }
    return {
        display,
        canonical
    };
};

export default createUrl;
