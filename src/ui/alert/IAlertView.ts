export default interface IAlertView {
    render(popupCount:number, origDomain:string, destUrl:string, callback?:()=>void):void
    $expand():void
    $collapse():void
    $destroy():void
}
