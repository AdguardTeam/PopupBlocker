import { timeline } from '../../src/timeline/Timeline';
import { TLEventType } from '../../src/timeline/TimelineEvent';

const { expect } = chai;
describe('Timeline', () => {
    it('records must be empty when it is first created', () => {
        const records = timeline.takeRecords();
        expect(records.length).to.equal(0);
    });
    it('should log when Timeline#onNewFrame is called first', () => {
        timeline.onNewFrame(window);
        const firstEvent = timeline.takeRecords()[0][0];
        expect(firstEvent.$type).to.equal(TLEventType.CREATE);
    });
});
