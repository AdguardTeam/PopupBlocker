import React from 'preact';
import { SettingBlock } from './SettingBlock';
import { translator } from '../../../../i18n';
import { OptionName } from '../../constants';
import { OPTIONS_API_PROP } from '../../../../shared/constants';

export const Options: React.FunctionalComponent = () => (
    <>
        <SettingBlock
            messages={{
                subtitle: translator.getMessage('silenced'),
                tooltip: translator.getMessage('silenced_tooltip'),
                controlItem: translator.getMessage('add'),
                emptyRow: translator.getMessage('silenced_empty'),
            }}
            option={window[OPTIONS_API_PROP][OptionName.Allowed]}
        />
        <SettingBlock
            messages={{
                subtitle: translator.getMessage('allowed'),
                tooltip: translator.getMessage('allowed_tooltip'),
                controlItem: translator.getMessage('add'),
                emptyRow: translator.getMessage('allowed_empty'),
            }}
            option={window[OPTIONS_API_PROP][OptionName.Silenced]}
        />
    </>
);
