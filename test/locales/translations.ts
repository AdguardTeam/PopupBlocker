import source from '../../src/locales/source.json';
import translations from '../../src/locales/translations.json';

const { expect } = chai;

/**
 * Maps a catalog to its messages, ignoring translator descriptions.
 *
 * @param catalog messages from a single locale
 * @returns message text by key
 */
const getMessages = (catalog: Record<string, { message: string }>): Record<string, string> => Object.keys(catalog)
    .reduce((messages, key) => ({ ...messages, [key]: catalog[key].message }), {} as Record<string, string>);

describe('Locale catalogs', () => {
    // The build reads translations.json, while source.json is what gets uploaded for translation.
    it('keeps the English catalog in sync with source.json', () => {
        expect(getMessages(translations.en)).to.deep.equal(getMessages(source));
    });

    // A download before the upload would remove the key from both files, and the sync check
    // above would still pass if both files had the plural wording.
    it('ships the singular English blocked-popup message', () => {
        expect(translations.en.popup_text_one.message).to.match(/%numPopup% pop-up window$/);
    });

    // A wrong placeholder, such as {$numPopup} in Italian, hides the number of blocked popups.
    it('keeps the popup count placeholder in every blocked-popup message', () => {
        const catalogs: Record<string, Record<string, { message: string }>> = translations;
        Object.keys(catalogs).forEach((locale) => {
            ['popup_text', 'popup_text_one']
                .filter((key) => catalogs[locale][key])
                .forEach((key) => {
                    expect(catalogs[locale][key].message, `${locale} ${key}`).to.contain('%numPopup%');
                });
        });
    });
});
