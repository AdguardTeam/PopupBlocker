import svgo from 'postcss-svgo';
import postcssNested from 'postcss-nested';
import svg from 'postcss-inline-svg';
import mixins from 'postcss-mixins';
import postcssPresetEnv from 'postcss-preset-env';
import imp from 'postcss-import';
import { GlobalStyleProp } from './src/pages/common/constants';

export const commonPostcssConfig = {
    plugins: [
        imp(),
        postcssNested(),
        svg({ path: 'src/assets' }),
        svgo(),
        mixins(),
        postcssPresetEnv({
            stage: 3,
            features: { 'nesting-rules': true },
        }),
    ],
};

export const userscriptPostcssConfig = {
    ...commonPostcssConfig,
    /**
     * This is required to pass processed styles into iframe for Alert and Toast notifications
     * see postcss.config.ts:userscriptPostcssConfig
     *
     * These props won't pollute global scope as they are assigned inside iframe inside shadow root.
    */
    inject: (cssVariableName: string, fileId: string): string => {
        if (fileId.includes('alerts.pcss')) {
            return `window.${GlobalStyleProp.Alert} = (${cssVariableName})`;
        }
        if (fileId.includes('toast.pcss')) {
            return `window.${GlobalStyleProp.Toast} = (${cssVariableName})`;
        }
        return '';
    },
};
