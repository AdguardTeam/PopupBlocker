type DataVersion = 1 | 2 | 3;

interface GMStorage {
    '#id': string,
    ver: `${DataVersion}`,
}

interface StorageV3 extends GMStorage {
    allowed: string,
    silenced: string,
}

interface StorageV2 extends GMStorage {
    whitelist: string;
}

declare function GM_setStorage(storage: GMStorage): void;
declare function GM_clearStorage(): void;

type ValueListenerObj = {
    listener: Tampermonkey.ValueChangeListener,
    id: number;
};
