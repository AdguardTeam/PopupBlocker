/* eslint-disable no-underscore-dangle */
import {
    getOwnPropertyDescriptor,
    defineProperty,
    SafeWeakMap,
    createLocation,
} from './shared';
import ILoggedProxyService from './proxy/ILoggedProxyService';

export const mockedWindowCollection = new SafeWeakMap();

const _location = 'location';
const _assign = 'assign';
const _replace = 'replace';
const _href = 'href';

const mockObject = (orig:Object, mocked?:Object):Object => {
    /* eslint-disable no-restricted-syntax, guard-for-in */
    const mockedObject = mocked || <Object>{};
    for (const prop in orig) {
        const desc = getOwnPropertyDescriptor(orig, prop);
        if (desc) {
            switch (typeof desc.value) {
                case 'undefined':
                    break;
                case 'object':
                    mockedObject[prop] = {};
                    break;
                case 'function':
                    mockedObject[prop] = () => true;
                    break;
                default:
                    mockedObject[prop] = orig[prop];
            }
        }
    }
    /* eslint-enable no-restricted-syntax, guard-for-in */
    return mockedObject;
};

const hrefDesc = getOwnPropertyDescriptor(HTMLAnchorElement.prototype, 'href');

const mockLocation = (href:string, proxyService:ILoggedProxyService) => {
    const a = createLocation(href);
    a[_assign] = hrefDesc.set;
    a[_replace] = hrefDesc.set;
    defineProperty(a, _href, hrefDesc);

    if (NO_PROXY) {
        // TODO make preprocessor plugin to cut these from beta and release builds
        proxyService.wrapMethod(a, _assign);
        proxyService.wrapMethod(a, _replace);
        proxyService.wrapAccessor(a, _href);
    }

    return a;
};

const mockWindow = (href, name, proxyService:ILoggedProxyService) => {
    const win:any = mockObject(window);
    mockObject(Window.prototype, win);
    const doc:any = mockObject(document);
    mockObject(Document.prototype, doc);
    win.opener = window;
    win.closed = false;
    win.name = name;
    win.document = doc;

    doc.open = function () { return this; };
    doc.write = () => {};
    doc.writeln = () => {};
    doc.close = () => {};

    const loc = mockLocation(href, proxyService);
    const locDesc = {
        get() { return loc; },
        set() {},
        configurable: true,
    };
    defineProperty(win, _location, locDesc);
    defineProperty(doc, _location, locDesc);

    if (NO_PROXY) {
        // TODO make preprocessor plugin to cut these from beta and release builds
        proxyService.wrapAccessor(win, _location);
        proxyService.wrapAccessor(doc, _location);
    } else {
        mockedWindowCollection.set(win, true);
    }

    return win;
};

export default mockWindow;
