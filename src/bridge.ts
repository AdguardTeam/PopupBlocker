let bridge:Bridge;

if (typeof _BRIDGE_KEY !== 'undefined') {
    bridge = window[_BRIDGE_KEY];
    delete window[_BRIDGE_KEY];
} else {
    // KEY should be defined
    bridge = window.parent[KEY][3];
}

export default bridge;
