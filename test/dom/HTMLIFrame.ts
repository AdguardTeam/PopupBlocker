/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

import '../../src/dom/HTMLIFrame';
import { timeline } from '../../src/timeline';
import { TLEventType } from '../../src/timeline/event';

const expect = chai.expect;

describe('HTMLIFrameElement#src', function() {
    it('should log when an iframe\'s src attribute changes', function() {
        let ifr = document.createElement('iframe');
        ifr.style.cssText = 'display:none;';
        document.body.appendChild(ifr);
        ifr.src = 'about:blank';
        let records = timeline.takeRecords()[0];
        console.log(records);
        let lastEvent = records[records.length - 1];
        document.body.removeChild(ifr);
        expect(lastEvent.type).to.equal(TLEventType.SET);
    });
});
