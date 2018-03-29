import ISettingsDao from "../../../storage/ISettingsDao";

/**
 * Provides some synchronous access methods
 */
export default interface IUserscriptSettingsDao extends ISettingsDao {
    getIsWhitelisted(domain:string):boolean
    getSourceOption(domain:string):DomainOptionEnum
}
