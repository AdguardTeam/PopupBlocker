import { JQueryEventStack } from '../../src/events/framework-workarounds';

// JQueryEventStack is initialized in the module.

const { expect } = chai;

declare const $: any; // jQuery

describe('JQueryEventStack', async () => {
    // Setup tests
    // @ts-ignore
    const { JQueryTestRoot } = window;

    // Test implementations
    async function testOnJQuery(jQuery:{ version:string, url:string }, prev:Promise<void>) {
        return new Promise<void>((resolve) => {
            describe(`jQuery ${jQuery.version}`, () => {
                function checkVersions(done) {
                    this.timeout(10000);
                    // Run tests after `prev` test ends.
                    prev.then(() => {
                        // Check that the jQuery currently loaded has the expected version.
                        expect($.fn.jquery).to.equal(jQuery.version);
                        done();
                    });
                }

                before(checkVersions);

                it(`detects simple target in ${jQuery.version}`, (done) => {
                    $('#JQueryTestRoot').one('click', () => {
                        const expected = JQueryTestRoot;
                        const got = JQueryEventStack.getCurrentJQueryTarget(<MouseEvent>window.event);

                        expect(got).to.equal(expected);
                        done();
                    });

                    $('#JQueryTestRoot').click();
                });

                it(`detects delegated target in ${jQuery.version}`, (done) => {
                    $(document).one('click', '#JQueryTestRoot', () => {
                        const expected = JQueryTestRoot;
                        const got = JQueryEventStack.getCurrentJQueryTarget(<MouseEvent>window.event);

                        expect(got).to.equal(expected);
                        done();
                    });

                    $('#JQueryTestRoot').click();
                });

                it(`detects nested delegated target in ${jQuery.version}`, (done) => {
                    $(document).one('click', (evt) => {
                        const { target } = evt;
                        $(target).trigger('CustomClick_1');
                    });
                    $(document).one('CustomClick_1', 'body', (evt) => {
                        const { target } = evt;
                        $(target).trigger('CustomClick_2');
                    });
                    $('#JQueryTestRoot').one('CustomClick_2', () => {
                        const expected = JQueryTestRoot;
                        const got = JQueryEventStack.getCurrentJQueryTarget(<MouseEvent>window.event);

                        expect(got).to.equal(expected);
                        done();
                    });

                    $('#JQueryTestRoot').click();
                });

                it(`ignores jumps in delgated targets ${jQuery.version}`, (done) => {
                    $(document).one('click', (evt) => {
                        const { target } = evt;
                        $(target).trigger('CustomClick_1');
                    });
                    $(document).one('CustomClick_1', 'body', (evt) => {
                        const { target } = evt;
                        $(target).trigger('CustomClick_2');
                    });
                    $('#JQueryTestRoot').one('CustomClick_2', () => {
                        $('head').trigger('CustomClick_3');
                    });
                    $('head').one('CustomClick_3', () => {
                        const expected = JQueryTestRoot;
                        const got = JQueryEventStack.getCurrentJQueryTarget(<MouseEvent>window.event);

                        expect(got).to.equal(expected);
                        done();
                    });

                    $('#JQueryTestRoot').click();
                });

                it(`works in a nested dispatch task ${jQuery.version}`, (done) => {
                    $(document).one('click', '#JQueryTestRoot', (evt) => {
                        $(document).one('click', '#JQueryTestRoot', () => {
                            const expected = JQueryTestRoot;
                            const got = JQueryEventStack.getCurrentJQueryTarget(<MouseEvent>window.event);
                            expect(got).to.equal(expected);
                            done();
                        });
                        const { target } = evt;
                        target.click();
                    });
                });

                after(() => {
                    $.noConflict(true); // Expose the previously-loaded jQuery to the global scope
                    // for the next test.
                    resolve();
                });
            });
        });
    }

    const jQueryVersions = [
        { version: '3.3.1', url: 'https://code.jquery.com/jquery-3.3.1.min.js' },
        { version: '2.2.4', url: 'https://code.jquery.com/jquery-2.2.4.min.js' },
        { version: '1.12.4', url: 'https://code.jquery.com/jquery-1.12.4.min.js' },
    ];

    const tests = [];

    let prev = Promise.resolve();

    // Test for the lastly loaded jQuery, then test for the previous one by executing
    // $.noConflict(true), and so on.
    // eslint-disable-next-line no-restricted-syntax
    for (const jQuery of jQueryVersions) {
        // @ts-ignore
        tests.push(prev = testOnJQuery(jQuery, prev));
    }

    document.body.click(); // So that JQueryEventStack patches the initial jQuery.

    // Run tests
    await Promise.all(tests);
});
