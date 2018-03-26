import ISettingsDao, { AllOptions, AllOptionsCallback } from "../../../storage/ISettingsDao";
import { isUndef } from "../../../shared/instanceof";

export default class UserscriptSettingsDao implements ISettingsDao {
    setSourceOption(domain:string, option:DomainOptionEnum, cb?:func):void {
        GM_setValue(domain, option);
        if (!isUndef(cb)) { cb(); }
        this.fireListeners();
    }
    private getEnumeratedOptions():[string[], string[]] {
        let keys = GM_listValues();
        let whitelisted = [];
        let silenced = [];
        for (let i = 0, l = keys.length; i < l; i++) {
            let key = keys[i];
            let value = GM_getValue(key);
            let valueType = typeof value;

            if (valueType === 'number') {
                // Settings signature from v2.2 and onward.
                switch (value) {
                    case DomainOptionEnum.WHITELISTED:
                        whitelisted.push(key);
                        break;
                    case DomainOptionEnum.SILENCED:
                        silenced.push(key);
                }
            } else if (valueType == 'string') {
                // Old settings signature in <=2.1                
                try {
                    let settings = JSON.parse(value);
                    let whitelisted = settings.whitelisted;
                    if (!isUndef(whitelisted)) {
                        whitelisted.push(key);
                    }
                } catch(e) { }
            }
        }
        return [whitelisted, silenced];
    }

    enumerateOptions(cb:AllOptionsCallback):void {
        cb(this.getEnumeratedOptions());
    }

    private settingsChangeListeners:AllOptionsCallback[] = [];
    private fireListeners() {
        let listeners = this.settingsChangeListeners;
        let options = this.getEnumeratedOptions();
        for (let i = 0, l = listeners.length; i < l; i++) {
            listeners[i](options);
        }
    }
    onSettingsChange(cb:AllOptionsCallback) {
        this.settingsChangeListeners.push(cb);
    }
}
