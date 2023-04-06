import React from 'preact';
import { preactTranslator } from '../../../../i18n';
import { ResourceUrl } from '../../constants';
import './footer.pcss';

export const Footer: React.FunctionalComponent = () => (
    <div class="footer">
        <div class="footer__in">
            <div class="footer__links-list">
                <a target="_blank" href={ResourceUrl.AdGuard} class="footer__link" rel="noreferrer">
                    © AdGuard.com
                </a>
                <a target="_blank" href={ResourceUrl.Popupblocker} class="footer__link" rel="noreferrer">
                    {preactTranslator.getMessage('homepage')}
                </a>
            </div>
        </div>
    </div>
);
