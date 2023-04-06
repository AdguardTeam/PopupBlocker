import React from 'preact';

type TooltipProps = {
    tooltip: string
};

export const Tooltip: React.FunctionalComponent<TooltipProps> = ({
    tooltip,
}) => (<div class="tooltip" data-tooltip={tooltip} />);
