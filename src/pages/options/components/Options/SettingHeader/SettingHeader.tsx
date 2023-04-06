import React from 'preact';
import { Tooltip } from '../Tooltip';

type SettingHeaderProps = {
    messages: Record<string, string>,
    showModal: ()=>void,
};

export const SettingHeader: React.FunctionalComponent<SettingHeaderProps> = ({
    messages,
    showModal,
}) => {
    const {
        subtitle,
        tooltip,
        controlItem,
        emptyRow,
    } = messages;

    return (
        <div class="settings__row">
            <div class="tooltip-container">
                <div class="settings__subtitle">
                    {subtitle}
                </div>
                <Tooltip tooltip={tooltip} />
            </div>
            <div class="settings__control">
                <button
                    class="settings__control-item"
                    onClick={showModal}
                >
                    {controlItem}
                </button>
            </div>
            <div class="settings__row-empty">
                {emptyRow}
            </div>
        </div>
    );
};
