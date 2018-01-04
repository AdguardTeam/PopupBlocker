import IStorageManager from "../../../storage/IStorageManager";
import IStorageProvider from "../../../storage/IStorageProvider";
import AlertController from "../../../ui/alert_controller";
import { clone, createObject, exportFn } from './firefox_export_helper_polyfills';
import IUserscriptSettings from "./IUserscriptSettings";

export default class UserscriptStorage implements IStorageProvider {
    private getValue(key:string, defaultValue:string) {
        let val = GM_getValue(key);
        if (typeof val === 'undefined') {
            GM_setValue(key, defaultValue);
            return defaultValue;
        } else { return val; }
    }
    private static INITIAL_DOMAIN_OPTION = JSON.stringify({
        whitelisted: false,
        use_strict: false
    });
    public domain = location.hostname;
    constructor(
        private userscriptSettings:IUserscriptSettings,
        private alertController:AlertController,
        public getMessage:(messageId:string)=>string
    ) {  }
    expose():string {
        const BRIDGE_KEY = '__PB' + (Math.random() * 1e9 >>> 0) + '__';
        if (this.userscriptSettings.isFirefox) {
            this.originIsWhitelisted = this.originIsWhitelisted.bind(this);
            this.destinationIsWhitelisted = this.destinationIsWhitelisted.bind(this);
            this.showAlert = this.showAlert;
            this.getMessage = this.getMessage;
            unsafeWindow[BRIDGE_KEY] = cloneInto(this, unsafeWindow, { cloneFunctions: true });
        } else {
            unsafeWindow[BRIDGE_KEY] = this;
        }
        return BRIDGE_KEY;
    }
    originIsWhitelisted():boolean {
        return this.userscriptSettings.domainOption.whitelisted;
    }
    destinationIsWhitelisted(dest:string):boolean {
        return this.userscriptSettings.whitelistedDestinations.indexOf(dest) !== -1;
    }
    showAlert(orig_domain:string, popup_url:string):void {
        this.alertController.createAlert(orig_domain, popup_url);
    }
}
