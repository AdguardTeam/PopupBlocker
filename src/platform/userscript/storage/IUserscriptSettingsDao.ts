import ISettingsDao from "../../../storage/ISettingsDao";
import { DomainOptionEnum } from "../../../storage/storage_data_structure";

/**
 * Provides some synchronous access methods
 */
export default interface IUserscriptSettingsDao extends ISettingsDao {
    getIsWhitelisted(domain:string):boolean
    getSourceOption(domain:string):DomainOptionEnum
    getInstanceID():string
}
