import * as log from './log';

/**
 * A polyfill for the WeakMap that covers only the most basic usage.
 * Originally based on {@link https://github.com/Polymer/WeakMap}
 */ 
let counter = Date.now() % 1e9;
const defineProperty = Object.defineProperty;
export class WeakMapPolyfill<K, V> {
    private $name;
    constructor() {
        this.$name = '__st' + (Math.random() * 1e9 >>> 0) + (counter++ + '__');
    }
    set(key:K, value:V) {
        let entry = key[this.$name];
        if (entry && entry[0] === key)
            entry[1] = value;
        else
            defineProperty(key, this.$name, {value: [key, value], writable: true});
        return this;
    }
    get(key:K):V {
        let entry;
        return (entry = key[this.$name]) && entry[0] === key ?
            entry[1] : undefined;
    }
    delete(key:K):boolean {
        var entry = key[this.$name];
        if (!entry) return false;
        var hasValue = entry[0] === key;
        entry[0] = entry[1] = undefined;
        return hasValue;
    }
    has(key:K):boolean {
        var entry = key[this.$name];
        if (!entry) return false;
        return entry[0] === key;
    }
}

export const nativeWeakMapSupport = typeof WeakMap === 'function';
/**
 * Firefox has a buggy WeakMap implementation as of 58. It won't accept
 * certain objects which are relatively recently added to the engine.
 * {@link https://bugzilla.mozilla.org/show_bug.cgi?id=1391116}
 * {@link https://bugzilla.mozilla.org/show_bug.cgi?id=1351501}
 * A similar error prevents using `AudioBuffer` as a key.
 */
export const buggyWeakMapSupport = !nativeWeakMapSupport ? false : (function() {
    if (typeof DOMPoint !== 'function') { return false; }
    const key = new DOMPoint();
    const weakmap = new WeakMap();
    try {
        weakmap.set(key, undefined); // Firefox 58 throws here.
        return false;
    } catch(e) {
        log.print('Buggy WeakMap support');
        return true;
    }
})();
// To be used in AudioBufferCache
export const NonBuggyWeakMap:IWeakMapCtor = nativeWeakMapSupport && !buggyWeakMapSupport ? WeakMap : WeakMapPolyfill;

const wm:IWeakMapCtor = nativeWeakMapSupport ? WeakMap : WeakMapPolyfill;
export default wm;

//

interface DOMPoint {
    new(x?:number, y?:number, z?:number, w?:number):any
}
declare const DOMPoint:DOMPoint
