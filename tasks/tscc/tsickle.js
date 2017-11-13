const tsickleMain = require('./third-party/tsickle/main').main;

module.exports = (done) => {
    console.log(tsickleMain(`--externs=${options.tscc_path}/generated-externs.js --typed -- -p tasks/tscc`.split(' ')));
    done();
};
