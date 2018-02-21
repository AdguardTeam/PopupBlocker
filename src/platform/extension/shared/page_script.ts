/**
 * @fileoverview Entry point for the page script.
 */

import adguard from '../../../page_script_namespace';
import ExtensionContentScriptApiFacade from './storage/ExtensionContentScriptApiFacade';

if (typeof PARENT_FRAME_KEY === 'undefined') {
    adguard.storageProvider = new ExtensionContentScriptApiFacade();
} else {
    adguard.storageProvider = window.parent[PARENT_FRAME_KEY][3];
}

import '../../../messaging';
import '../../../dom/open';
import '../../../dom/click';
import '../../../dom/dispatchEvent';
import '../../../dom/HTMLIFrame';
import '../../../dom/HTMLObject';
import '../../../dom/removeChild';
import '../../../dom/unload';
import '../../../dom/write';
import '../../../dom/preventDefault';
import '../../../observers/overlay_link_observer';
