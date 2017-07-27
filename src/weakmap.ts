// https://github.com/Polymer/WeakMap
let wm;

if (typeof WeakMap == 'function') {
    wm = WeakMap;
} else {
    let counter = Date.now() % 1e9;
    let defineProperty = Object.defineProperty;

    wm = class <T> {
        private name;
        constructor() {
            this.name = '__st' + (Math.random() * 1e9 >>> 0) + (counter++ + '__');
        }
        set(key, value) {
            let entry = key[this.name];
            if (entry && entry[0] === key)
                entry[1] = value;
            else
                defineProperty(key, this.name, {value: [key, value], writable: true});
            return this;
        }
        get(key):T {
            let entry;
            return (entry = key[this.name]) && entry[0] === key ?
                entry[1] : undefined;
        }
        delete(key):boolean {
            var entry = key[this.name];
            if (!entry) return false;
            var hasValue = entry[0] === key;
            entry[0] = entry[1] = undefined;
            return hasValue;
        }
        has(key):boolean {
            var entry = key[this.name];
            if (!entry) return false;
            return entry[0] === key;
        }
    }
}

export default wm;
