const BUILD_DIR = 'build';
const USERSCRIPT_NAME = 'popupblocker';
const METADATA_NAME = 'popupblocker';
const METADATA_TEMPLATE_NAME = 'meta.template.js';
const POPUPBLOCKER_CNAME = 'popupblocker.adguard.com';

enum Target {
    Userscript = 'userscript',
    OptionsPage = 'options',
    Tests = 'tests',
    Bundle = 'bundle',
}

// Used in userscript metadata
const RESOURCE_PATHS = [
    './assets/fonts/bold/OpenSans-Bold.woff',
    './assets/fonts/bold/OpenSans-Bold.woff2',
    './assets/fonts/regular/OpenSans-Regular.woff',
    './assets/fonts/regular/OpenSans-Regular.woff2',
    './assets/fonts/semibold/OpenSans-Semibold.woff',
    './assets/fonts/semibold/OpenSans-Semibold.woff2',
];

// Tests build and resources map to copy into bundle
const BUNDLE_RESOURCE_PATHS = [
    // Build results
    { src: 'test/build/*', dest: '/test/build' },
    // Tests page
    { src: 'test/index.html', dest: '/test' },
    // External resources
    { src: 'test/third-party/*', dest: '/test/third-party' },
    { src: 'node_modules/mocha/mocha.*', dest: '/node_modules/mocha' },
    { src: 'node_modules/chai/chai.js', dest: '/node_modules/chai' },
];

const USERSCRIPT_ICON_RELATIVE_PATH = './assets/128.png';

export {
    BUILD_DIR,
    USERSCRIPT_NAME,
    METADATA_NAME,
    METADATA_TEMPLATE_NAME,
    POPUPBLOCKER_CNAME,
    Target,
    RESOURCE_PATHS,
    BUNDLE_RESOURCE_PATHS,
    USERSCRIPT_ICON_RELATIVE_PATH,
};
