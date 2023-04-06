/**
 * @fileoverview Keeps a reference of MutationObserver constructor.
 * Other than this being more succinct, we need to retrieve a reference
 * from a 'persistent' frame, because it seems that browser discards
 * from the DOM the observer when the originating frame is detached
 * from the document.
 */

import { getSafeNonEmptyParent } from '../shared';

const parent = <WindowWithMO>getSafeNonEmptyParent(window);

const MO = parent.MutationObserver || parent.WebKitMutationObserver;

export default MO;

// Typescript doesn't contain declaration for MO in window property
interface IMutationObserver {
    new (callback:MutationCallback):MutationObserver,
    prototype:MutationObserver
}

declare interface WindowWithMO extends Window {
    MutationObserver?:IMutationObserver,
    WebKitMutationObserver?:IMutationObserver
}
