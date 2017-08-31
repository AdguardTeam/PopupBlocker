const MO = window.MutationObserver || window.WebKitMutationObserver;

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

declare var window:WindowWithMO;
