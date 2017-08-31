import { SupportedLocales, parseMessage } from '../../src/ui/localization';
import translate from '../../src/ui/localization';

const expect = chai.expect;

describe('Localization', function() {

    describe('parseMessage', function(){
        const context = {
            "key1": "value1",
            "key2": "value2"
        };

        it('preserves plain texts', function() {
            const input = 'This is a plain text';
            const parsed = parseMessage(input, context);
            expect(parsed).to.eql(['This is a plain text']);
        });

        it('replaces string references of a form ${...}', function() {
            const input = '${key1}';
            const parsed = parseMessage(input, context);
            expect(parsed).to.eql(['value1']);
        });

        it('parses html node references {{0}}, {{1}}, ... to a single-digit number', function() {
            const input = '{{4}}{{0}}{{3}}{{1}}{{2}}';
            const parsed = parseMessage(input, context);
            expect(parsed).to.eql([4, 0, 3, 1, 2]);
        });

        it('parses the node index from the first character of node references', function() {
            const input = '{{0:a node}}{{1_another_node}}{{2%YetAnotherNode%}}';
            const parsed = parseMessage(input, context);
            expect(parsed).to.eql([0,1,2]);
        });

        it('concatenates string references with plain texts', function() {
            const input = 'The string ${key1} is a value of key1';
            const parsed = parseMessage(input, context);
            expect(parsed).to.eql(['The string value1 is a value of key1']);
        });

        it('parses a reference to an html node as a separate array element', function() {
            const input = 'There are {{1_some}} {{0_links}} in the middle of a text';
            const parsed = parseMessage(input, context);
            expect(parsed).to.eql(['There are ', 1, ' ', 0, ' in the middle of a text']);
        });

        it('parses a combination of html node references and string references', function() {
            const input = 'a${key2}b{{2}}c${key1}{{1}}d{{0}}';
            const parsed = parseMessage(input, context);
            expect(parsed).to.eql(['avalue2b', 2, 'cvalue1', 1, 'd', 0]);
        });
    });

    describe('translate', function() {
        const context = {
            "key1": "value1",
            "key2": "value2"
        };

        SupportedLocales["en"] = <any>{
            'phrase1': {
                'message': 'a{{2}}b{{1}}c{{0}}'
            },
            'phrase2': {
                'message': 'd{{1}}e{{0}}f'
            },
            'phrase3': {
                'message': 'g${key1}{{2}}h{{0}}${key2}i{{1}}'
            }
        };
        
        it('transforms html as expected', function() {
            const logPerf = 'now' in performance;
            const before = logPerf ? performance.now() : 0;
            translate(translateTestRoot, context);
            const after = logPerf ? performance.now() : 0;
            console.log(`translate call ended in ${after-before} milliseconds.`);
            
            /***************************************************************************

                Initial html:                       Expected html after translation:

                <div id="translateTestRoot">        <div id="translateTestRoot">
                    <!--i18n:phrase1-->                 a
                    <div id='0'>                        <div id='2'></div>
                        <div id='0-0'></div>            b
                        <!--i18n:phrase2-->             <div id='1'></div>
                        <div id='0-1'></div>            c
                        <div id='0-2'></div>            <div id='0'>
                    </div>                                  <div id='0-0'></div>
                    <div id='1'></div>                      d
                    <div id='2'></div>                      <div id='0-2'></div>
                    <!--i18n:phrase3-->                     e
                    <div id='3'></div>                      <div id='0-1'></div>
                    <div id='4'></div>                      f
                    <div id='5'></div>                  </div>
                </div>                                  gvalue1
                                                        <div id='5'></div>
                                                        h
                                                        <div id='3'></div>
                                                        value2i
                                                        <div id='4'></div>
                                                    </div>

            **/
            
            const filter = (el) => {
                if (el.nodeType === Node.TEXT_NODE && el.nodeValue.trim().length === 0) { return NodeFilter.FILTER_SKIP; }
                return NodeFilter.FILTER_ACCEPT;
            };

            const iterator = document.createNodeIterator(translateTestRoot, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, <NodeFilter>('documentMode' in document ? filter : { acceptNode: filter }), false); // IE accepts a different type of `NodeFilter` arguments.
            let current:Node;
            const res = [];
            while(current = iterator.nextNode()) {
                switch(current.nodeType) {
                    case Node.TEXT_NODE:
                    res.push(current.nodeValue.trim());
                    break;
                    case Node.ELEMENT_NODE:
                    res.push(current['id']);
                }
            }
            expect(res).to.eql('translateTestRoot,a,2,b,1,c,0,0-0,d,0-2,e,0-1,f,gvalue1,5,h,3,value2i,4'.split(','));
        })
    })
});

declare const translateTestRoot:Element;
