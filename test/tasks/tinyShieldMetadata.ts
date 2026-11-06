import { extractTinyShieldMetadata } from '../../tasks/tinyShieldMetadata';

const { expect } = chai;

describe('extractTinyShieldMetadata', () => {
    it('returns the version and all match entries from valid metadata', () => {
        const metadata = [
            '// @version 1.3.17',
            '// @match https://example.test/*',
            '// @match https://*.example.test/*',
        ].join('\n');

        expect(extractTinyShieldMetadata(metadata)).to.deep.equal({
            version: '1.3.17',
            matchedWebsites: [
                'https://example.test/*',
                'https://*.example.test/*',
            ],
        });
    });

    it('rejects metadata without a version', () => {
        expect(() => extractTinyShieldMetadata('// @match https://example.test/*')).to.throw(
            'TinyShield metadata must include a version and at least one non-empty @match.',
        );
    });

    it('rejects metadata without any match entries', () => {
        expect(() => extractTinyShieldMetadata('// @version 1.3.17')).to.throw(
            'TinyShield metadata must include a version and at least one non-empty @match.',
        );
    });

    it('rejects empty match entries', () => {
        expect(() => extractTinyShieldMetadata('// @version 1.3.17\n// @match ')).to.throw(
            'TinyShield metadata must include a version and at least one non-empty @match.',
        );
    });
});
