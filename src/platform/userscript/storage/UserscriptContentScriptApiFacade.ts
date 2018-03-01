import IContentScriptApiFacade from "../../../storage/IContentScriptApiFacade";
import * as log from '../../../shared/log';
import { isUndef } from '../../../shared/instanceof';
import IAlertController from "../../../ui/alert/IAlertController";

/**
 * Note: it should always request new data with GM_getValue, 
 * in order to retrieve the most up-to-date data.
 */
export default class UserscriptContentScriptApiFacade implements IContentScriptApiFacade {
    public domain = location.hostname;
    constructor(
        private alertController:IAlertController,
        public $getMessage:(id:string)=>string
    ) { }
    originIsWhitelisted():boolean {
        let val = GM_getValue(this.domain);
        let type = typeof val;
        switch (typeof val) {
            case 'string':
                // Settings used in 2.1.* version.
                let optionVer2_1 = <DomainOption>JSON.parse(val);
                return optionVer2_1.whitelisted;
            case 'number':
                // Settings used in >=2.2 version.
                return val === DomainOptionEnum.WHITELISTED;
            default:
                return false;
        }
    }
    originIsSilenced():boolean {
        let val = GM_getValue(this.domain);
        let type = typeof val;
        if (type === 'number') {
            return val === DomainOptionEnum.SILENCED;
        }
        // 2.1.* version does not have 'silence' setting.
        return false;
    }
    destinationIsWhitelisted(dest:string):boolean {
        let whitelistedDestinations = GM_getValue('whitelist');
        if (typeof whitelistedDestinations !== 'string') { return false; }
        if (whitelistedDestinations.split(',').indexOf(dest) !== -1) {
            return true;
        }
        return false;
    }
    showAlert(orig_domain:string, popup_url:string):void {
        setTimeout(() => {
            this.alertController.createAlert(orig_domain, popup_url);
        });
    }

    public envIsFirefoxGreasemonkey = typeof InstallTrigger !== 'undefined' && document.currentScript;

    /**
     * Methods are defined in privileged context, we need to expose it to the
     * page's context in order to use it in injected script.
     */
    expose():string {
        const BRIDGE_KEY = '__PB' + (Math.random() * 1e9 >>> 0) + '__';
        if (this.envIsFirefoxGreasemonkey) {
            this.originIsWhitelisted = this.originIsWhitelisted.bind(this);
            this.originIsSilenced = this.originIsSilenced.bind(this);
            this.destinationIsWhitelisted = this.destinationIsWhitelisted.bind(this);
            this.showAlert = this.showAlert.bind(this);
            unsafeWindow[BRIDGE_KEY] = cloneInto(this, unsafeWindow, { cloneFunctions: true });
        } else {
            unsafeWindow[BRIDGE_KEY] = this;
        }
        return BRIDGE_KEY;
    }
}
