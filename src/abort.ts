import { closeAllGroup } from './log';

let MAGIC;

export default function abort():never {
    closeAllGroup();
    MAGIC = Math.random().toString(36).substr(7);
    console.warn('PopupBlocker: aborted a script execution');
    throw MAGIC;
}
