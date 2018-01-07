const gulp = require('gulp');
const runSequence = require('run-sequence');
const path = require('path');
const fs = require('fs');


/**********************************************************************************************/
/********************************** Global settings object ************************************/
/**********************************************************************************************/



/**********************************************************************************************/
/********************************** JS Transformer Settings ***********************************/
/**********************************************************************************************/

const opts_cc         = require('./tasks/options/cc');
const opts_rollup     = require('./tasks/options/rollup');
const opts_uglify     = require('./tasks/options/uglify');


/**********************************************************************************************/
/********************************** Atomic Tasks **********************************************/
/**********************************************************************************************/



/**********************************************************************************************/
/********************************** Main Tasks ************************************************/
/**********************************************************************************************/

gulp.task('dev',
	(done) => {

	}
);

gulp.task('dev-ghpages',
	(done) => {

	}
);

gulp.task('dev-noevent',
	(done) => {

	}
);

gulp.task('release',
	(done) => {

	}
);

gulp.task('release-no-minification',
	(done) => {

	}
);

class Builder {
	constructor(options) {
		this.options = options;

		this.inlineResource = (new InlineResource(options.resources)).inline;
	}

	async rollup() {
		const bundlePageScript = gulp.src('src/**/*.ts')
				.pipe(preprocess({ context: this.options.preprocessContext }))
				.pipe(rollup(options.rollupOptionsPageScript))
				.pipe(insert.transform(this.inlineResource))
	
		const bundleContentScript = gulp.src('src/**/*.ts')
				.pipe(preprocess({ context: this.options.preprocessContext }))
				.pipe(rollup(options.rollupOptionsContentScript))
				.pipe(insert.transform(this.inlineResource));
	
		const [pageScriptBuffer] =
			await Promise.all(streamToPromise(bundlePageScript), streamToPromise(bundleContentScript));
	
		const inlinePageScript = (new InlineResource({
			PAGE_SCRIPT: {
				path: `${options.target}_page_script.js`,
				buffer: pageScriptBuffer
			}
		})).inline;
	
		return buildContentScript
			.pipe(insert.transform(inlinePageScript))
			.pipe(rename('content_script.js'));
	}

	async tscc() {
		const options = this.options;
	
		await streamToPromise(
			gulp.src('src/**/*.ts')
				.pipe(preprocess({ context: options.preprocessContext }))
				.pipe(gulp.dest(this.options.tsicklePath))
		);

		const exitCode = tsickleMain(
			`--externs=${options.tsccPath}/generated-externs.js --typed -- -p tasks/tscc`
				.split(' ')
		);

		if (exitCode === 1) { throw 'tsickle error'; }

		/**
		 * https://github.com/angular/tsickle/issues/481
		 * tsickle uses module's relative path as a module name, 
		 * and it occasionally breaks source code on Windows by using an absolute path
		 * instead of a relative path, especially when using --typed option.
		 * We fix it by applying regexes to replace `goog.forwardDeclare(C_.absolute.path.to.module.PopupBlocker.build.tsickle.index)`
		 * into `goog.forwardDeclare('build.tsc.index').
		 */
		const reWorkaroundTsickleBug = new RegExp(`(goog.[A-Za-z]*\\(")(?:.*?\\.)?${options.sourcePath}\\.`, 'g');
		const tsickleWorkaround = (content) => {
			return content.replace(reWorkaroundTsickleBug, (_, c1, c2) => {
				return `${c1}${options.outputPath}.${options.tsccDir}.`;
			});
		};

		await streamToPromise(
			gulp.src(`${options.tsccPath}/**/*.js`)
				.pipe(insert.transform(tsickleWorkaround))
				.pipe(insert.transform(inline))
				.pipe(gulp.dest(options.tscc_path))
		);

		const pageScriptFilter = filter(['*page_script.js'], { passthrough: false, restore: true });

		const pageScriptBuffer = await streamToPromise(
			ccPlugin(options.cc_options)
				.src()
				.pipe(insert.transform(removeCcExport))
				.pipe(pageScriptFilter)
		);

		const inlinePageScript = (new InlineResource({
			PAGE_SCRIPT: {
				path: `${options.target}_page_script.min.js`,
				buffer: pageScriptBuffer 
			}
		})).inline;

		return filterPageScript.restore
			.pipe(insert.transform(inlinePageScript))
	}
}