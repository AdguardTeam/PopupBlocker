import { Settings } from "../message_types";
import ISettingsDao from "../../../../storage/ISettingsDao";

export default interface IExtensionSettingsDao extends ISettingsDao {
    /**
     * These are only used by extension to get initial option.
     * Userscript implementation queries storage sychronously everytime with GM_getValue.
     */
    getDomainOption?(domain:string, cb:DomainSettingsCallback):void
    onDomainSettingsChange?(domain:string, cb:DomainSettingsCallback):void
}

export type DomainSettingsCallback = (data:Partial<Settings>|null)=>void
