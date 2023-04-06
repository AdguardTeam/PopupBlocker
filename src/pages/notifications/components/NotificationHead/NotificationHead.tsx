import React from 'preact';
import { NotificationFontPath } from '../../../common/constants';

/**
 * Use string and GM_getResourceURL to inject fonts into notification's shadowed iframe
 */
const fontFaceString = `
@font-face {
    font-family: "Open Sans";
    src:
        url("${GM_getResourceURL(NotificationFontPath.RegularWoff2)}") format("woff2"),
        url("${GM_getResourceURL(NotificationFontPath.RegularWoff)}") format("woff");
    font-weight: 400;
    font-style: normal;
}

@font-face {
    font-family: "Open Sans";
    src:
        url("${GM_getResourceURL(NotificationFontPath.BoldWoff2)}") format("woff2"),
        url("${GM_getResourceURL(NotificationFontPath.BoldWoff)}") format("woff");
    font-weight: 700;
    font-style: normal;
}
`;

export const NotificationHead: React.FunctionalComponent = () => (
    <>
        <meta charSet="UTF-8" />
        <meta
            name="viewport"
            content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <style>
            {fontFaceString}
        </style>
    </>
);
