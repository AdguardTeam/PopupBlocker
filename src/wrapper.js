function popupBlocker(KEY) {
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
        '(' + popupBlocker.toString() + ')();';
    script.textContent = text;
    var el = document.body || document.head || document.documentElement;
    el.appendChild(script);
    el.removeChild(script);
} else {
    // @ifdef DEBUG
    window['__t'] = 
    // @endif
    popupBlocker();
}
