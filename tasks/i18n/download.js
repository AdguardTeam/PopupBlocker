const onesky = require('onesky-utils');
const { promisify } = require('util');
const writeFile = promisify(require('fs').writeFile);

let base;

try {
    base = require('../../config/.key.js');
} catch(e) {

}

const locales = options.locales;

const makeOption = (locale) => {
    return Object.assign({}, base, {
        language: locale,
        fileName: options.sourceFile
    });
};

const getFile = (done) => {
    let obj = {};

    Promise.all(
        locales
            .map(makeOption)
            .map((option) => {
                return onesky.getFile(option);
            })
    )
        .then((contents) => {
            contents.forEach((content, index) => {
                try {
                    let parsed = JSON.parse(content);
                    obj[locales[index]] = parsed;
                } catch (e) { }
            });
            return writeFile(options.localesDir + '/translations.json', JSON.stringify(obj));
        })
        .then(() => {
            done();
        })
        .catch((error) => {
            console.log(error);
            done();
        });
};

module.exports = getFile;
