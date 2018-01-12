import adguard from '../../adguard';

if (typeof CONTENT_SCRIPT_KEY !== 'undefined') {
    adguard.storageProvider = window[CONTENT_SCRIPT_KEY];
    delete window[CONTENT_SCRIPT_KEY];
} else {
    adguard.storageProvider = window.parent[PARENT_FRAME_KEY][3];
}

import '../../messaging';
import '../../dom/open';
import '../../dom/click';
import '../../dom/dispatchEvent';
import '../../dom/HTMLIFrame';
import '../../dom/HTMLObject';
import '../../dom/removeChild';
import '../../dom/unload';
import '../../dom/write';
import '../../dom/preventDefault';
import '../../observers/overlay_link_observer';
