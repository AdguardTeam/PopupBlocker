import { isUndef } from "../../../shared/instanceof";

let safeDoc:HTMLDocument
export function getSafeDocument():HTMLDocument {
    if (isUndef(safeDoc)) {
        safeDoc = document.implementation.createHTMLDocument('');
    }
    return safeDoc;
}
