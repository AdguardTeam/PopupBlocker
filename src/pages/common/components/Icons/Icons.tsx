import React from 'preact';

// Render paths directly: the notification iframe inherits the page's image CSP.
// https://github.com/AdguardTeam/PopupBlocker/issues/354
export const CloseIcon: React.FunctionalComponent = () => (
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path
            d="m1.473 1.273 13 13M1.473 14.273l13-13"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="square"
            opacity=".661"
        />
    </svg>
);

export const ArrowIcon: React.FunctionalComponent = () => (
    <svg width="10" height="8" viewBox="0 0 11 8" aria-hidden="true" focusable="false">
        <path
            d="M9.63.914 5.147 5.945.665.914"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            opacity=".337"
        />
    </svg>
);

type ShieldIconProps = {
    /** Unique within the iframe, including when the alert and pin are both rendered. */
    gradientId: string,
    /** Rendered width and height in pixels. Defaults to the full-size alert icon. */
    size?: number,
};

export const ShieldIcon: React.FunctionalComponent<ShieldIconProps> = ({ gradientId, size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
        <path
            fill={`url(#${gradientId}) var(--icon-shield-start)`}
            fill-rule="evenodd"
            d={'M24 3A38.39 38.39 0 0 0 3.06 9.14a37.85 37.85 0 0 0 20.9 35.8L24 45l.04-.07'
                + 'a37.85 37.85 0 0 0 20.9-35.8A38.39 38.39 0 0 0 24 3Z'}
        />
        <path
            stroke="var(--icon-shield-foreground)"
            stroke-linecap="round"
            stroke-width="1.5"
            d="M15 17a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H16a1 1 0 0 1-1-1v-8ZM16 30l16-18"
        />
        <defs>
            <linearGradient id={gradientId} x1="24" x2="24" y1="3" y2="45" gradientUnits="userSpaceOnUse">
                <stop stop-color="var(--icon-shield-start)" />
                <stop offset="1" stop-color="var(--icon-shield-end)" />
            </linearGradient>
        </defs>
    </svg>
);
