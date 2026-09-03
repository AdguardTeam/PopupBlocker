import { JQueryEventStack } from '../../src/events/framework-workarounds';

// JQueryEventStack is initialized in the module.

const { expect } = chai;

declare const $: any; // jQuery

// The harness loads jQuery 1.12.4, 2.2.4 and 3.3.1 in that order, so `$` starts out as 3.3.1
// and `$.noConflict(true)` hands the global back to the previously loaded version.
// The builds live in `test/third-party` and are the official minified releases:
//  - https://code.jquery.com/jquery-3.3.1.min.js
//  - https://code.jquery.com/jquery-2.2.4.min.js
//  - https://code.jquery.com/jquery-1.12.4.min.js
const JQUERY_VERSIONS = ['3.3.1', '2.2.4', '1.12.4'];

const TEST_ROOT_ID = 'JQueryTestRoot';

/**
 * Looks the test root up at test time; the harness adds it to the page after the test bundle runs.
 *
 * @returns the element the clicks are dispatched on
 */
const getTestRoot = (): HTMLElement | null => document.getElementById(TEST_ROOT_ID);

/**
 * Dispatches a native click on the test root, the way a user's click reaches jQuery.
 *
 * jQuery's own `.click()` would only run the handlers synthetically, outside of any native
 * dispatch, so `window.event` would be empty and JQueryEventStack would have nothing to map.
 */
const clickTestRoot = (): void => {
    getTestRoot()?.click();
};

/**
 * Fires a native mousedown, which is what makes JQueryEventStack patch the jQuery instance
 * currently exposed on `window`.
 */
const patchCurrentJQuery = (): void => {
    const evt = document.createEvent('MouseEvents');
    evt.initMouseEvent('mousedown', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    document.body.dispatchEvent(evt);
};

/**
 * Asks JQueryEventStack for the intended target of the event being dispatched right now.
 *
 * @returns the detected target
 */
const getCurrentTarget = (): EventTarget => JQueryEventStack.getCurrentJQueryTarget(<MouseEvent>window.event);

describe('JQueryEventStack', () => {
    before(patchCurrentJQuery);

    JQUERY_VERSIONS.forEach((version) => {
        describe(`jQuery ${version}`, () => {
            before(() => {
                // Pop the newer versions off the global scope until this suite's one is exposed.
                // Done here rather than in an `after` hook so that a suite also works on its own,
                // e.g. when opened through Mocha's `?grep=`. `noConflict` is wrapped by
                // JQueryEventStack, so each newly exposed instance gets patched along the way.
                while (typeof $ !== 'undefined' && $.fn.jquery !== version) {
                    $.noConflict(true);
                }
                expect($.fn.jquery).to.equal(version);
            });

            it(`detects simple target in ${version}`, () => {
                let got: EventTarget;
                $(`#${TEST_ROOT_ID}`).one('click', () => {
                    got = getCurrentTarget();
                });

                clickTestRoot();

                expect(got).to.equal(getTestRoot());
            });

            it(`detects delegated target in ${version}`, () => {
                let got: EventTarget;
                $(document).one('click', `#${TEST_ROOT_ID}`, () => {
                    got = getCurrentTarget();
                });

                clickTestRoot();

                expect(got).to.equal(getTestRoot());
            });

            it(`detects nested delegated target in ${version}`, () => {
                let got: EventTarget;
                $(document).one('click', (evt) => {
                    $(evt.target).trigger('CustomClick_1');
                });
                $(document).one('CustomClick_1', 'body', (evt) => {
                    $(evt.target).trigger('CustomClick_2');
                });
                $(`#${TEST_ROOT_ID}`).one('CustomClick_2', () => {
                    got = getCurrentTarget();
                });

                clickTestRoot();

                expect(got).to.equal(getTestRoot());
            });

            it(`ignores jumps in delegated targets in ${version}`, () => {
                let got: EventTarget;
                $(document).one('click', (evt) => {
                    $(evt.target).trigger('CustomClick_1');
                });
                $(document).one('CustomClick_1', 'body', (evt) => {
                    $(evt.target).trigger('CustomClick_2');
                });
                $(`#${TEST_ROOT_ID}`).one('CustomClick_2', () => {
                    $('head').trigger('CustomClick_3');
                });
                $('head').one('CustomClick_3', () => {
                    got = getCurrentTarget();
                });

                clickTestRoot();

                expect(got).to.equal(getTestRoot());
            });

            it(`works in a nested dispatch task in ${version}`, () => {
                let got: EventTarget;
                $(document).one('click', `#${TEST_ROOT_ID}`, (evt) => {
                    $(document).one('click', `#${TEST_ROOT_ID}`, () => {
                        got = getCurrentTarget();
                    });
                    evt.target.click();
                });

                // Start from jQuery's synthetic trigger here: a native `click()` sets the element's
                // "click in progress" flag, which would make the nested `click()` above a no-op.
                $(`#${TEST_ROOT_ID}`).click();

                expect(got).to.equal(getTestRoot());
            });
        });
    });
});
