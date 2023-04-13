export enum Channel {
    Dev = 'dev',
    Beta = 'beta',
    Release = 'release',
}

export const ChannelPostfix = {
    [Channel.Dev]: '(Dev)',
    [Channel.Beta]: '(Beta)',
    [Channel.Release]: '',
};

export const ChannelBaseUrl = {
    [Channel.Dev]: 'https://AdguardTeam.github.io/PopupBlocker/',
    [Channel.Beta]: 'https://userscripts.adtidy.org/beta/popup-blocker/2.5/',
    [Channel.Release]: 'https://userscripts.adtidy.org/release/popup-blocker/2.5/',
};
