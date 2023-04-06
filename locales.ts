import { program } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import twoskyData from './.twosky.json';

const { log } = console;

const LOCALES_DIR = './src/locales';
// URLs
const BASE_URL = 'https://twosky.int.agrd.dev/api/v1';
const BASE_DOWNLOAD_URL = `${BASE_URL}/download`;
const BASE_UPLOAD_URL = `${BASE_URL}/upload`;

const twoskyConfig = twoskyData[0];
const BASE_LOCALE = twoskyConfig.base_locale;
// Twosky project see mapping https://twosky.int.agrd.dev/api/v1/mapping
const CROWDIN_PROJECT = twoskyConfig.project_id;
// Available translations list
const LOCALES = Object.keys(twoskyConfig.languages);
// Crowdin files for downloading/uploading
const CROWDIN_FILES = twoskyConfig.localizable_files
    .map((pathToFile) => pathToFile.split('/').pop() as string);

/**
 * Users locale may be defined with only two chars (language code)
 * Here we provide a map of equivalent translation for such locales
 */
const LOCALES_EQUIVALENTS_MAP = {
    'pt-BR': 'pt',
    'zh-CN': 'zh',
};

/**
 * Build query string for downloading tranlations
 * @param lang locale code
 * @param file crowdin file name
 */
const getQueryString = (lang: string, file: string) => {
    let res = '?format=json';
    res += `&language=${lang}`;
    res += `&project=${CROWDIN_PROJECT}`;
    res += `&filename=${file}`;
    return res;
};

/**
 * Build form data for uploading tranlation
 * @param file crowdin file name
 */
const getFormData = (file: string) => {
    const pathToBaseFile = path.resolve(LOCALES_DIR, file);
    const body = new FormData();

    body.append('format', 'json');
    body.append('language', BASE_LOCALE);
    body.append('project', CROWDIN_PROJECT);
    body.append('filename', `${file}`);
    body.append('file', fs.createReadStream(pathToBaseFile));
    return body;
};

/**
 * Returns link for downloading translations
 * @param lang locale code
 * @param file crowdin file name
 */
const getDownloadURL = (lang: string, file: string) => BASE_DOWNLOAD_URL + getQueryString(lang, file);

/**
 * Replaces object to array with values by passed key in message object
 *
 * WHY WE USE IT?
 * Crowdin transforms output and replaces arrays to objects,
 * these transformations can cause the errors in application.
 *
 * @param {string} key member of message object
 * @param {Object} data translation for specific locale
 */
const replaceObjectToArray = (key: string, data: Record<string, unknown>) => {
    const result = {};

    Object.entries(data).forEach(([message, value]) => {
        if (value && typeof value === 'object' && typeof value[key] === 'object') {
            result[message] = {
                ...value,
                [key]: Object.values(value[key]),
            };
        } else {
            result[message] = value;
        }
    });

    return result;
};

/**
 * Returns equivalent of specified locale code
 * @param locale locale
 */
const getEquivalent = (locale: string) => LOCALES_EQUIVALENTS_MAP[locale] || locale;

/**
 * Save file by path with passed content
 * @param filePath path to file
 * @param content
 */
async function saveFile(filePath: string, content: any) {
    await fs.outputJson(filePath, content, { spaces: 4 });
}

/**
 * Entry point for downloading translations
 */
async function downloadLocales() {
    const translations = {};
    let enTranslation;

    // eslint-disable-next-line no-restricted-syntax
    for (const lang of LOCALES) {
        // eslint-disable-next-line no-restricted-syntax
        for (const file of CROWDIN_FILES) {
            try {
                // eslint-disable-next-line no-await-in-loop
                const { data } = await axios.get(getDownloadURL(lang, file));
                const formatted = replaceObjectToArray('platform', data);
                const resultLocale = getEquivalent(lang);
                translations[resultLocale] = formatted;
                if (lang === BASE_LOCALE) {
                    // Keep english locale to save as source later
                    enTranslation = formatted;
                }
            } catch (e) {
                log(getDownloadURL(lang, file));
                log(e);
            }
        }
    }

    const TRANSLATIONS_PATH = path.resolve(LOCALES_DIR, 'translations.json');
    const SOURCE_PATH = path.resolve(LOCALES_DIR, 'source.json');
    await saveFile(TRANSLATIONS_PATH, translations);
    log(`File ${TRANSLATIONS_PATH} was successfully updated`);

    // Update source.json
    await saveFile(SOURCE_PATH, enTranslation);
    log(`File ${SOURCE_PATH} was successfully updated`);
}

/**
 * Entry point for uploading translations
 */
function uploadLocales() {
    CROWDIN_FILES.forEach(async (filename) => {
        try {
            const formData = getFormData(filename);
            await axios.post(BASE_UPLOAD_URL, formData, {
                // @ts-ignore
                contentType: 'multipart/form-data',
                headers: formData.getHeaders(),
            });
            log('Successfully uploaded');
        } catch (e) {
            log(e);
        }
    });
}

program
    .command('upload')
    .description('Upload locales')
    .action(() => uploadLocales());

program
    .command('download')
    .description('Download locales')
    .action(async () => {
        if (CROWDIN_FILES.length === 0) {
            log('Crowdin files must be specified in .twosky.json');
            return;
        }

        await downloadLocales();
    });

program.parse(process.argv);
