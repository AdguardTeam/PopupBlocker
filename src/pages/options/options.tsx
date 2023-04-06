import React, { render } from 'preact';
import { i18n, translator } from '../../i18n';
import { App } from './App';

const DEFAULT_PAGE_TITLE = 'AdGuard Popup Blocker';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = document.getElementById('root')!;

document.documentElement.lang = i18n.getUILanguage();
document.title = translator.getMessage('userscript_name') || DEFAULT_PAGE_TITLE;

render(<App />, root);
