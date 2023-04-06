import { useState } from 'preact/hooks';
import {
    LoadingSubtitle,
    Options,
    NotInstalled,
    Footer,
} from './components';
import { translator } from '../../i18n';
import { useDetectUserscript } from './hooks';
import { AppState } from './constants';
import '../common/styles/options.pcss';

export const App = () => {
    const [state, setState] = useState(AppState.Detecting);

    useDetectUserscript(setState);

    return (
        <>
            <div class="settings">
                <div class="settings__in">
                    <div class="settings__title">
                        {translator.getMessage('userscript_name')}
                    </div>
                    {state === AppState.Detecting && <LoadingSubtitle />}
                    {state === AppState.NotInstalled && <NotInstalled />}
                    {state === AppState.Installed && <Options />}
                </div>
                <Footer />
            </div>
            <div id="portal" />
        </>
    );
};
