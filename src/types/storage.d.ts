type DataVersion = 1 | 2 | 3;

/**
 * Describes how data is stored,
 * consists of mandatory storage fields
 */
interface GMStorage {
    '#id': string,
    ver: `${DataVersion}`,
}

// v2 silencer set '1' to silence domain and
// '0' to disable silencing
type SilencerValueV2 = 0 | 1;

// Represents v2 of data storage
interface StorageV2 extends GMStorage {
    ver: '2';
    whitelist: string;
    [key: string]: `${SilencerValueV2}`;
}

// Represents v3 of data storage
interface StorageV3 extends GMStorage {
    ver: '3',
    allowed: string,
    silenced: string,
}

// v1 storage held whitelisted domains as objects
type DomainValueV1 = {
    whitelisted: boolean,
};

type StorageIteratorCallback = (key: string, value: string | DomainValueV1) => void;

type ValueListener = Tampermonkey.ValueChangeListener;

/**
 * Data shape of each added value listener
 */
type ValueListenerData = {
    listener: ValueListener,
    id: number;
};
