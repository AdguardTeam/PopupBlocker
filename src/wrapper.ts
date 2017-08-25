import bridge from './ui/create_bridge';
import BRIDGE_KEY from './ui/bridge';
import popupBlocker from './wrapper-nocompile';

if (!bridge.domainOption.whitelisted) {
    /**
     * In Firefox, userscripts can't write properties of unsafeWindow, so we create a <script> tag
     * to run the script in the page's context.
     */
    if (typeof InstallTrigger !== 'undefined' && document.currentScript === null) {
        // Firefox userscript
        var script = document.createElement('script');
        var text = `(${popupBlocker.toString()})(this,!1,'${BRIDGE_KEY}')`;
        script.textContent = text;
        var el = document.body || document.head || document.documentElement;
        el.appendChild(script);
        el.removeChild(script);
    } else {
        var win = typeof unsafeWindow !== 'undefined' ? unsafeWindow.window : window;
        popupBlocker(win,false,BRIDGE_KEY);
    }
}
