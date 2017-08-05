/** @param {string=} KEY */
function popupBlocker(window, KEY) {
    /*CONTENT*/
}

/**
 * In Firefox, userscripts can't write properties of unsafeWindow, so we create a <script> tag
 * to run the script in the page's context.
 */
if (typeof InstallTrigger !== 'undefined' && document.currentScript === null) {
    // Firefox userscript
    var script = document.createElement('script');
    var text =
        // @ifdef DEBUG
        'window.__t = ' +
        // @endif
        '(' + popupBlocker.toString() + ')(window);';
    script.textContent = text;
    var el = document.body || document.head || document.documentElement;
    el.appendChild(script);
    el.removeChild(script);
} else {
    var win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    // @ifdef DEBUG
    win['__t'] =
    // @endif
    popupBlocker(win);
}
