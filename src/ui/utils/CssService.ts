import { isUndef } from "../../shared/instanceof";

/**
 * @fileoverview Provides various CSS in JS string
 */

export default class CSSService {
    constructor(
        private $getURL:(resc_marker:string)=>string
    ) { }

    private static readonly fontsDir = './assets/fonts/';

    private fontURLs:string[];

    protected getFontURLs() {
        if (isUndef(this.fontURLs)) {
            const fontsDir = CSSService.fontsDir;
            const opensans = "/OpenSans-";
            const woff = '.woff';
            const WOFF_OPENSANS_REGULAR = `${fontsDir}regular${opensans}Regular${woff}`;
            const WOFF_OPENSANS_SEMIBOLD = `${fontsDir}semibold${opensans}Semibold${woff}`;
            const WOFF_OPENSANS_BOLD = `${fontsDir}bold${opensans}Bold${woff}`;
            const WOFF2_OPENSANS_REGULAR = WOFF_OPENSANS_REGULAR + 2;
            const WOFF2_OPENSANS_SEMIBOLD = WOFF_OPENSANS_SEMIBOLD + 2;
            const WOFF2_OPENSANS_BOLD = WOFF_OPENSANS_BOLD + 2;
            this.fontURLs = [
                this.$getURL(WOFF_OPENSANS_REGULAR),
                this.$getURL(WOFF2_OPENSANS_REGULAR),
                this.$getURL(WOFF_OPENSANS_SEMIBOLD),
                this.$getURL(WOFF2_OPENSANS_SEMIBOLD),
                this.$getURL(WOFF_OPENSANS_BOLD),
                this.$getURL(WOFF2_OPENSANS_BOLD)
            ];
        }
        return this.fontURLs;
    }
    private static reDataURI = /^data\:/;
    private static isNotDataURI(url:string) {
        return !CSSService.reDataURI.test(url);
    }
    // every browser that supports preload supports woff2.
    getAlertPreloadFontURLs() {
        let urls = this.getFontURLs();
        // Regular and Bold woff2
        return [urls[1], urls[5]]
            .filter(CSSService.isNotDataURI); // There is no point of applying 'preload'
                                              // to data URIs. 
    }
    getToastPreloadFontURLs() {
        let urls = this.getFontURLs();
        // Regular woff2
        return [urls[1]].filter(CSSService.isNotDataURI);
    }
    getInlineFontCSS() {
        let urls = this.getFontURLs();
        return RESOURCE_ARGS("FONT_INLINE_CSS",
            "WOFF_OPENSANS_REGULAR",     urls[0],
            "WOFF2_OPENSANS_REGULAR",    urls[1],
            "WOFF_OPENSANS_SEMIBOLD",    urls[2],
            "WOFF2_OPENSANS_SEMIBOLD",   urls[3],
            "WOFF_OPENSANS_BOLD",        urls[4],
            "WOFF2_OPENSANS_BOLD",       urls[5]
        );
    }
    getAlertCSS() {
        return this.getInlineFontCSS() + RESOURCE_ALERT_CSS;
    }
    getToastCSS() {
        return this.getInlineFontCSS() + RESOURCE_TOAST_CSS;
    }
}

declare const RESOURCE_ALERT_CSS:string;
declare const RESOURCE_TOAST_CSS:string;
