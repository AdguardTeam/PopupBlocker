const onesky = require('onesky-utils');
const fs = require('fs');

const base = require('../../config/.key.js');

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
