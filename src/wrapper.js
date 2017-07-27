function popupBlocker() {
    /*CONTENT*/
}

/**
 * In Firefox, userscripts can't write properties of unsafeWindow, so we create a <script> tag
 * to run the script in the page's context.
 */
if (typeof unsafeWindow !== 'undefined' && typeof InstallTrigger !== 'undefined') {
    // Firefox
    var script = document.createElement('script');
    script.textContent = popupBlocker.toString() + '(window);'
    var el = document.body || document.head || document.documentElement;
    el.appendChild(script);
    el.removeChild(script);
} else {
    // @ifdef DEBUG
    window['__t'] = 
    // @endif
    popupBlocker();
}
