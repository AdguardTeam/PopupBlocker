import { gmWrapper } from './GMWrapper';

export const enum OptionName {
    Allowed = 'allowed',
    Silenced = 'silenced',
}

export interface OptionInterface {
    getList(): OptionList
    updateList(): void
    addItem(domain: string): void
    removeItem(domain: string): void
    isMember(domain: string): boolean
}

export type OptionItem = string;

export type OptionList = OptionItem[];

/**
 * Represents singe userscript option
 */
export class Option implements OptionInterface {
    private list: OptionList;

    private name: OptionName;

    /**
     * Updates self, used at init, storage migration and manual storage input
     */
    updateList = () => {
        const listStringified = gmWrapper.getValue<string>(this.name, '');
        this.list = listStringified ? listStringified.split(',') : [];
    };

    constructor(name: OptionName) {
        this.name = name;
        this.updateList();
        gmWrapper.addValueChangeListener(this.name, this.updateList);
    }

    private pushSelfToStorage = () => gmWrapper.setValue(this.name, this.list.join(','));

    getList = (): OptionList => this.list;

    /**
     * Checks if given string is already stored
     * @param value arbitrary string value
     */
    isMember = (value: string): boolean => this.list.includes(value);

    /**
     * Pushes item to script storage and saves it to own list
     * @param item arbitrary string
     */
    addItem = (item: string) => {
        if (this.isMember(item)) {
            return;
        }
        this.list.push(item);
        this.pushSelfToStorage();
    };

    /**
     * Removes items from script storage and own list
     */
    removeItem = (item: string) => {
        if (!this.isMember(item)) {
            return;
        }
        this.list = this.list.filter((domain) => domain !== item);
        this.pushSelfToStorage();
    };
}

export const optionsApi = {
    [OptionName.Allowed]: new Option(OptionName.Allowed),
    [OptionName.Silenced]: new Option(OptionName.Silenced),
};
