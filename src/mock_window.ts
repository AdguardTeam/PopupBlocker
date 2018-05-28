import { getOwnPropertyDescriptor, defineProperty } from './shared/protected_api';
import ILoggedProxyService from './proxy/ILoggedProxyService';

const mockObject = (orig:Object, mocked?:Object):Object => {
    mocked = mocked || <Object>{};
    for (let prop in orig) {
        let desc = getOwnPropertyDescriptor(orig, prop);
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

const hrefDesc = getOwnPropertyDescriptor(HTMLAnchorElement.prototype, 'href');

// @ifndef NO_PROXY
import WeakMap from './shared/WeakMap';
export const mockedWindowCollection = new WeakMap();
// @endif

const mockWindow = (href, name, proxyService:ILoggedProxyService) => {
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

    let loc = mockLocation(href, proxyService);
    const locDesc = {
        get: function() { return loc; },
        set: function() {},
        configurable: true
    };
    defineProperty(win, _location, locDesc);
    defineProperty(doc, _location, locDesc);

    // @ifndef DEBUG
    proxyService.wrapAccessor(win, _location);
    proxyService.wrapAccessor(doc, _location);
    // @endif

    // @ifndef NO_PROXY
    mockedWindowCollection.set(win, true);
    // @endif
    return win;
};

import { createLocation } from './shared/url';


const mockLocation = (href:string, proxyService:ILoggedProxyService) => {
    const a = createLocation(href);
    a[_assign] = a[_replace] = hrefDesc.set;
    defineProperty(a, _href, hrefDesc);
    // @ifndef DEBUG
    proxyService.wrapMethod(a, _assign);
    proxyService.wrapMethod(a, _replace);
    proxyService.wrapAccessor(a, _href);
    // @endif
    return a;
}

let _location = 'location', _assign = 'assign', _replace = 'replace', _href = 'href';

export default mockWindow;
