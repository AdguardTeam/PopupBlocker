import adguard from './adguard';
import { createAlertInTopFrame } from './messaging';
import pdfObjObserver from './observers/pdf_object_observer';
import examineTarget from './events/examine_target';

export default function onBlocked(popup_url:string, isGeneric:boolean, currentEvent:Event) {
    createAlertInTopFrame(adguard.storageProvider.domain, popup_url, isGeneric);
    pdfObjObserver.$start();
    if (currentEvent) { examineTarget(currentEvent, popup_url); }
}
