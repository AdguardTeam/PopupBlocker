import IStorageProvider from "../../../storage/IStorageProvider";
import IUserscriptSettings from "./IUserscriptSettings";
import AlertController from "../../../ui/alert_controller";
import * as log from '../../../shared/log';

export default class UserscriptStorageProvider implements IStorageProvider {
    public domain = location.hostname;
    constructor(
        private userscriptSettings:IUserscriptSettings,
        private alertController:AlertController,
        public $getMessage:(id:string)=>string
    ) { }
    originIsWhitelisted():boolean {
        return this.userscriptSettings.domainOption.whitelisted;
    }
    destinationIsWhitelisted(dest:string):boolean {
        return this.userscriptSettings.whitelistedDestinations.indexOf(dest) !== -1;
    }
    showAlert(orig_domain:string, popup_url:string):void {
        log.print(`UserscriptStorageProvider: showAlert`);
        setTimeout(() => {
            this.alertController.createAlert(orig_domain, popup_url);
        });
    }
    expose():string {
        const BRIDGE_KEY = '__PB' + (Math.random() * 1e9 >>> 0) + '__';
        if (this.userscriptSettings.isFirefox) {
            this.originIsWhitelisted = this.originIsWhitelisted.bind(this);
            this.destinationIsWhitelisted = this.destinationIsWhitelisted.bind(this);
            this.showAlert = this.showAlert.bind(this);
            unsafeWindow[BRIDGE_KEY] = cloneInto(this, unsafeWindow, { cloneFunctions: true });
        } else {
            unsafeWindow[BRIDGE_KEY] = this;
        }
        return BRIDGE_KEY;
    }    
}
