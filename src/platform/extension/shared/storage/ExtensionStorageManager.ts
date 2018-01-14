import chrome from '../platform_namespace';
import IStorageManager from '../../../../storage/IStorageManager';

export default class ExtensionStorageManager implements IStorageManager {
    requestDestinationWhitelist(dest:string):void {
        chrome.storage.local.get('whitelist', (items) => {
            let whitelisted:string[] = items['whitelist'] || [];
            whitelisted.push(dest);
            chrome.storage.local.set({
                'whitelist': whitelisted
            });
        });
    }
    requestDomainWhitelist(domain:string):void {
        chrome.storage.local.get(domain, (items) => {
            let domainOption:DomainOption = items[domain] || {};
            domainOption.whitelisted = true;
            chrome.storage.local.set({
                [domain]: domainOption
            });
        });
    }
}
