import IStorageManager from '../../../../storage/IStorageManager';

export default class WebExtStorageManager implements IStorageManager {
    requestDestinationWhitelist(dest:string):void {
        browser.storage.sync.get('whitelist')
            .then((items) => {
                let whitelisted = <string[]>items['whitelist'] || [];
                whitelisted.push(dest);
                return browser.storage.sync.set({
                    'whitelist': whitelisted
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }
    requestDomainWhitelist(domain:string):void {
        browser.storage.sync.get(domain)
            .then((items) => {
                let domainOption:Partial<DomainOption> = <any>items[domain] || {};
                domainOption.whitelisted = true;
                return browser.storage.sync.set({
                    [domain]: domainOption
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }
}