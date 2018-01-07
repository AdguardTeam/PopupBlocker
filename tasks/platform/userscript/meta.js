import gulp from 'gulp';
import insert from 'gulp-insert';
import InlineResource from 'inline-resource-literal';
import streamToPromise from 'stream-to-promise';

function getLocaleSuffix(locale) {
    return locale === 'en' ? '' : `:${locale}`;
}

async function meta(options) {

    const translationsStringified = await streamToPromise(
        gulp.src('src/locales/translations.json')
    );

    const translations = JSON.parse(translationsStringified);

    const locales = Object.keys(translations);

    const names = locales.map((locale) => {
        return `// @name${getLocaleSuffix(locale)} ${translations[locale]["name"]}`
    }).join('\n');

    const descriptions = locales.map((locale) => {
        return `// @description${getLocaleSuffix(locale)} ${translations[locale]["description"]}`;
    }).join('\n');

    const inline = (new InlineResource({
        NAME: {
            path: "meta.name.js",
            buffer: new buffer(names)
        },
        DESCRIPTIONS: {
            path: "meta.description.js",
            buffer: new Buffer(descriptions)
        }
    })).inline;

    return gulp.src('src/platform/userscript/meta.js')
        .pipe(insert.transform(inline))
}

export default meta;