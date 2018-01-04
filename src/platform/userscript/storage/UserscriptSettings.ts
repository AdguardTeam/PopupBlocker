import IUserscriptSettings from "./IUserscriptSettings";

export default class UserscriptSettings implements IUserscriptSettings {
    private getValue(key:string, defaultValue:string) {
        let val = GM_getValue(key);
        if (typeof val === 'undefined') {
            GM_setValue(key, defaultValue);
            return defaultValue;
        } else { return val; }
    }
    private static INITIAL_DOMAIN_OPTION = JSON.stringify({
        whitelisted: false,
        use_strict: false
    });
    public domainOption:DomainOption
    public whitelistedDestinations:string[]
    public isFirefox:boolean
    constructor() {
        this.domainOption = JSON.parse(GM_getValue(location.host, UserscriptSettings.INITIAL_DOMAIN_OPTION));
        this.whitelistedDestinations = this.getValue('whitelist', '').split(',').filter(host => host.length);
        this.isFirefox = typeof InstallTrigger !== 'undefined' && document.currentScript === null;
    }
}
