/**
 * @fileoverview Used to declare which TS sources are used among multiple build targets.
 * Only used in Closure Compiler as a root module.
 */

import IContentScriptApiFacade from '../../../storage/IContentScriptApiFacade';
import createUrl, * as url from '../../../shared/url';
import * as MessageTypes from './message_types';
import * as log from '../../../shared/log';
