/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

import { timeline, TLEventType } from '../../src/timeline';

const expect = chai.expect;
describe('Timeline', function() {
    it('should log when it is first created', function() {
        let records = timeline.takeRecords();
        let firstEvent = timeline.takeRecords()[0][0];
        expect(firstEvent.type).to.equal(TLEventType.CREATE);
    });
});
