import chrome from '../platform_namespace';
import { AllOptions, AllOptionsCallback } from '../../../../storage/ISettingsDao';
import { isUndef } from '../../../../shared/instanceof';
import OptionsController from '../../../../ui/controllers/options/OptionsController';
import { Settings } from '../message_types';
import IExtensionSettingsDao, { DomainSettingsCallback } from './IExtensionSettingsDao';
import * as log from '../../../../shared/debug';
import { DomainOptionEnum } from '../../../../storage/storage_data_structure';
import Transaction from './transaction/Transaction';
import ITransaction from './transaction/ITransaction';


export default class ExtensionSettingsDao implements IExtensionSettingsDao {

    private static WHITELIST = 'whitelist';

    setSourceOption(domain:string, option:DomainOptionEnum, cb?:func):void {
        log.print('setting source option', option);
        const transaction = new Transaction(cb)
            .setRegister({
                [domain]: option
            });

        if (option === DomainOptionEnum.NONE) {
            transaction
                .removeData()
                .commit();
        } else {
            transaction
                .setData()
                .commit();
        }
    }
    setWhitelist(domain:string, whitelisted:boolean|null, cb?:func):void {
        log.print('setting whitelist', whitelisted);
        new Transaction(cb)
            .setRegister({
                [ExtensionSettingsDao.WHITELIST]: []
            })
            .getData()
            .transformRegister((items) => {
                let whitelist:string[] = items[ExtensionSettingsDao.WHITELIST];
                // Include or exclude the provided domain according to the provided value
                let prevWhitelistInd = whitelist.indexOf(domain);
                if (prevWhitelistInd === -1 && whitelisted !== false) {
                    whitelist.push(domain);
                } else if (prevWhitelistInd !== -1 && whitelisted !== true) {
                    whitelist.splice(prevWhitelistInd, 1);
                } else {
                    return {};
                }
                return {
                    [ExtensionSettingsDao.WHITELIST]: whitelist
                }
            })
            .setData()
            .commit();
    }
    enumerateOptions(cb:AllOptionsCallback):void {
        new Transaction(cb)
            .setRegister(null)
            .getData()
            .transformRegister(ExtensionSettingsDao.dictToAllOption)
            .commit();
    }
    getDomainOption(domain:string, cb:DomainSettingsCallback) {
        new Transaction(cb)
            .setRegister({
                [ExtensionSettingsDao.WHITELIST]: [],
                [domain]: DomainOptionEnum.NONE
            })
            .getData()
            .transformRegister((items) => {
                let $whitelist = items[ExtensionSettingsDao.WHITELIST];
                let domainOption = items[domain];
                return { $whitelist, domainOption };
            })
            .commit();
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

            let $whitelist:string[];
            if (ExtensionSettingsDao.WHITELIST in changes) {
                $whitelist = changes[ExtensionSettingsDao.WHITELIST].newValue;
            }

            cb({ $whitelist, domainOption });
        })
    }

    private static dictToAllOption(items:stringmap<any>):AllOptions {
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

}
