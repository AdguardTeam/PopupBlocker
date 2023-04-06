// Expose mocked GM_api to the global scope
export function mockGMApi() {
    let GM_storage = Object.create(null);

    function GM_getValue(key:string, defaultValue?) {
        if (key in GM_storage) {
            return GM_storage[key];
        }
        return defaultValue;
    }

    function GM_setValue(key: string, newValue) {
        GM_storage[key] = newValue;
    }

    function GM_listValues() {
        return Object.keys(GM_storage);
    }

    function GM_deleteValue(key:string) {
        delete GM_storage[key];
    }

    // This one is actually not part of native GM methods
    function GM_clearStorage() {
        GM_storage = Object.create(null);
    }

    window.GM_getValue = GM_getValue;
    window.GM_setValue = GM_setValue;
    window.GM_deleteValue = GM_deleteValue;
    window.GM_listValues = GM_listValues;
    window.GM_clearStorage = GM_clearStorage;
}

// GM api must be mocked before migration and settings start
mockGMApi();
