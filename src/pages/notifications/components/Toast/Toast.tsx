import React from 'preact';
import { GlobalStyleProp } from '../../../common/constants';
import '../../../common/styles/toast.pcss';

type ToastProps = {
    message: string,
};

export const Toast: React.FunctionalComponent<ToastProps> = ({ message }) => (
    <div class="toast">
        <div class="toast__in">
            {message}
        </div>
        <style>{
            /**
             * This is required to pass processed styles into iframe for Alert and Toast notifications
             * see postcss.config.ts:userscriptPostcssConfig
             *
             * These props won't pollute global scope as they are assigned inside iframe inside shadow root.
            */
            window[GlobalStyleProp.Toast]
        }</style>
    </div>
);
