const crypto = window.crypto || window.msCrypto;

export const getRandomStr = crypto ? () => {
    const buffer = new Uint8Array(24);
    crypto.getRandomValues(buffer);
    return window.btoa(String.fromCharCode.apply(null, buffer));
} : (() => {
    let counter = Date.now() % 1e9;
    // eslint-disable-next-line no-plusplus
    return () => `${Math.floor(Math.random() * 1000000000)}${counter++}`;
})();
