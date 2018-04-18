import { DomainOptionEnum } from "./storage_data_structure";

export default interface ISettingsDao {
    /**
     * Modifies settings, and if a callback is provided, calls it.
     * Beware - This callback should be called **before** onSettingsChange callbacks.
     */
    setSourceOption(domain:string, option:DomainOptionEnum, cb?:func):void
    /**
     * Adds or removes a domain into whitelists.
     * If `null` is provided as a second argument, it toggles the whitelist status.
     * This currently works because there aren't many operations required regarding
     * whitelists, if it changes in future we may use bitmask here.
     */
    setWhitelist(domain:string, whitelisted:boolean|null, cb?:func):void
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
}

export type AllOptions = [/* Whitelisted */string[], /* Silenced */string[]];
/**
 * `null` argument is used to indicate that no storage change was made.
 */
export type AllOptionsCallback = (data:AllOptions|null)=>void
