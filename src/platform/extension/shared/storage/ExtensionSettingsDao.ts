import chrome from '../platform_namespace';
import ISettingsDao, { AllOptions, AllOptionsCallback, DomainSettingsCallback } from '../../../../storage/ISettingsDao';
import { isUndef } from '../../../../shared/instanceof';
import OptionsController from '../../../../ui/options/OptionsController';
import { Settings } from '../message_types';

export default class ExtensionSettingsDao implements ISettingsDao {

    private static WHITELISTED_DEST_KEY = 'whitelist';

    private $storage = chrome.storage.local;

    private static itemsToOptions(items:stringmap<any>):AllOptions {
        let whitelisted = [];
        let silenced = [];
        let whitelistedDest = [];

        for (let key in items) {
            if (items.hasOwnProperty(key)) {
                if (key === ExtensionSettingsDao.WHITELISTED_DEST_KEY) {
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

    setSourceOption(domain:string, option:DomainOptionEnum, cb?:func):void {
        if (option === DomainOptionEnum.NONE) {
            this.$storage.remove(domain, cb)
        } else {
            this.$storage.set({
                [domain]: option
            }, cb);
        }
    }
    setIsWhitelistedDestination(domain:string, option:boolean, cb?:func):void {
        this.$storage.get(ExtensionSettingsDao.WHITELISTED_DEST_KEY, (items) => {
            let whitelisted = items[ExtensionSettingsDao.WHITELISTED_DEST_KEY] || [];
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

            this.$storage.set({
                [ExtensionSettingsDao.WHITELISTED_DEST_KEY]: whitelisted
            }, cb);
        });
    }
    enumerateOptions(cb:AllOptionsCallback):void {
        this.$storage.get(null, (items) => {
            cb(ExtensionSettingsDao.itemsToOptions(items));
        });
    }
    getDomainOption(domain:string, cb:DomainSettingsCallback) {
        this.$storage.get([ExtensionSettingsDao.WHITELISTED_DEST_KEY, domain], (items) => {
            let domainOption = items[domain];
            let whitelistedDestinations = items[ExtensionSettingsDao.WHITELISTED_DEST_KEY];

            if (isUndef(domainOption)) {
                domainOption = DomainOptionEnum.NONE;
            }
            if (isUndef(whitelistedDestinations)) {
                whitelistedDestinations = [];
            }

            cb({ domainOption, whitelistedDestinations });
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
            let domainOption:DomainOptionEnum, whitelistedDestinations:string[];

            if (ExtensionSettingsDao.WHITELISTED_DEST_KEY in changes) {
                whitelistedDestinations = changes[ExtensionSettingsDao.WHITELISTED_DEST_KEY].newValue;
            }
            if (domain in changes) {
                domainOption = changes[domain].newValue;
                if (isUndef(domainOption)) { // When a key was removed
                    domainOption = DomainOptionEnum.NONE;
                }
            }

            cb({ domainOption, whitelistedDestinations });
        })
    }

}
