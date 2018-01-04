import IStorageManager from '../../../../storage/IStorageManager';

export default class ChromeStorageManager implements IStorageManager {
    requestDestinationWhitelist(dest:string):void {
        chrome.storage.sync.get('whitelist', (items) => {
            let whitelisted:string[] = items['whitelist'] || [];
            whitelisted.push(dest);
            chrome.storage.sync.set({
                'whitelist': whitelisted
            });
        });
    }
    requestDomainWhitelist(domain:string):void {
        chrome.storage.sync.get(domain, (items) => {
            let domainOption:DomainOption = items[domain] || {};
            domainOption.whitelisted = true;
            chrome.storage.sync.set({
                [domain]: domainOption
            });
        });
    }
}
