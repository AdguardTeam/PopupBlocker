export default interface IStorageManager {
    /**
     * Modifies settings, and if callback is provided, call it with updated options.
     */
    setSourceOption(domain:string, option:DomainOptionEnum, cb?:OptionsCallback):void
    setIsWhitelistedDestination(domain:string, option:boolean, cb?:OptionsCallback):void
    /**
     * @return an array of whitelisted domains, an array of silenced domains, an array of domains
     * which are whitelisted as destinations, each of which are sorted in alphabetical order.
     */
    enumerateOptions?(cb:OptionsCallback):void
}

export type AllOptions = [string[], string[], string[]];
/**
 * `null` argument is used to indicate that no storage change was made.
 */
export type OptionsCallback = (data:AllOptions|null)=>void
