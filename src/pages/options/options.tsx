import React, { render } from 'preact';
import { i18n, translator } from '../../i18n';
import { App } from './App';
import { applyStoredTheme, readThemeMirror } from '../../theme';

const DEFAULT_PAGE_TITLE = 'AdGuard Popup Blocker';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = document.getElementById('root')!;

document.documentElement.lang = i18n.getUILanguage();
document.title = translator.getMessage('userscript_name') || DEFAULT_PAGE_TITLE;

// Pin a stored choice before the first paint, otherwise one that disagrees with the OS
// setting shows up as a flash of the wrong theme. With nothing stored the attribute stays
// off and the stylesheets follow the OS themselves, so there is nothing to flash.
applyStoredTheme(document, readThemeMirror());

render(<App />, root);
