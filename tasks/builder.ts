import * as fs from 'fs-extra';
import chalk from 'chalk';
import { rollup } from 'rollup';
import { program } from 'commander';
import { BUNDLE_RESOURCE_PATHS, Target } from './constants';
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

const buildUserscript = async (buildPath?: string) => {
    const userscriptConfig = getUserscriptConfig(buildPath);
    await build(userscriptConfig, Target.Userscript);

    // Write the build info for our CI
    await createBuildTxt(BUILD_PATH);
    log(chalk.green('writing build properties complete'));
};

const buildTests = async () => {
    await build(testsConfig, Target.Tests);
};

const buildOptionsPage = async () => {
    await build(optionsPageConfig, Target.OptionsPage);
};

const buildBundle = async () => {
    log(chalk.yellow('Start bundling...'));

    await buildUserscript(BUILD_PATH);
    await buildOptionsPage();
    await buildTests();

    BUNDLE_RESOURCE_PATHS.forEach((resource) => copyFiles(BUILD_PATH, resource.src, resource.dest));

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
