import IUserscriptSettings from "./IUserscriptSettings";
import IStorageManager from "../../../storage/IStorageManager";

export default class UserscriptStorageManager implements IStorageManager {
    constructor(
        private userscriptSettings:IUserscriptSettings
    ) { }
    requestDestinationWhitelist(dest:string):void {
        let whitelistedDestinations = this.userscriptSettings.whitelistedDestinations;
        whitelistedDestinations.push(dest);
        GM_setValue('whitelist', whitelistedDestinations.join(','));
    }
    requestDomainWhitelist(domain:string):void {
        let domainOption = this.userscriptSettings.domainOption;
        domainOption.whitelisted = true;
        GM_setValue(domain, JSON.stringify(domainOption));
    }
}
