import React from 'preact';
import { createPortal } from 'preact/compat';

type PortalProps = {
    children: React.VNode,
};

export const Portal: React.FunctionalComponent<PortalProps> = ({ children }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const portalRoot = document.getElementById('portal')!;

    return createPortal(children, portalRoot);
};
