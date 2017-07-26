/** @constructor */
var PopupBlocker = function (window) {

/************************************************************************************/
var top = window.top;
var PROP = typeof Symbol == 'function' ? Symbol() : Math.random().toString(36).substr(7);
var MouseEvent = top.MouseEvent;

/**
 * Gets the event that is being currently handled.
 * @return {Event}
 * @suppress {es5Strict}
 */
var retrieveEvent = function() {
    log('Retrieving event');
    var currentEvent = top.event;
    if (!currentEvent) {
        log('window.event does not exist, trying to get event from Function.caller');
        try {
            var caller = arguments.callee;
            while (caller.caller) { caller = caller.caller; }
            log('Reached at the top of caller chain.');
            if (caller.arguments && caller.arguments[0] && 'target' in caller.arguments[0]) {
                currentEvent = caller.arguments[0];
                log('The function at the bottom of the stack has an expected type. The current event is:', currentEvent);
            }
        } catch (e) {
            log('Getting event from Function.caller failed, due to an error:', e);
        }
    } else {
        log('window.event exists, of which the value is:', currentEvent);
    }
    return currentEvent;
};

/**
 * @param {*} event Optional argument, an event to test with. Default value is currentEvent.
 * @return {boolean} True if the event is legit, false if it is something that we should not allow window.open or dispatchEvent.
 */
var verifyEvent = function(event) {
    if (event) {
        log('Verifying event');
        var currentTarget = event.currentTarget;
        if (currentTarget) {
            var tagName = currentTarget.nodeName.toLowerCase();
            if (tagName == '#document' || tagName == 'html' || tagName == 'body') {
                log('VerifyEvent - the current event handler is suspicious, for the current target is either document, html, or body.');
                return false;
            } else if (maybeOverlay(currentTarget)) {
                log('VerifyEvent - the current event handler is suspicious, for the current target looks like an artificial overlay.');
                return false;
            }
        }
    }
    return true;
};

/**
 * Detects common overlay pattern.
 * @param {Element} el an element to check whether it is an overlay.
 * @return {boolean} true if el is an overlay.
 */
function maybeOverlay(el) {
    var w = window.innerWidth, h = window.innerHeight;
    if (el.offsetLeft << 4 < w && (w - el.offsetWidth) << 3 < w
        && el.offsetTop << 4 < h && (h - el.offsetHeight) << 3 < w) {
        var style = getComputedStyle(el);
        var position = style.getPropertyValue('position');
        var zIndex = style.getPropertyValue('z-index');
        log('An element passed offset test.');
        if ((position == 'fixed' || position == 'absolute') && zIndex > 1000) {
            log('An element passed computedStyle test.');
            return true;
        }
    }
    // ToDo: the element may have been modified in the event handler.
    // We may still test it using the inline style attribute.
    return false;
}

/**
 * Some popup scripts adds transparent overlays on each of page's links
 * which disappears only when popups are opened.
 * To restore the expected behavior, we need to detect if the event is 'masked' by artificial layers
 * and redirect it to the correct element.
 * ToDo: touch events: https://developer.mozilla.org/en/docs/Web/API/Touch_events
 */
var dispatchIfBlockedByMask = function() {
    var currentEvent = retrieveEvent();
    if (currentEvent) {
        if (currentEvent instanceof MouseEvent && currentEvent.isTrusted) {
            log('Checking current MouseEvent for its genuine target..');
            var x = currentEvent.clientX, y = currentEvent.clientY, target = currentEvent.target;
            var elts;
            if (document.elementsFromPoint) { elts = document.elementsFromPoint(x, y); }
            else if (document.msElementsFromPoint) { elts = document.msElementsFromPoint(x, y); }
            else {
                log('document.elementsFromPoint API is not available, exiting');
                return;
            }
            log('Elements at the clicked position are:', elts);
            var el;
            if ( elts[0] === target ) {
                log('The target is staying.');
                el = elts[1];
            } else {
                log('The target has modified inside event handlers.');
                el = elts[0];
            }
            var name = el.nodeName.toLowerCase();
            if ( name == 'iframe' || name == 'input' || name == 'a' || el.hasAttribute('onclick') || el.hasAttribute('onmousedown') ) {
                log('A real target candidate has default event handlers');
                var style = window.getComputedStyle(/** @type {Element} */(target));
                var position = style.getPropertyValue('position');
                var zIndex = style.getPropertyValue('z-index');
                if ( (position == 'absolute' || position == 'fixed') && zIndex > 1000 ) {
                    log('A mask candidate has expected style');
                    if (target.textContent.trim().length === 0 && target.getElementsByTagName('img').length === 0) {
                        log('A mask candidate has expected content, re-dispatching events..');
                        target.style.setProperty('display', 'none', 'important');
                        target.style.setProperty('pointer-events', 'none', 'important');
                        var clone = new MouseEvent(currentEvent.type, currentEvent);
                        _stopPropagation.call(currentEvent);
                        currentEvent.stopImmediatePropagation();
                        _dispatchEvent.call(el, clone);
                    }
                }
            }
        }
    }
};


// Overrides window.open.
var _open = window.open;

var openVerifiedWindow = function (url, name) {
    log('Called window.open');
    var passed = verifyEvent(retrieveEvent());
    var win;
    if (passed) {
        log('Test passed, calling original window.open...');
        win = _open.apply(this, arguments);
        // Complexness of popunder script stems from the fact that there is no reliable way to focus the original window.
        // popunder scripts use various 'hacks' to focus the original window.
        // For example, some abuse Notification.requestPermission api or chrome pdf plugin.
        // ToDo: We may detect such behaviors here additionaly, and close the new window {win}.
    } else {
        dispatchIfBlockedByMask();
        log('mock a window object');
        // Return a mock window object, in order to ensure that the page's own script does not accidentally throw TypeErrors.
        var loc = document.createElement('a');
        loc.href = arguments[0];
        var doc = Object.create(HTMLDocument.prototype);
        win = {};
        Object.getOwnPropertyNames(window).forEach(function(prop) {
            switch(typeof prop) {
                case 'object': win[prop] = {}; break;
                case 'function': win[prop] = function() {return true;}; break;
                case 'string':  win[prop] = ''; break;
                case 'number': win[prop] = NaN; break;
                case 'boolean': win[prop] = false; break;
                case 'undefined': win[prop] = undefined; break;
            }
        });
        win.opener = window;
        win.closed = false;
        win.name = name;
        win.location = loc;
        win.document = doc;
    }
    return win;
};

window.open = openVerifiedWindow;

// Overrides EventTarget.prototype.dispatchEvent;
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
var _dispatchEvent = typeof EventTarget == 'undefined' ? Node.prototype.dispatchEvent : EventTarget.prototype.dispatchEvent;
var dispatchVerifiedEvent = function (evt) {
    if (evt instanceof MouseEvent && this instanceof HTMLAnchorElement && !evt.isTrusted) {
        log('It is a MouseEvent on an anchor tag.');
        var passed = verifyEvent(retrieveEvent());
        if (!passed) {
            log('It did not pass the test, not dispatching event');
            return false;
            // Or, we may open a new widnow with window.open to save a reference and do additional checks.
        }
    }
    return _dispatchEvent.call(this, evt);
};

if (typeof EventTarget == 'undefined') { Node.prototype.dispatchEvent = dispatchVerifiedEvent; }
else { EventTarget.prototype.dispatchEvent = dispatchVerifiedEvent; }

// Overides HTMLElement.prototype.click
var _click = HTMLElement.prototype.click;
HTMLElement.prototype.click = function() {
    if (this instanceof HTMLAnchorElement) {
        log('click() was called on an anchor tag');
        var passed = verifyEvent(retrieveEvent());
        if (!passed) {
            log('It did not pass the test, not clicking element');
            return;
        }
    }
    _click.call(this);
};

/************************************************************************************/
// Overrides Event prototype methods to enable debugging.
var _stopPropagation = Event.prototype.stopPropagation;
// @ifdef DEBUG
Event.prototype.stopPropagation = function() {
    log('stopPropagation', this);
    log('target is:', this.target);
    log('currentTarget is:', this.currentTarget);
    _stopPropagation.call(this);
};
// @endif

var _preventDefault = Event.prototype.preventDefault;
// @ifdef DEBUG
Event.prototype.preventDefault = function() {
    log('preventDefault', this);
    if ( !verifyEvent(this) && this.eventPhase == Event.CAPTURING_PHASE ) {    
        log('A preventDefault call is blocked.');
        return;
    }
    _preventDefault.call(this);
};
// @endif

/************************************************************************************/
// Override HTMLIFrameElement.prototype.contentWindow.
var getContentWindow = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow').get;
var getContentDocument = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentDocument').get;
var applyOnIframe = function (iframe) {
    if (iframe.hasOwnProperty(PROP)) { return; }
    // @ifdef DEBUG
    // Prevent infinite loop when console.log on certain browsers inquires contentWindow to display iframes in console
    if (iframe.hasOwnProperty('__DEBUG__')) { return; }
    else { iframe['__DEBUG__'] = undefined; }
    // @endif
    try {
        log('An iframe called the contentWindow/Document getter for the first time, applying popupBlocker..', iframe);
        getContentWindow.call(iframe).eval('(new ' + PopupBlocker.toString() + ')(window);');
    } catch(e) {
        log('Applying popupBlocker to an iframe failed, due to an error:', e);
    } finally {
        Object.defineProperty(iframe, PROP, { value: undefined });
        // @ifdef DEBUG
        delete iframe['__DEBUG__'];
        // @endif
    }
};
Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', {
    get: function() {
        applyOnIframe(this);
        return getContentWindow.call(this);
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(HTMLIFrameElement.prototype, 'contentDocument', {
    get: function() {
        applyOnIframe(this);
        return getContentDocument.call(this);
    },
    enumerable: true,
    configurable: true
});

/************************************************************************************/
/**
 * Logger
 * @param {string} str A string to display in the console.
 * @param {*=} obj An object to display in the console.
 */
var log = function (str, obj) {
    // @ifdef DEBUG
    var date = (new Date).toISOString();
    console.log('[' + date + ']: ' + str);
    if ( obj !== undefined ) {
        console.log('=============================');
        console.log(obj);
        console.log('=============================');
    }
    // @endif
};
/************************************************************************************/

this.retrieveEvent = retrieveEvent;
this.verifyEvent = verifyEvent;
this.dispatchIfBlockedByMask = dispatchIfBlockedByMask;
this.maybeOverlay = maybeOverlay;

};

/**
 * In Firefox, userscripts can't write properties of unsafeWindow, so we create a <script> tag
 * to run the script in the page's context.
 */
if (typeof InstallTrigger !== 'undefined') {
    // Firefox
    var script = document.createElement('script');
    script.textContent = '(new ' + PopupBlocker.toString() + ')(window);';
    var el = document.body || document.head || document.documentElement;
    el.appendChild(script);
    el.removeChild(script);
} else {
    var popupBlocker = new PopupBlocker(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
}
