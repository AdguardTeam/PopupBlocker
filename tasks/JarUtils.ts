import rm  = require('rimraf');

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

import log from 'fancy-log';

import { spawn, ChildProcess } from 'child_process';
import { Stream } from 'stream';


/**
 * Closure stylesheets compiler
 */
export default class JarUtils extends Stream.Readable {

    public static STYLESHEETS_PATH = 'tasks/css/third_party/closure_stylesheets.jar';
    public static TEMPLATES_PATH = 'tasks/soy/third_party/SoyToJsSrcCompiler.jar';

    constructor(
        private jarPath,
        private args:string[]
    ) {
        super({objectMode: true});
    }

    public async _read() {
        const process = spawn(this.jarPath, this.args);

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
            throw new Error('unknown error');
        }

        if (stdOutData.trim().length > 0) {
            const file = new Vinyl({
                path: '',
                content: new Buffer(stdOutData)
            });

            this.push(file);
        }
    }
}
