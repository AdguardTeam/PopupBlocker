import '../mocks/gm-api';
import { themeOption } from '../../src/storage/ThemeOption';
import { gmWrapper } from '../../src/storage/GMWrapper';
import { StorageKey } from '../../src/storage/storage-key';
import { Theme } from '../../src/theme';

const { expect } = chai;

describe('ThemeOption', () => {
    afterEach(window.GM_clearStorage);

    it('reports no choice when the key has never been written', () => {
        expect(gmWrapper.listValues()).to.not.include(StorageKey.Theme);
        expect(themeOption.getStored()).to.equal(null);
    });

    it('treats an empty stored value as "follow the OS"', () => {
        gmWrapper.setValue(StorageKey.Theme, '');
        expect(themeOption.getStored()).to.equal(null);
    });

    it('reads back an explicit choice', () => {
        themeOption.setStored(Theme.Dark);
        expect(themeOption.getStored()).to.equal(Theme.Dark);

        themeOption.setStored(Theme.Light);
        expect(themeOption.getStored()).to.equal(Theme.Light);
    });

    it('stores the choice under the theme key as a plain string', () => {
        themeOption.setStored(Theme.Dark);
        expect(gmWrapper.getValue(StorageKey.Theme)).to.equal('dark');
    });

    it('ignores values in storage that are not a theme', () => {
        gmWrapper.setValue(StorageKey.Theme, 'blue');
        expect(themeOption.getStored()).to.equal(null);

        gmWrapper.setValue(StorageKey.Theme, 42);
        expect(themeOption.getStored()).to.equal(null);
    });
});
