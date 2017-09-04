import { getSafeNonEmptyParent } from '../shared/dom';

const parent = <WindowWithMO>getSafeNonEmptyParent(window);

const MO = parent.MutationObserver || parent.WebKitMutationObserver;

export default MO;

// Typescript doesn't contain declaration for MO in window property
interface MO {
    new (callback:MutationCallback):MutationObserver,
    prototype:MutationObserver
}

interface WindowWithMO extends Window {
    MutationObserver?:MO,
    WebKitMutationObserver?:MO
}
