import { getRandomStr } from '../shared/random';
import { optionsApi, OptionName } from './Option';
import { migrator } from './migrator';
import { gmWrapper } from './GMWrapper';
import { StorageKey } from './storage-key';

export interface ISettingsDao {
    /**
     * Adds domain to a specified list
     */
    setListItem(listName: OptionName, domain: string, cb?: func): void

    /**
     * Retrieves instance id from storage
     */
    getInstanceID(): string

    /**
     * Checks if given string is a member of specified list
     * @param listName
     * @param value arbitrary string value
     */
    isMemberOf(listName: string, value: string): boolean
}
/**
 * Manages options change and consuming
 */
class SettingsDao implements ISettingsDao {
    private allowed = optionsApi[OptionName.Allowed];

    private silenced = optionsApi[OptionName.Silenced];

    public migrateDataIfNeeded() {
        migrator.migrateDataIfNeeded();
    }

    setListItem(listName: OptionName, domain: string, cb?: func) {
        this[listName].addItem(domain);
        this.flushPageCache();
        if (typeof cb === 'function') {
            cb();
        }
    }

    isMemberOf = (listName: OptionName, value: string) => this[listName].isMember(value);

    getInstanceID(): string {
        let instanceID = gmWrapper.getValue(StorageKey.InstanceId);
        if (typeof instanceID === 'undefined') {
            instanceID = getRandomStr();
            gmWrapper.setValue(StorageKey.InstanceId, instanceID);
            this.flushPageCache();
        }
        return instanceID as string;
    }

    /**
     * Force flush the current page cache.
     * This is an ugly solution for https://github.com/AdguardTeam/PopupBlocker/issues/131
     */
    private flushPageCache():void {
        const xhr = new window.XMLHttpRequest();
        xhr.open('GET', window.location.href, true);

        xhr.setRequestHeader('Pragma', 'no-cache');
        xhr.setRequestHeader('Expires', '-1');
        xhr.setRequestHeader('Cache-Control', 'no-cache');

        xhr.send();
    }
}

export const settingsDao = new SettingsDao();
