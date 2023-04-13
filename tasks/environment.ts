import { Channel } from './channels';

/**
 * Channel env is required as some data structure relies on it (see meta.settings.ts)
 * Forwarding this through commander and the whole build flow would be too tedious
 */
export const env = (process.env.NODE_ENV as Channel) || Channel.Dev;

// If the environment is Dev, the resources are linked to the Release channel by default
// since Dev doesn't have its own namespace
export const resourceEnv = env === Channel.Dev ? Channel.Release : env;
