import React from 'preact';
import { translator } from '../../../../i18n';
import { Theme } from '../../../../theme';

type ThemeSwitchProps = {
    theme: Theme,
    toggleTheme: () => void,
};

export const ThemeSwitch: React.FunctionalComponent<ThemeSwitchProps> = ({
    theme,
    toggleTheme,
}) => {
    const label = translator.getMessage(
        theme === Theme.Dark ? 'theme_switch_to_light' : 'theme_switch_to_dark',
    );

    return (
        <button
            type="button"
            class="theme-switch"
            title={label}
            aria-label={label}
            onClick={toggleTheme}
        >
            <span class="theme-switch__icon" />
        </button>
    );
};
