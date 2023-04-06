import { createUrl } from '../../src/shared';

const { expect } = chai;

describe('createUrl', () => {
    it('returns a domain part only for usual urls', () => {
        const url = 'https://subdomain.domain.com/some/path/and?query=param#and#hash';
        const [displayUrl, canonicalUrl] = createUrl(url);
        expect(displayUrl).to.equal('subdomain.domain.com/some/path/and?query=param#and#hash');
        expect(canonicalUrl).to.equal('subdomain.domain.com');
    });

    it('includes protocol too for non-http, https url schemes', () => {
        const url1 = 'about:blank';
        let [displayUrl, canonicalUrl] = createUrl(url1);
        expect(displayUrl).to.equal('about:blank');
        expect(canonicalUrl).to.equal('about:blank');
        const url2 = 'data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E';
        [displayUrl, canonicalUrl] = createUrl(url2);
        expect(displayUrl).to.equal('data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E');
        expect(canonicalUrl).to.equal('data:text/html');
    });
});
