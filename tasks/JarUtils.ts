import Vinyl = require('vinyl');
import path = require('path');

import gulp = require('gulp');

import postcss = require('gulp-postcss');

import imp = require('postcss-partial-import');
import svg = require('postcss-svg');
import mixins = require('postcss-mixins');
import cssnext = require('postcss-cssnext');
import nesting = require('postcss-nested');

import Reservoir from './Reservoir';

import log = require('fancy-log');

import { spawn } from 'child_process';
import { Stream } from 'stream';

/**
 * Wrapper arround closure tools JARs.
 */
export default class JarUtils extends Stream.Transform {

    public static STYLESHEETS_PATH = 'third_party/closure_stylesheets.jar';
    public static TEMPLATES_PATH = 'third_party/SoyToJsSrcCompiler.jar';
    public static MSG_EXTRACTOR_PATH = 'third_parth/SoyMsgExtractor.jar';

    constructor(
        private jarPath,
        private args:string[],
        private outPath:string = 'dummy'
    ) {
        super({ objectMode: true });

        process.nextTick((function() {
            let stdInStream = new Stream.Readable({
                read: function() {
                    return new Vinyl();
                }
            });
            stdInStream.pipe(this);
            stdInStream.push(null);
        }).bind(this));
    }

    _transform(file, enc, cb) {
        cb();
    }

    async _flush(cb) {

        const process = spawn('java', ['-jar', this.jarPath,  ...this.args]);

        let stdOutData = '';
        let stdErrData = '';

        process.stdout.on('data', (data) => {
            stdOutData += data;
        });

        process.stderr.on('data', (data) => {
            stdErrData += data;
        });

        const closed = new Promise((resolve) => {
            process.on('close', resolve);
        });
        const stdOutEnded = new Promise((resolve) => {
            process.stdout.on('end', () => { resolve() });
        });
        const stdErrEnded = new Promise((resolve) => {
            process.stderr.on('end', () => { resolve() });
        });

        const [code] = await Promise.all([closed, stdOutEnded, stdErrEnded]);

        if (stdErrData.trim().length > 0) {
            log.warn(stdErrData);
        }

        if (code !== 0) {
            this.emit('error', `unknown error from ${this.jarPath}`);
            cb();
            return;
        }

        if (stdOutData.trim().length > 0) {
            const file = new Vinyl({
                path: this.outPath,
                contents: new Buffer(stdOutData)
            });
            this.push(file);
        }
        cb();
    }
}
