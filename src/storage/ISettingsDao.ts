import { Settings } from "../platform/extension/shared/message_types";

export default interface ISettingsDao {
    /**
     * Modifies settings, and if a callback is provided, calls it.
     * Beware - This callback should be called **before** onSettingsChange callbacks.
     */
    setSourceOption(domain:string, option:DomainOptionEnum, cb?:func):void
    setIsWhitelistedDestination(domain:string, option:boolean, cb?:func):void
    /**
     * @return an array of whitelisted domains, an array of silenced domains, an array of domains
     * which are whitelisted as destinations, each of which are sorted in alphabetical order.
     */
    enumerateOptions?(cb:AllOptionsCallback):void
    /**
     * On userscript && GM_addValueChangeListener is unavailable, we listen to
     * changes made by the instance itself.
     */
    onSettingsChange(cb:AllOptionsCallback):void
    /**
     * These are only used by extension to get initial option.
     * Userscript implementation queries storage sychronously everytime with GM_getValue.
     */
    getDomainOption?(domain:string, cb:DomainSettingsCallback):void
    onDomainSettingsChange?(domain:string, cb:DomainSettingsCallback):void
}

export type AllOptions = [string[], string[], string[]];
/**
 * `null` argument is used to indicate that no storage change was made.
 */
export type AllOptionsCallback = (data:AllOptions|null)=>void
export type DomainSettingsCallback = (data:Partial<Settings>|null)=>void
