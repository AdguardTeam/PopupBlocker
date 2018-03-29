import chrome from '../platform_namespace';
import { AllOptions, AllOptionsCallback } from '../../../../storage/ISettingsDao';
import { isUndef } from '../../../../shared/instanceof';
import OptionsController from '../../../../ui/options/OptionsController';
import { Settings } from '../message_types';
import IExtensionSettingsDao, { DomainSettingsCallback } from './IExtensionSettingsDao';

export default class ExtensionSettingsDao implements IExtensionSettingsDao {

    private static WHITELIST = 'whitelist';

    private $storage = chrome.storage.local;

    private static itemsToOptions(items:stringmap<any>):AllOptions {
        let whitelisted = [];
        let silenced = [];

        for (let key in items) {
            if (items.hasOwnProperty(key)) {
                if (key === ExtensionSettingsDao.WHITELIST) {
                    whitelisted = items[key];
                } else {
                    let value = items[key];
                    if ((value & DomainOptionEnum.SILENCED) !== 0) {
                        silenced.push(key);
                    }
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
    setWhitelist(domain:string, whitelisted:boolean|null, cb?:func):void {
        this.$storage.get([ExtensionSettingsDao.WHITELIST], (items) => {
            let whitelist:string[] = items[ExtensionSettingsDao.WHITELIST];
            let prevWhitelistInd = whitelist.indexOf(domain);

            if (prevWhitelistInd === -1 && whitelisted !== false) {
                whitelist.push(domain);
            } else if (prevWhitelistInd !== -1 && whitelisted !== true) {
                whitelist.splice(prevWhitelistInd, 1);
            } else {
                if (!isUndef(cb)) { cb(); }
                return;
            }

            this.$storage.set({
                [ExtensionSettingsDao.WHITELIST]: whitelist
            }, cb);
        });
    }
    enumerateOptions(cb:AllOptionsCallback):void {
        this.$storage.get(null, (items) => {
            cb(ExtensionSettingsDao.itemsToOptions(items));
        });
    }
    getDomainOption(domain:string, cb:DomainSettingsCallback) {
        this.$storage.get([ExtensionSettingsDao.WHITELIST, domain], (items) => {
            let whitelist = items[ExtensionSettingsDao.WHITELIST];
            let domainOption = items[domain];

            if (isUndef(whitelist)) {
                whitelist = [];
            }
            if (isUndef(domainOption)) {
                domainOption = DomainOptionEnum.NONE;
            }

            cb({ whitelist, domainOption });
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

            let whitelist:string[];
            if (ExtensionSettingsDao.WHITELIST in changes) {
                whitelist = changes[ExtensionSettingsDao.WHITELIST].newValue;
            }

            cb({ whitelist, domainOption });
        })
    }

}
