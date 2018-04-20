import IContentScriptApiFacade from "../../../storage/IContentScriptApiFacade";
import * as log from '../../../shared/log';
import { isUndef } from '../../../shared/instanceof';
import IAlertController from "../../../ui/controllers/alert/IAlertController";
import IUserscriptSettingsDao from "./IUserscriptSettingsDao";
import { DomainOptionEnum } from "../../../storage/storage_data_structure";

/**
 * Note: it should always request new data with GM_getValue, 
 * in order to retrieve the most up-to-date data.
 */
export default class UserscriptContentScriptApiFacade implements IContentScriptApiFacade {
    public domain = location.hostname;
    constructor(
        private settingsDao:IUserscriptSettingsDao,
        private alertController:IAlertController,
        public $getMessage:(id:string)=>string
    ) { }

    originIsWhitelisted(domain:string = this.domain):boolean {
        return this.settingsDao.getIsWhitelisted(domain);
    }
    originIsSilenced():boolean {
        return (this.settingsDao.getSourceOption(this.domain) & DomainOptionEnum.SILENCED) !== 0;
    }
    showAlert(orig_domain:string, popup_url:string):void {
        setTimeout(() => {
            this.alertController.createAlert(orig_domain, popup_url);
        });
    }

    public envIsFirefoxBrowserExt = typeof InstallTrigger !== 'undefined' && document.currentScript;
    /**
     * Methods are defined in privileged context, we need to expose it to the
     * page's context in order to use it in injected script.
     */
    expose():string {
        const BRIDGE_KEY = '__PB' + (Math.random() * 1e9 >>> 0) + '__';
        if (this.envIsFirefoxBrowserExt) {
            this.originIsWhitelisted = this.originIsWhitelisted.bind(this);
            this.originIsSilenced = this.originIsSilenced.bind(this);
            this.showAlert = this.showAlert.bind(this);
            unsafeWindow[BRIDGE_KEY] = cloneInto(this, unsafeWindow, { cloneFunctions: true });
        } else {
            unsafeWindow[BRIDGE_KEY] = this;
        }
        return BRIDGE_KEY;
    }
}
