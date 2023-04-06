import fs from 'fs';
import * as path from 'path';

import type {
    HeadersDataContainer,
    HeaderData,
    LocalizedHeaderData,
} from './metadata';

export function isLocalizedHeader(headerData: HeaderData | LocalizedHeaderData): headerData is LocalizedHeaderData {
    return Object.prototype.hasOwnProperty.call(headerData, 'localeKey');
}

export function isPlainHeader(headerData: HeaderData | LocalizedHeaderData): headerData is HeaderData {
    return (headerData as HeaderData).headerValue !== undefined;
}

interface IMetaDataPlugin {
    injectMetadata(outputPath: string, userscriptName: string): void,
}

export default class MetaDataPlugin implements IMetaDataPlugin {
    private filename: string;

    private postfix: string;

    private headersData: HeadersDataContainer;

    // Parsed translations file (e.g translations.json)
    private translations: object;

    private templatePath: string;

    constructor(
        filename: string,
        metadataTemplatePath: string,
        localesPath: string,
        postfix = '',
        headersData: HeadersDataContainer = {},
    ) {
        this.filename = `${filename}.meta.js`;
        this.templatePath = metadataTemplatePath;
        this.postfix = postfix;
        this.headersData = headersData;

        this.translations = JSON.parse(fs.readFileSync(localesPath, 'utf8'));
    }

    /**
     * Generates header content line(s)
     *
     * @param headerData
     * @returns header content
     * @throws error on invalid header value
     */
    private static getHeaderContent(headerData: HeaderData): string {
        const { headerName, headerValue } = headerData;
        if (typeof headerValue === 'string') {
            return `// @${headerName} ${headerValue}`;
        }
        // Handle multiline headers
        if (Array.isArray(headerValue)) {
            return headerValue
                .map((value) => `// @${headerName} ${value}`)
                .join('\n');
        }
        throw new Error('Header headerValue must be either string or array type');
    }

    /**
     * Generates header content for localized headers (e.g name, description)
     *
     * @param headerData
     * @returns header content
     */
    private getLocalizedHeaderContent(headerData: LocalizedHeaderData): string {
        /**
         * Locales structure (only userscript meta related):
         *  {
         *       languageCode: {
         *           localeKey: {
         *               message: string
         *           }
         *       },
         *       "en": {
         *           "userscript_name": {
         *               "message": "AdGuard Popup Blocker",
         *           }
         *       }
         *       "ar": ...,
         *       "be": ...,
         *       ...,
         *   }
         */

        const { headerName, localeKey } = headerData;
        const localizedHeaders: string[] = [];

        // eslint-disable-next-line no-restricted-syntax
        Object.entries(this.translations).forEach((language, index) => {
            // Construct header lines for each available language
            // using language code and corresponding message from translations
            const [languageCode, { [localeKey as string]: locale }] = language;

            const languagePrefix = index === 0 ? ' ' : `:${languageCode} `;
            const postfix = headerName === 'name' ? this.postfix : '';

            localizedHeaders.push(`// @${headerName}${languagePrefix}${locale.message} ${postfix}`);
        });
        const headerContent = localizedHeaders.join('\n');

        return headerContent;
    }

    /**
     * Generates metadata by filling placeholders in a template file
     *
     * @param outputPath
     */
    private prepareMetadata(outputPath: string) {
        // Calculate result metadata file path
        const metadataOutputPath = path.join(outputPath, this.filename);
        // Copy template file to output directory
        fs.copyFileSync(this.templatePath, metadataOutputPath);

        const headers = Object.keys(this.headersData);

        /**
         * Inserts header data into line placeholders if any
         *
         * @param line metadata template line
         * @returns corresponding header content
         * @throws  error on invalid header data
         */
        const applyHeaders = (line: string): string => {
            const matchedHeader = headers.find((header) => line.includes(header));
            if (!matchedHeader) {
                return line;
            }

            const headerData = this.headersData[matchedHeader];
            if (isLocalizedHeader(headerData)) {
                return this.getLocalizedHeaderContent(headerData);
            }
            if (isPlainHeader(headerData)) {
                return MetaDataPlugin.getHeaderContent(headerData);
            }
            throw new Error('Header data must contain either headerValue or localeKey');
        };

        const metadataContent = fs.readFileSync(this.templatePath)
            .toString()
            .split('\n')
            .map(applyHeaders)
            .join('\n');

        fs.writeFileSync(metadataOutputPath, metadataContent);
    }

    /**
     * Concats metadata with userscript
     *
     * @param outputPath userscript build path
     * @param userscriptFilename userscript filename
     * @param metaFilename metadata filename
     */
    private static concatMetaWithOutput(outputPath: string, userscriptFilename: string, metaFilename: string) {
        const metadataOutputPath = path.join(outputPath, metaFilename);
        const userscriptOutputPath = path.resolve(outputPath, userscriptFilename);

        const meta = fs.readFileSync(metadataOutputPath).toString();
        const userscript = fs.readFileSync(userscriptOutputPath).toString();

        fs.writeFileSync(path.resolve(userscriptOutputPath), `${meta}${userscript}`);
    }

    /**
     * Generates metadata at output path and injects it into userscript
     *
     * @param outputPath userscript build path
     * @param userscriptFilename userscript filename
     */
    public injectMetadata(outputPath: string, userscriptFilename: string) {
        this.prepareMetadata(outputPath);
        MetaDataPlugin.concatMetaWithOutput(outputPath, userscriptFilename, this.filename);
    }
}
