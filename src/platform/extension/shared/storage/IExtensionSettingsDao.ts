import ISettingsDao from "../../../../storage/ISettingsDao";
import { Settings } from "../message_types";

export default interface IExtensionSettingsDao extends ISettingsDao {
    getDomainOption(domain:string, cb:DomainSettingsCallback):void
    onDomainSettingsChange(domain:string, cb:DomainSettingsCallback):void
}

export type DomainSettingsCallback = (settings:Settings)=>void