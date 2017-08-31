const onesky = require('onesky-utils');
const { promisify } = require('util');
const writeFile = promisify(require('fs').writeFile);

const base = require('../../config/.key.js');

const locales = options.locales;

const makeOption = (locale) => {
    return Object.assign({}, base, {
        language: locale,
        fileName: options.sourceFile
    });
};

const writeOne = (content, index) => {
    let locale = locales[index];
    return writeFile(options.localesDir + '/' + locale + '.json', content);
};

const writeMany = (contents) => {
    return Promise.all(contents.map(writeOne));
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
