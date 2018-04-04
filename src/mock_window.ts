import { wrapMethod, wrapAccessor } from './proxy';

const mockObject = (orig:Object, mocked?:Object):Object => {
    mocked = mocked || <Object>{};
    for (let prop in orig) {
        let desc = Object.getOwnPropertyDescriptor(orig, prop);
        if (desc) {
            switch(typeof desc.value) {
                case 'undefined':
                break;
                case 'object':
                mocked[prop] = {}; break;
                case 'function':
                mocked[prop] = function() { return true; }; break;
                default:
                mocked[prop] = orig[prop];
            }
        }
    }
    return mocked;
};

const hrefDesc = Object.getOwnPropertyDescriptor(HTMLAnchorElement.prototype, 'href');

// @ifndef NO_PROXY
import WeakMap from './shared/WeakMap';
export const mockedWindowCollection = new WeakMap();
// @endif

const mockWindow = (href, name) => {
    let win:any, doc:any;
    win = mockObject(window);
    mockObject(Window.prototype, win);
    doc = mockObject(document);
    mockObject(Document.prototype, doc);
    win['opener'] = window;
    win['closed'] = false;
    win['name'] = name;
    win['document'] = doc;
    doc['open'] = function(){return this;}
    doc['write'] = function(){};
    doc['writeln'] = function(){}
    doc['close'] = function(){};

    let loc = mockLocation(href);
    const locDesc = {
        get: function() { return loc; },
        set: function() {}
    };
    Object.defineProperty(win, _location, locDesc);
    Object.defineProperty(doc, _location, locDesc);

    // @ifndef DEBUG
    wrapAccessor(win, _location);
    wrapAccessor(doc, _location);
    // @endif

    // @ifndef NO_PROXY
    mockedWindowCollection.set(win, true);
    // @endif
    return win;
};

import { createLocation } from './shared/url';

const mockLocation = (href:string) => {
    const a = createLocation(href);
    a[_assign] = a[_replace] = hrefDesc.set;
    Object.defineProperty(a, _href, hrefDesc);

    // @ifndef DEBUG
    wrapMethod(a, _assign);
    wrapMethod(a, _replace);
    wrapAccessor(a, _href);
    // @endif
    return a;
}

let _location = 'location', _assign = 'assign', _replace = 'replace', _href = 'href';

export default mockWindow;
