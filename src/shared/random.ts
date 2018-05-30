const crypto = window.crypto || window.msCrypto;

export const getRandomStr = crypto ? () => {
    var buffer = new Uint8Array(24);
    crypto.getRandomValues(buffer);
    return btoa(String.fromCharCode.apply(null, buffer));
} : (() => {
    let counter = Date.now() % 1e9;
    return () => {
        return '' + (Math.random() * 1e9 >>> 0) + counter++
    };
})();
