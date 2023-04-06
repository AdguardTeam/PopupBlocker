import React from 'preact';
import { ScriptManagerUrl } from '../../constants';
import { getOwnScriptManagerName } from '../../utils/helpers';

export const ScriptManagerItems: React.FunctionalComponent = () => (
    <>
        {Object.keys(ScriptManagerUrl)
            .map((manager) => (
                <li class="settings__list-item" key={manager}>
                    <a
                        target="_blank"
                        href={ScriptManagerUrl[manager]}
                        class="settings__list-link"
                        rel="noreferrer"
                    >
                        {getOwnScriptManagerName(manager)}
                    </a>
                </li>
            ))}
    </>
);
