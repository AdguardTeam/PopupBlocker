export default interface IContentScriptApi {
    originIsWhitelisted():boolean
    destinationIsWhitelisted(dest:string):boolean
    originIsSilenced():boolean

    showAlert(orig_domain:string, popup_url:string):void
    $getMessage(messageId:string):string
    domain:string
}
