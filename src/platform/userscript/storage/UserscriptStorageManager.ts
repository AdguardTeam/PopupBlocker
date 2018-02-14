import IUserscriptSettings from "./IUserscriptSettings";
import IStorageManager, { AllOptions, OptionsCallback } from "../../../storage/IStorageManager";
import { isUndef } from "../../../shared/instanceof";

export default class UserscriptStorageManager implements IStorageManager {
    setSourceOption(domain:string, option:DomainOptionEnum, cb?:OptionsCallback):void {
        GM_setValue(domain, option);
        if (!isUndef(cb)) {
            this.enumerateOptions(cb);
        }
    }
    setIsWhitelistedDestination(domain:string, option:boolean, cb?:OptionsCallback):void {
        let whitelistedDestinationsStringified = GM_getValue('whitelist', '');
        let whitelistedDestinations = whitelistedDestinationsStringified.split(',');
        let index = whitelistedDestinations.indexOf(domain);
        let isWhitelisted = index !== -1

        if (option && !isWhitelisted) {
            whitelistedDestinations.push(domain);
        } else if (!option && isWhitelisted) {
            whitelistedDestinations.splice(index, 1);
        } else {
            cb(null);
            return;
        }
        GM_setValue('whitelist', whitelistedDestinations.join(','));
    
        if (!isUndef(cb)) {
            this.enumerateOptions(cb);
        }
    }
    enumerateOptions(cb:OptionsCallback):void {
        let keys = GM_listValues();
        let whitelisted = [];
        let silenced = [];
        let whitelistedDest;
        for (let i = 0, l = keys.length; i < l; i++) {
            let key = keys[i];
            if (key === 'whitelist') {
                whitelistedDest = GM_getValue('whitelist').split(',');
            } else {
                // key is a domain.
                if (GM_getValue(key) === DomainOptionEnum.WHITELISTED) {
                    whitelisted.push(key);
                } else {
                    silenced.push(key);
                }
            }
        }
        whitelisted = whitelisted || [];
        cb([whitelisted, silenced, whitelistedDest]);
    }
}
