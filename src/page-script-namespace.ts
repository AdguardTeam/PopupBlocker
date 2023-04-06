/**
 * @fileoverview Global namespace to be used throughout the page script.
 */

import { UserscriptApiFacadeInterface } from './storage/UserscriptApiFacade';
import { InterContextMessageHubInterface } from './messaging/InterContextMessageHubInterface';

interface IAdguard {
    contentScriptApiFacade?: UserscriptApiFacadeInterface
    messageHub?: InterContextMessageHubInterface
}

export const adguard: IAdguard = {};
