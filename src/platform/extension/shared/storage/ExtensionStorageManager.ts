import chrome from '../platform_namespace';
import IStorageManager, { AllOptions, OptionsCallback } from '../../../../storage/IStorageManager';
import { isUndef } from '../../../../shared/instanceof';
import OptionsController from '../../../../ui/options/OptionsController';

export default class ExtensionStorageManager implements IStorageManager {

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
                    whitelistedDest = items[key].split(',');
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
        this.storage.set({
            [domain]: option
        }, this.getCallback(cb));
    }
    setIsWhitelistedDestination(domain:string, option:boolean, cb?:(data:AllOptions)=>void):void {
        this.storage.get('whitelist', (items) => {
            let whitelisted:string[] = items['whitelist'] || [];
            let index = whitelisted.indexOf(domain)

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
                'whitelist': whitelisted.join(',')
            }, this.getCallback(cb));
        });
    }
    enumerateOptions(cb:OptionsCallback):void {
        this.storage.get(null, (items) => {
            cb(ExtensionStorageManager.itemsToOptions(items));
        });
    }

}
