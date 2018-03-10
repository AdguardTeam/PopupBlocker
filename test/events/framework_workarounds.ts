import { JQueryEventStack } from '../../src/events/framework_workarounds';

// JQueryEventStack is initialized in the module.

const expect = chai.expect;

declare const $:any; // jQuery
declare const jQuery:any;

describe('JQueryEventStack', async function() {
    // Setup tests
    const JQueryTestRoot:Element = window['JQueryTestRoot'];

    const jQueryVersions = [
        { version: '3.3.1', url: 'https://code.jquery.com/jquery-3.3.1.min.js' },
        { version: '2.2.4', url: 'https://code.jquery.com/jquery-2.2.4.min.js' },
        { version: '1.12.4', url: 'https://code.jquery.com/jquery-1.12.4.min.js' }
    ];

    const tests = [];

    let prev = Promise.resolve();

    // Test for the lastly loaded jQuery, then test for the previous one by executing
    // $.noConflict(true), and so on.
    for (let jQuery of jQueryVersions) {
        tests.push(prev = testOnJQuery(jQuery, prev));
    }

    document.body.click(); // So that JQueryEventStack patches the initial jQuery.

    // Run tests
    await Promise.all(tests);

    // Test implementations
    async function testOnJQuery(jQuery:{version:string, url:string}, prev:Promise<void>) {
        return new Promise<void>((resolve, reject) => {
            describe(`jQuery ${jQuery.version}`, function() {

                before(function(done) {
                    this.timeout(10000);
                    // Run tests after `prev` test ends.
                    prev.then(() => {
                        // Check that the jQuery currently loaded has the expected version.
                        expect($.fn.jquery).to.equal(jQuery.version);
                        done();
                    });
                });

                it(`detects simple target in ${jQuery.version}`, function(done) {
                    $('#JQueryTestRoot').one('click', function(evt) {
                        let expected = JQueryTestRoot;
                        let got = JQueryEventStack.getCurrentJQueryTarget(<MouseEvent>window.event);

                        expect(got).to.equal(expected);
                        done();
                    });

                    $('#JQueryTestRoot').click();
                });

                it(`detects delegated target in ${jQuery.version}`, function(done) {
                    $(document).one('click', '#JQueryTestRoot', function (evt) {
                        let expected = JQueryTestRoot;
                        let got = JQueryEventStack.getCurrentJQueryTarget(<MouseEvent>window.event);

                        expect(got).to.equal(expected);
                        done();
                    });

                    $('#JQueryTestRoot').click();
                });

                it(`detects nested delegated target in ${jQuery.version}`, function(done) {
                    $(document).one('click', function (evt) {
                        let target = evt.target;
                        $(target).trigger('CustomClick_1');
                    });
                    $(document).one('CustomClick_1', 'body', function(evt) {
                        let target = evt.target;
                        $(target).trigger('CustomClick_2');
                    });
                    $('#JQueryTestRoot').one('CustomClick_2', function(evt) {
                        let expected = JQueryTestRoot;
                        let got = JQueryEventStack.getCurrentJQueryTarget(<MouseEvent>window.event);

                        expect(got).to.equal(expected);
                        done();
                    });

                    $('#JQueryTestRoot').click();
                });

                it(`ignores jumps in delgated targets ${jQuery.version}`, function(done) {
                    $(document).one('click', function(evt) {
                        let target = evt.target;
                        $(target).trigger('CustomClick_1');
                    });
                    $(document).one('CustomClick_1', 'body', function(evt) {
                        let target = evt.target;
                        $(target).trigger('CustomClick_2');
                    });
                    $('#JQueryTestRoot').one('CustomClick_2', function(evt) {
                        let target = evt.target;
                        $('head').trigger('CustomClick_3');
                    });
                    $('head').one('CustomClick_3', function(evt) {
                        let expected = JQueryTestRoot;
                        let got = JQueryEventStack.getCurrentJQueryTarget(<MouseEvent>window.event);

                        expect(got).to.equal(expected);
                        done();
                    });

                    $('#JQueryTestRoot').click();
                });

                after(function() {
                    $.noConflict(true); // Expose the previously-loaded jQuery to the global scope 
                                        // for the next test. 
                    resolve();
                });

            });
        });
    }
});
