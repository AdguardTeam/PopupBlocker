const onesky = require('onesky-utils');
const fs = require('fs');

let base;

try {
    base = require('../../config/.key.js');
} catch(e) {

}

const postFile = (done) => {
    const file = fs.readFileSync('src/locales/en.json').toString();

    const _options = {
      language: 'en',
      fileName: options.sourceFile,
      format: 'HIERARCHICAL_JSON',
      content: file,
      keepStrings: false
    };

    onesky.postFile(Object.assign({}, base, _options)).then((content) => {
        done();
    }).catch((error) => {
        console.log('errored');
        console.log(error);
        done();
    });
};

module.exports = postFile;
