import adguard from './page_script_namespace';
import { createAlertInTopFrame } from './messaging';
import pdfObjObserver from './observers/pdf_object_observer';
import examineTarget from './events/examine_target';

export default function onBlocked(popup_url:string, isGeneric:boolean, currentEvent:Event) {
    if (!adguard.contentScriptApiFacade.originIsSilenced()) {
        createAlertInTopFrame(adguard.contentScriptApiFacade.domain, popup_url, isGeneric);
    } // Otherwise, we silently block popups
    pdfObjObserver.$start();
    if (currentEvent) { examineTarget(currentEvent, popup_url); }
}
