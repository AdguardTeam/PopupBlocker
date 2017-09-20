/**
 * @fileoverview Replaces placeholders in userscript meta file into appropriate values,
 * according to the build channel stored in the global `options` object. 
 */
const gulp = require('gulp');
const insert = require('gulp-insert');
const rename = require('gulp-rename');

const replaceMeta = (config) => {
    return (text) => {
        return text.replace(/^\/\/\s@name(?:\:[\w-]*)?\s.*$/gm, (match) => (match + ' ' + config['NAME_SUFFIX']))
            .replace(/^(\/\/\s@.*)\[([A-Za-g_]*?)\][\s\S]*\n/gm, (_, c1, c2) => {
            	let rep = config[c2];
            	if (rep) {
            		return c1 + config[c2];
            	} else {
            		return '';
            	}
            });
    };
};

module.exports = () => {
    return gulp.src('meta.js')
        .pipe(insert.transform(replaceMeta(options.metaConfig)))
        .pipe(rename(options.metaName))
        .pipe(gulp.dest(options.outputPath));
};
