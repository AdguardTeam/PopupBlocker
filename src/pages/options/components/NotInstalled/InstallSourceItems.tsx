import React from 'preact';
import { InstallSource } from '../../constants';
import { preactTranslator } from '../../../../i18n';

export const InstallSourceItems:React.FunctionalComponent = () => (
    <>
        {Object.keys(InstallSource)
            .map((source) => (
                <li class="settings__list-item" key={source}>
                    {preactTranslator.getMessage('installFrom', {
                        name: source,
                        a: (chunk: string) => (
                            <a
                                target="_blank"
                                href={InstallSource[source]}
                                class="settings__list-link"
                                rel="noreferrer"
                            >
                                {chunk}
                            </a>
                        ),
                    })}
                </li>
            ))}
    </>
);
