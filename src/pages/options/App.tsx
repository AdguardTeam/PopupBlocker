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

type Channel = 'dev' | 'release' | 'beta';

export const App = () => {
    const [state, setState] = useState(AppState.Detecting);

    useDetectUserscript(setState);

    // This is a placeholder for the channel value from the rollup replace plugin.
    const channel = '__channel__' as Channel;

    let title = translator.getMessage('userscript_name');

    if (channel !== 'release') {
        // Capitalize the first letter of the channel name.
        title += ` ${channel[0].toUpperCase() + channel.slice(1)}`;
    }

    return (
        <>
            <div class="settings">
                <div class="settings__in">
                    <div class="settings__title">
                        {title}
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
