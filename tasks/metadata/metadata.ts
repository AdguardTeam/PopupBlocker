export interface HeaderData {
    headerName: string,
    headerValue: string | string[],
}

export interface LocalizedHeaderData {
    headerName: string,
    localeKey: string,
}

export type HeadersDataContainer = {
    [template_placeholder: string]: HeaderData | LocalizedHeaderData;
};
