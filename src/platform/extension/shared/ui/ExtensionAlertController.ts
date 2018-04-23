import BaseAlertController from "../../../../ui/controllers/alert/BaseAlertController";
import chrome from '../platform_namespace';
import { BGMsgTypesEnum } from "../message_types";

const getURL = chrome.runtime.getURL;

export default class ExtensionAlertController extends BaseAlertController {
    protected openSettingsPage() {
        chrome.runtime.sendMessage(BGMsgTypesEnum.OPEN_OPTIONS_PAGE);
    }
}
