const exec = require('child_process').exec;

module.exports = (done) => {
    exec(`tsickle --externs=${options.tscc_path}/generated-externs.js -- -p tasks/tscc`, (err, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        done(err);
    });
};
