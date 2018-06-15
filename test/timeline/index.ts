/// <reference path="../../node_modules/@types/mocha/index.d.ts"/>
/// <reference path="../../node_modules/@types/chai/index.d.ts"/>

import { timeline } from '../../src/timeline/index';
import { TLEventType } from '../../src/timeline/event';

const expect = chai.expect;
describe('Timeline', function() {
    it('records must be empty when it is first created', function() {
        let records = timeline.takeRecords();
        expect(records.length).to.equal(0);
    })
    it('should log when Timeline#onNewFrame is called first', function() {
        timeline.onNewFrame(window);
        let firstEvent = timeline.takeRecords()[0][0];
        expect(firstEvent.$type).to.equal(TLEventType.CREATE);
    });
});
