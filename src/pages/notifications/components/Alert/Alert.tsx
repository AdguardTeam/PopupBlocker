import React from 'preact';
import { preactTranslator } from '../../../../i18n';
import { GlobalStyleProp } from '../../../common/constants';
import '../../../common/styles/alerts.pcss';

type AlertProps = {
    numPopup: number,
    origDomain: string,
    destUrl: string,
};

export const Alert: React.FunctionalComponent<AlertProps> = ({
    numPopup,
    origDomain,
    destUrl,
}) => (
    <>
        <div class="alert">
            <button class="alert__close" />
            <div class="alert__in">
                <div class="alert__ico alert__ico--windows" />
                <div class="alert__text">
                    {preactTranslator.getMessage('popup_text', { numPopup })}
                </div>
            </div>
            <div class="alert__btns">
                {/*
                  * A custom dropdown is used instead of a native <select>, because browsers
                  * close a native select popup as soon as the document loses focus, which
                  * allowed pages to dismiss the menu by stealing focus.
                  * https://github.com/AdguardTeam/PopupBlocker/issues/348
                  */}
                <button class="alert__select" aria-haspopup="true" aria-expanded="false">
                    {preactTranslator.getMessage('options')}
                </button>
                <div class="alert__select-list" role="menu" hidden>
                    <button class="alert__select-item" role="menuitem" data-value="1">
                        {preactTranslator.getMessage('allow_from', { origDomain })}
                    </button>
                    <button class="alert__select-item" role="menuitem" data-value="2">
                        {preactTranslator.getMessage('silence_noti', { origDomain })}
                    </button>
                    <button class="alert__select-item" role="menuitem" data-value="3">
                        {preactTranslator.getMessage('manage_pref')}
                    </button>
                    <button class="alert__select-item" role="menuitem" data-value="4">
                        {preactTranslator.getMessage('show_popup', { destUrl })}
                    </button>
                </div>
                <button class="alert__btn">
                    {preactTranslator.getMessage('continue_blocking')}
                </button>
            </div>
        </div>
        <button class="pin pin--win-hidden pin--show" />
        <style>{
            /**
             * This is required to pass processed styles into iframe for Alert notification
             * see postcss.config.ts:userscriptPostcssConfig
             *
             * These props won't pollute global scope as they are assigned inside iframe inside shadow root.
            */
            window[GlobalStyleProp.Alert]
        }</style>
    </>
);
