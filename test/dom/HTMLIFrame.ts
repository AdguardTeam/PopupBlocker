import '../../src/dom/HTMLIFrame';
import { timeline } from '../../src/timeline/index';
import { TLEventType } from '../../src/timeline/event';

const expect = chai.expect;

describe('HTMLIFrameElement#src', function() {
    it('should log when an iframe\'s contentDocument property is accessed', function() {
        let ifr = document.createElement('iframe');
        ifr.style.cssText = 'display:none;';
        document.body.appendChild(ifr);
        if (!('location' in ifr.contentDocument)) { throw new Error(); }
        let records = timeline.takeRecords()[0];
        let lastEvent = records[records.length - 1];
        document.body.removeChild(ifr);
        expect(lastEvent.$type).to.equal(TLEventType.GET);
    });
});
