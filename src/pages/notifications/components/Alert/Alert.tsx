import React from 'preact';
import { hasLocaleMessage, preactTranslator } from '../../../../i18n';
import { GlobalStyleProp } from '../../../common/constants';
import {
    ArrowIcon,
    CloseIcon,
    ShieldIcon,
} from '../../../common/components/Icons';
import '../../../common/styles/alerts.pcss';

type AlertProps = {
    numPopup: number,
    origDomain: string,
    destUrl: string,
};

type PopupTextKey = 'popup_text' | 'popup_text_one';

// TODO: This fixes only the one-popup case. Languages with more plural forms, such as Polish,
// Russian or Czech, still get the wrong form for counts like 2-4 or 21. Replace this with full
// plural support (e.g. @adguard/translate getPlural) in a separate issue.
// TODO: The Italian popup_text translation in Crowdin uses {$numPopup} instead of %numPopup%.
// It is fixed locally in translations.json, but must also be fixed in Crowdin, otherwise the next
// `pnpm locales:download` brings the raw placeholder back.
/**
 * Uses the singular message for one popup when the current locale translates it.
 * Otherwise keeps the existing message, so untranslated locales do not switch to English.
 *
 * @param numPopup number of blocked popups
 * @returns message key for the notification text
 */
const getPopupTextKey = (numPopup: number): PopupTextKey => (
    numPopup === 1 && hasLocaleMessage('popup_text_one') ? 'popup_text_one' : 'popup_text'
);

export const Alert: React.FunctionalComponent<AlertProps> = ({
    numPopup,
    origDomain,
    destUrl,
}) => (
    <>
        <div class="alert">
            <button class="alert__close">
                <CloseIcon />
            </button>
            <div class="alert__in">
                <div class="alert__ico">
                    <ShieldIcon gradientId="alert-shield-gradient" />
                </div>
                <div class="alert__text">
                    {preactTranslator.getMessage(getPopupTextKey(numPopup), { numPopup })}
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
                    <ArrowIcon />
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
        <button class="pin pin--show">
            <ShieldIcon gradientId="pin-shield-gradient" size={16} />
        </button>
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
