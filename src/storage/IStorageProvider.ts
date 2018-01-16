export default interface IStorageProvider {
    originIsWhitelisted():boolean
    destinationIsWhitelisted(dest:string):boolean

    showAlert(orig_domain:string, popup_url:string):void
    $getMessage(messageId:string):string
    domain:string
}
