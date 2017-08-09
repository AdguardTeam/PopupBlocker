/**
 * @param {string=} KEY 
 * @param {*=} option
 */
function popupBlocker(window, KEY, option) {
    "CONTENT";
}

// ToDo: do something with GM_getValue here to create option object
// ToDo: register shortcuts and notification here

/**
 * In Firefox, userscripts can't write properties of unsafeWindow, so we create a <script> tag
 * to run the script in the page's context.
 */
if (typeof InstallTrigger !== 'undefined' && document.currentScript === null) {
    // Firefox userscript
    var script = document.createElement('script');
    var text ='(' + popupBlocker.toString() + ')(this);';
    script.textContent = text;
    var el = document.body || document.head || document.documentElement;
    el.appendChild(script);
    el.removeChild(script);
} else {
    var win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    popupBlocker(win);
}
