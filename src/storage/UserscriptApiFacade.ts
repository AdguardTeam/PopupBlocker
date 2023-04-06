import { AlertControllerInterface } from '../ui/alert/AlertControllerInterface';
import { ISettingsDao } from './SettingsDao';
import { OptionName } from './Option';

/**
 * Implementation details:
 *   Extensions:  uses `window.postMessage`.
 *   Userscripts: Constructed in content script and passed directly to page script via temporary
 *                global variable. For FF Greasemonkey, its public methods are exported with
 *                FF export helpers (exportFunction, cloneInto).
 */
export interface UserscriptApiFacadeInterface {
    originIsAllowed(origin?:string):boolean
    originIsSilenced():boolean

    showAlert(orig_domain:string, popup_url:string):void

    getInstanceID?():string

    domain:string
}

/**
 * Userscript API that handles allowlist and silenced websites,
 * renders and handles alerts and notifications
 */
export class UserscriptApiFacade implements UserscriptApiFacadeInterface {
    public domain = window.location.hostname;

    constructor(
        private settingsDao:ISettingsDao,

        private alertController:AlertControllerInterface,
    ) { }

    originIsAllowed(domain:string = this.domain):boolean {
        return this.settingsDao.isMemberOf(OptionName.Allowed, domain);
    }

    originIsSilenced():boolean {
        return this.settingsDao.isMemberOf(OptionName.Silenced, this.domain);
    }

    showAlert(orig_domain:string, popup_url:string):void {
        setTimeout(() => {
            this.alertController.createAlert(orig_domain, popup_url);
        });
    }

    getInstanceID():string {
        return this.settingsDao.getInstanceID();
    }

    public envIsFirefoxBrowserExt = typeof InstallTrigger !== 'undefined' && document.currentScript;

    /**
     * Methods are defined in privileged context, we need to expose it to the
     * page's context in order to use it in injected script.
     */
    expose():string {
        const BRIDGE_KEY = `__PB${Math.floor(Math.random() * 1000000000)}__`;
        if (this.envIsFirefoxBrowserExt) {
            this.originIsAllowed = this.originIsAllowed.bind(this);
            this.originIsSilenced = this.originIsSilenced.bind(this);
            this.showAlert = this.showAlert.bind(this);
            unsafeWindow[BRIDGE_KEY] = cloneInto(this, unsafeWindow, { cloneFunctions: true });
        } else {
            unsafeWindow[BRIDGE_KEY] = this;
        }
        return BRIDGE_KEY;
    }
}
