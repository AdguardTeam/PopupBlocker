import * as fs from 'fs-extra';
import chalk from 'chalk';
import { rollup } from 'rollup';
import { program } from 'commander';

import {
    BUNDLE_RESOURCE_PATHS,
    POPUPBLOCKER_CNAME,
    Target,
} from './constants';
import { createBuildTxt, copyFiles } from './utils';
import {
    BUILD_PATH,
    getUserscriptConfig,
    optionsPageConfig,
    testsConfig,
} from '../rollup.config';

const { log } = console;

const build = async (config, target: Target) => {
    log(chalk.yellow(`Building ${target}...`));

    const bundle = await rollup(config);

    const { output } = config;
    if (output && !Array.isArray(output)) {
        await bundle.write(output);
    }

    log(chalk.green(`Successfully built ${target}.`));
};

const buildUserscript = async (buildProperties = true, buildPath?: string) => {
    const userscriptConfig = getUserscriptConfig(buildPath);
    await build(userscriptConfig, Target.Userscript);

    // Write the build info for our CI
    // build.txt is only required for standalone userscript build
    if (buildProperties) {
        await createBuildTxt(BUILD_PATH);
        log(chalk.green('writing build properties complete'));
    }
};

const buildTests = async () => {
    await build(testsConfig, Target.Tests);
};

const buildOptionsPage = async () => {
    await build(optionsPageConfig, Target.OptionsPage);
};

const buildBundle = async () => {
    log(chalk.yellow('Start bundling...'));

    await buildUserscript(false, BUILD_PATH);
    await buildOptionsPage();
    await buildTests();

    BUNDLE_RESOURCE_PATHS.forEach((resource) => copyFiles(BUILD_PATH, resource.src, resource.dest));
    await fs.writeFile(`${BUILD_PATH}/.nojekyll`, '', 'utf-8');
    await fs.writeFile(`${BUILD_PATH}/CNAME`, POPUPBLOCKER_CNAME, 'utf-8');

    log(chalk.green('Bundle built successfully.'));
};

const tasksMap = {
    [Target.Userscript]: buildUserscript,
    [Target.OptionsPage]: buildOptionsPage,
    [Target.Tests]: buildTests,
    [Target.Bundle]: buildBundle,
};

const runTask = async (task: () => Promise<void>) => {
    try {
        await fs.remove(BUILD_PATH);
        await task();
    } catch (e) {
        log(chalk.redBright(`Failed at task '${task.name}':`));
        log(chalk.red(e.toString()));
    }
};

program
    .description('Build target')
    .option('--target <string>')
    .action(async (options) => {
        const { target } = options;
        await runTask(tasksMap[target]);
    });

program.parse(process.argv);
