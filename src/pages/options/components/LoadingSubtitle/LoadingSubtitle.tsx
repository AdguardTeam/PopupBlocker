import React from 'preact';
import { preactTranslator } from '../../../../i18n';

export const LoadingSubtitle: React.FunctionalComponent = () => (
    <div class="settings__subtitle settings__subtitle--margin">
        {preactTranslator.getMessage('please_wait')}
    </div>
);
