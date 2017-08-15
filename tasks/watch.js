const gulp = require('gulp');

module.exports = () => {
    const onerror = (error) => { console.log(error.toString()); };
    const onchange = (event) => { console.log('File ' + event.path + ' was ' + event.type + ', building...'); };
    gulp.watch('src/**/*', ['dev'])
        .on('change', onchange)
        .on('error', onerror);
    gulp.watch('test/**/*.ts', ['build-test'])
        .on('change', onchange)
        .on('error', onerror);
};
