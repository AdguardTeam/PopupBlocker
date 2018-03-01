import chrome from '../platform_namespace';
import ISettingsDao, { AllOptions, OptionsCallback } from '../../../../storage/ISettingsDao';
import { isUndef } from '../../../../shared/instanceof';
import OptionsController from '../../../../ui/options/OptionsController';

export default class ExtensionSettingsDao implements ISettingsDao {

    private storage = chrome.storage.local;
    private getCallback(cb?:OptionsCallback) {
        return isUndef(cb) ? undefined : () => {
            this.enumerateOptions(cb);
        };
    }
    private static itemsToOptions(items:stringmap<any>):AllOptions {
        let whitelisted = [];
        let silenced = [];
        let whitelistedDest = [];

        for (let key in items) {
            if (items.hasOwnProperty(key)) {
                if (key === 'whitelist') {
                    whitelistedDest = items[key];
                } else if (items[key] === DomainOptionEnum.WHITELISTED) {
                    whitelisted.push(key);
                } else {
                    silenced.push(key);
                }
            }
        }

        whitelisted.sort();
        silenced.sort();
        whitelistedDest.sort();
        return [whitelisted, silenced, whitelistedDest];
    }

    setSourceOption(domain:string, option:DomainOptionEnum, cb?:(data:AllOptions)=>void):void {
        let _cb = this.getCallback(cb);
        if (option === DomainOptionEnum.NONE) {
            this.storage.remove(domain, _cb)
        } else {
            this.storage.set({
                [domain]: option
            }, _cb);
        }
    }
    setIsWhitelistedDestination(domain:string, option:boolean, cb?:(data:AllOptions)=>void):void {
        this.storage.get('whitelist', (items) => {
            let whitelisted = items['whitelist'] || [];
            let index = whitelisted.indexOf(domain);
            let isWhitelisted = index !== -1;

            if (option && !isWhitelisted) {
                whitelisted.push(domain);
            } else if (!option && isWhitelisted) {
                whitelisted.splice(index, 1);
            } else {
                cb(null); // Indicates there was no change in data.
                return;
            }

            this.storage.set({
                'whitelist': whitelisted
            }, this.getCallback(cb));
        });
    }
    enumerateOptions(cb:OptionsCallback):void {
        this.storage.get(null, (items) => {
            cb(ExtensionSettingsDao.itemsToOptions(items));
        });
    }

}
