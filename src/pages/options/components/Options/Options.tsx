import React from 'preact';
import { SettingBlock } from './SettingBlock';
import { translator } from '../../../../i18n';
import { OptionName } from '../../constants';
import { OPTIONS_API_PROP } from '../../../../shared/constants';

export const Options: React.FunctionalComponent = () => {
    const optionsApi = window[OPTIONS_API_PROP];

    // Only rendered once the userscript has been detected, so this is defensive:
    // the api may still go missing if the userscript is disabled mid-session
    if (!optionsApi) {
        return null;
    }

    return (
        <>
            <SettingBlock
                messages={{
                    subtitle: translator.getMessage('silenced'),
                    tooltip: translator.getMessage('silenced_tooltip'),
                    controlItem: translator.getMessage('add'),
                    emptyRow: translator.getMessage('silenced_empty'),
                }}
                option={optionsApi[OptionName.Silenced]}
            />
            <SettingBlock
                messages={{
                    subtitle: translator.getMessage('allowed'),
                    tooltip: translator.getMessage('allowed_tooltip'),
                    controlItem: translator.getMessage('add'),
                    emptyRow: translator.getMessage('allowed_empty'),
                }}
                option={optionsApi[OptionName.Allowed]}
            />
        </>
    );
};
