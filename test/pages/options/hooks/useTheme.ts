import { h, render } from 'preact';
import { act } from 'preact/test-utils';
import { useTheme } from '../../../../src/pages/options/hooks/useTheme';
import { AppState } from '../../../../src/pages/options/constants';
import { ThemeOptionInterface } from '../../../../src/storage/ThemeOption';
import {
    oppositeTheme,
    Theme,
    THEME_MIRROR_KEY,
} from '../../../../src/theme';
import { THEME_ATTR } from '../../../../src/theme/constants';
import { OPTIONS_API_PROP, THEME_OPTION_PROP } from '../../../../src/shared/constants';

const { expect } = chai;

describe('useTheme', () => {
    let container: HTMLElement;
    let result: ReturnType<typeof useTheme>;

    const Probe = ({ appState }: { appState: AppState }) => {
        result = useTheme(appState);
        return null;
    };

    const renderWith = (appState: AppState) => act(() => {
        render(h(Probe, { appState }), container);
    });

    const toggle = () => act(() => {
        result[1]();
    });

    /**
     * Stands in for the theme option the userscript exposes on the options page.
     *
     * @param stored what the userscript storage holds to begin with
     * @returns the fake, so that tests can inspect what was written to it
     */
    const installFakeApi = (stored: Theme | null): ThemeOptionInterface => {
        let value = stored;
        const themeOption: ThemeOptionInterface = {
            getStored: () => value,
            setStored: (theme) => {
                value = theme;
            },
        };
        (window as any)[OPTIONS_API_PROP] = { [THEME_OPTION_PROP]: themeOption };
        return themeOption;
    };

    const readMirror = () => window.localStorage.getItem(THEME_MIRROR_KEY);

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        window.localStorage.removeItem(THEME_MIRROR_KEY);
    });

    afterEach(async () => {
        await act(() => {
            render(null, container);
        });
        container.remove();
        delete (window as any)[OPTIONS_API_PROP];
        window.localStorage.removeItem(THEME_MIRROR_KEY);
        document.documentElement.removeAttribute(THEME_ATTR);
    });

    it('hands a choice made before the userscript api appears over instead of reverting it', async () => {
        await renderWith(AppState.Detecting);
        const [initial] = result;
        const chosen = oppositeTheme(initial);

        await toggle();
        expect(result[0]).to.equal(chosen);
        expect(readMirror()).to.equal(chosen);

        // The api shows up holding the choice from an earlier session
        const themeOption = installFakeApi(initial);
        await renderWith(AppState.Installed);

        expect(themeOption.getStored()).to.equal(chosen);
        expect(result[0]).to.equal(chosen);
        expect(readMirror()).to.equal(chosen);
    });

    it('takes the userscript choice over when this page made none', async () => {
        const themeOption = installFakeApi(Theme.Dark);
        await renderWith(AppState.Detecting);
        await renderWith(AppState.Installed);

        expect(result[0]).to.equal(Theme.Dark);
        expect(readMirror()).to.equal(Theme.Dark);
        expect(themeOption.getStored()).to.equal(Theme.Dark);
    });

    it('hands a choice made before the userscript was installed over', async () => {
        window.localStorage.setItem(THEME_MIRROR_KEY, Theme.Dark);
        const themeOption = installFakeApi(null);
        await renderWith(AppState.Installed);

        expect(themeOption.getStored()).to.equal(Theme.Dark);
        expect(result[0]).to.equal(Theme.Dark);
    });

    it('writes a toggle straight to the userscript once the api is there', async () => {
        const themeOption = installFakeApi(null);
        await renderWith(AppState.Installed);
        const chosen = oppositeTheme(result[0]);

        await toggle();

        expect(themeOption.getStored()).to.equal(chosen);
        expect(readMirror()).to.equal(chosen);
    });
});
