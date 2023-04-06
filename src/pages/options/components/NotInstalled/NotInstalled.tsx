import React from 'preact';
import { preactTranslator } from '../../../../i18n';
import { ScriptManagerItems } from './ScriptManagerItems';
import { InstallSourceItems } from './InstallSourceItems';

export const NotInstalled: React.FunctionalComponent = () => (
    <>
        <div class="settings__subtitle settings__subtitle--margin">
            {preactTranslator.getMessage('noinst_subtitle')}
        </div>
        <div class="settings__list">
            <div class="settings__list-title">
                {preactTranslator.getMessage('noinst_step_1')}
            </div>
            <div class="settings__list-subtitle">
                {preactTranslator.getMessage('noinst_special_prog')}
            </div>
            <div class="settings__list-in">
                <ScriptManagerItems />
            </div>
            <div class="settings__list-title">
                {preactTranslator.getMessage('noinst_step_2')}
            </div>
            <div class="settings__list-subtitle">
                {preactTranslator.getMessage('noinst_ignore_if_ag')}
            </div>
            <div class="settings__list-in">
                <InstallSourceItems />
            </div>
            <div class="settings__list-title">
                {preactTranslator.getMessage('noinst_step_3')}
            </div>
        </div>
    </>
);
