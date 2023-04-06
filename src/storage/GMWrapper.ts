interface StorageInterface {
    setValue(key: string, value: any): void
    getValue<T>(key: string, defaultValue: T): T
    deleteValue(key: string): void
    addValueChangeListener (key: string, listener: ValueListener): number
    listValues(): string[]
    setStorage(storage: GMStorage): void
    iterateStorage(callback: StorageIteratorCallback): void
}

/**
 * AdGuard for desktop only implements GM_setValue, GM_getValue and GM_listValues methods
 * so Storage is introduced to simplify GM API consuming by wrapping methods that are available
 * and deriving the rest
 */
class GMWrapper implements StorageInterface {
    private listenersCount = 0;

    private valueListeners: Record<string, ValueListenerData[]> = {};

    private notifyListeners(key: string, oldValue: any, newValue: any) {
        const listeners = this.valueListeners[key];
        if (Array.isArray(listeners)) {
            listeners.forEach((listenerData) => listenerData.listener(key, oldValue, newValue, false));
        }
    }

    /**
     * Gets value from storage
     *
     * @param key a string specifying the key for which the value should be retrieved
     * @param defaultValue value to be returned if the key does not exist in the extension's storage
     * @returns value of the specified key from the storage, or the default value if the key does not exist
     */
    getValue<T>(key: string, defaultValue?: T): T {
        return GM_getValue<T>(key, defaultValue);
    }

    deleteValue(key: string): void {
        GM_deleteValue(key);
    }

    /**
     * Sets the value of a specific key in the userscript's storage
     *
     * @param key key for which the value should be set
     * @param newValue value to be set for the key
     */
    setValue(key: string, newValue: any) {
        const oldValue = this.getValue(key);
        GM_setValue(key, newValue);
        if (oldValue !== newValue) {
            this.notifyListeners(key, oldValue, newValue);
        }
    }

    /**
     * Adds listener for changes to the value of a specific key in the userscript's storage
     *
     * Note: This function is uniformity measure as AdGuard for desktop doesn't implement GM_addValueChangeListener;
     * listener removal is not needed and so not implemented, and listener id is returned to conform with
     * original GM_addValueChangeListener method
     *
     * @param key the key for which changes should be monitored
     * @param listener callback function that will be called when the value of the key changes
     * @returns returns an id that can be used to remove the listener later
     */
    addValueChangeListener(key: string, listener: Tampermonkey.ValueChangeListener) {
        if (typeof listener !== 'function') {
            throw new Error('Invalid listener');
        }
        const listenersArray = this.valueListeners[key];
        const listenerObj = {
            id: this.listenersCount += 1,
            listener,
        };

        if (Array.isArray(listenersArray)) {
            listenersArray.push(listenerObj);
        } else {
            this.valueListeners[key] = [listenerObj];
        }

        return listenerObj.id;
    }

    /**
     * Gets a list of keys of all stored data
     */
    listValues(): string[] {
        return GM_listValues();
    }

    /**
     * Sets new storage
     */
    setStorage(storage: GMStorage): void {
        // Remove old values
        const keys = this.listValues();
        keys.forEach(this.deleteValue);

        // Set new values
        Object.entries(storage).forEach((entry) => {
            const [key, value] = entry;
            this.setValue(key, value);
        });
    }

    /**
     * Iterate through script manager storage
     */
    iterateStorage(callback: StorageIteratorCallback): void {
        const keys = this.listValues();
        keys.forEach((key) => {
            const value = this.getValue<string | DomainValueV1>(key, '');
            callback(key, value);
        });
    }
}

export const gmWrapper = new GMWrapper();
