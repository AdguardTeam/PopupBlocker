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
                <select class="alert__select" name="options">
                    <option value="0" disabled selected>
                        {preactTranslator.getMessage('options')}
                    </option>
                    <option value="1">
                        {preactTranslator.getMessage('allow_from', { origDomain })}
                    </option>
                    <option value="2">
                        {preactTranslator.getMessage('silence_noti', { origDomain })}
                    </option>
                    <option value="3">
                        {preactTranslator.getMessage('manage_pref')}
                    </option>
                    <option value="4">
                        {preactTranslator.getMessage('show_popup', { destUrl })}
                    </option>
                </select>
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
