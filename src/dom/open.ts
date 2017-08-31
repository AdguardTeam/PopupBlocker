import { ApplyHandler, makeObjectProxy, wrapMethod } from '../proxy';
import { verifyEvent, retrieveEvent, verifyCurrentEvent } from '../events/verify';
import examineTarget from '../events/examine_target';
import { _dispatchEvent } from './dispatchEvent/orig';
import { timeline, position } from '../timeline/index';
import { TLEventType, TimelineEvent } from '../timeline/event';
import * as log from '../shared/log';
import bridge from '../bridge';
import { createAlertInTopFrame } from '../messaging';
import pdfObjObserver from '../observers/pdf_object_observer';

const openVerifiedWindow:ApplyHandler = function(_open, _this, _arguments, context) {
    let targetHref = _arguments[0];
    log.call('Called window.open with url ' + targetHref);
    // Checks if an url is in a whitelist
    const url = bridge.url(targetHref);
    const destDomain = url[1];
    if (bridge.whitelistedDestinations.indexOf(destDomain) !== -1) {
        log.print(`The domain ${destDomain} is in whitelist.`);
        return _open.apply(_this, _arguments);
    }
    let currentEvent = retrieveEvent();
    let passed = verifyEvent(currentEvent);
    let win;
    if (passed) {
        log.print('event verified, inquiring event timeline..');
        if (timeline.canOpenPopup(position)) {
            log.print('calling original window.open...');
            win = _open.apply(_this, _arguments);
            win = makeObjectProxy(win);
            log.callEnd();
            return win;
        }
        log.print('canOpenPopup returned false');
        log.callEnd();
    }
    createAlertInTopFrame(bridge.domain, url[2], false);
    pdfObjObserver.start();
    if (currentEvent) { examineTarget(currentEvent, _arguments[0]); }
    log.print('mock a window object');
    // Return a mock window object, in order to ensure that the page's own script does not accidentally throw TypeErrors.
    win = mockWindow(_arguments[0], _arguments[1]);
    win = makeObjectProxy(win);
    context['mocked'] = true;
    log.callEnd();
    return win;
};

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

const mockWindow = (href, name) => {
    let win:any, doc:any, loc:any;
    win = mockObject(window);
    mockObject(Window.prototype, win);
    doc = mockObject(document);
    mockObject(Document.prototype, doc);
    win.opener = window;
    win.closed = false;
    win.name = name;
    win.document = doc;
    loc = document.createElement('a');
    loc.href = href;
    doc[_location] = loc;
    // doc.open = function(){return this;}
    // doc.write = function(){};
    // doc.close = function(){};
    Object.defineProperty(win, _location, {
        get: function() {
            timeline.registerEvent(new TimelineEvent(TLEventType.GET, _location, {
                this: this
            }), position);
            return loc;
        },
        set: function(incoming) {
            timeline.registerEvent(new TimelineEvent(TLEventType.SET, _location, {
                this: this,
                arguments: [incoming]
            }), position);
        }
    });
    return win;
};

var _location = 'location';

wrapMethod(window, 'open', openVerifiedWindow);
wrapMethod(Window.prototype, 'open', openVerifiedWindow); // for IE
