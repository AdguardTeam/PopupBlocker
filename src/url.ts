// ToDo: make this work on empty iframes
const createUrl = typeof URL === 'function' ? (href:string) => {
    return new URL(href, location.href);
} : (href:string) => {
    const location = document.createElement('a');
    location.href = href;
    // https://gist.github.com/disnet/289f113e368f1bfb06f3
    if (location.host == "") {
        location.href = location.href;
    }
    return location;
};

export default createUrl;
