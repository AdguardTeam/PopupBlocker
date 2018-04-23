export type Dict = stringmap<any>

export type DictTransformer = (dict?:Dict) => Dict

/**
 * Trying to provide an api to interact with chrome extension storage
 * emphasizing a sequential nature of it
 */
export default interface ITransaction {
    /**
     * Request data from the storage, and saves the retrieved data in a register.
     */
    getData():this
    /**
     * Sets the data in register to chrome extension storage.
     */
    setData():this
    /**
     * Removes the data specified in register from chrome extension storage
     */
    removeData():this
    /**
     * Sets a dictionary stored in register.
     */
    setRegister(dict:Dict):this
    /**
     * Transforms a dictionary stored in register.
     */
    transformRegister(transformer:DictTransformer):this
    /**
     * This method must be called at the end of transaction sequences.
     */
    commit():void
}
