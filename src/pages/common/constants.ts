const enum GlobalStyleProp {
    Alert = 'alertStyles',
    Toast = 'toastStyles',
}

export const FONTS_PATH = './assets/fonts';

/**
 * Enums don't allow calculated values
 * that's wy 'as const' is used
 */
const NotificationFontPath = {
    RegularWoff: `${FONTS_PATH}/regular/OpenSans-Regular.woff`,
    RegularWoff2: `${FONTS_PATH}/regular/OpenSans-Regular.woff2`,
    BoldWoff: `${FONTS_PATH}/bold/OpenSans-Bold.woff`,
    BoldWoff2: `${FONTS_PATH}/bold/OpenSans-Bold.woff2`,
} as const;

export {
    GlobalStyleProp,
    NotificationFontPath,
};
