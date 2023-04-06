import { Channel } from './constants';

/**
 * Channel env is required as some data structure relies on it (see meta.settings.ts)
 * Forwarding this through commander and the whole build flow would be too tedious
 */
export const env = process.env.NODE_ENV || Channel.Dev;
