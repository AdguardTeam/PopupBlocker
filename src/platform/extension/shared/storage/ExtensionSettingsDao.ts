import chrome from '../platform_namespace';
import { AllOptions, AllOptionsCallback } from '../../../../storage/ISettingsDao';
import { isUndef } from '../../../../shared/instanceof';
import OptionsController from '../../../../ui/options/OptionsController';
import { Settings } from '../message_types';
import IExtensionSettingsDao, { DomainSettingsCallback } from './IExtensionSettingsDao';

export default class ExtensionSettingsDao implements IExtensionSettingsDao {

    private static WHITELISTED_DEST_KEY = 'whitelist';

    private $storage = chrome.storage.local;

    private static itemsToOptions(items:stringmap<any>):AllOptions {
        let whitelisted = [];
        let silenced = [];

        for (let key in items) {
            if (items.hasOwnProperty(key)) {
                if (items[key] === DomainOptionEnum.WHITELISTED) {
                    whitelisted.push(key);
                } else {
                    silenced.push(key);
                }
            }
        }

        whitelisted.sort();
        silenced.sort();
        
        return [whitelisted, silenced];
    }

    setSourceOption(domain:string, option:DomainOptionEnum, cb?:func):void {
        if (option === DomainOptionEnum.NONE) {
            this.$storage.remove(domain, cb)
        } else {
            this.$storage.set({
                [domain]: option
            }, cb);
        }
    }
    enumerateOptions(cb:AllOptionsCallback):void {
        this.$storage.get(null, (items) => {
            cb(ExtensionSettingsDao.itemsToOptions(items));
        });
    }
    getDomainOption(domain:string, cb:DomainSettingsCallback) {
        this.$storage.get([domain], (items) => {
            let domainOption = items[domain];
            if (isUndef(domainOption)) {
                domainOption = DomainOptionEnum.NONE;
            }

            cb({ domainOption });
        });
    }

    onSettingsChange(cb:AllOptionsCallback) {
        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace !== 'local') { return; }
            this.enumerateOptions(cb);
        });
    }
    onDomainSettingsChange(domain:string, cb:DomainSettingsCallback) {
        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace !== 'local') { return; }
            let domainOption:DomainOptionEnum;

            if (domain in changes) {
                domainOption = changes[domain].newValue;
                if (isUndef(domainOption)) { // When a key was removed
                    domainOption = DomainOptionEnum.NONE;
                }
            }

            cb({ domainOption });
        })
    }

}
