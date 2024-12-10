# Popup Blocker by AdGuard

## Summary:

Popup Blocker by AdGuard is a userscript that blocks all unwanted pop-up windows in different browsers.

## Key features:

- Cross-browser support

Works in Chrome, Firefox, Edge, Safari, IE10+ etc, basically in any browser that supports userscript managers. Exceptions are some of the oldest browsers that do not support the API we use, the script may not be fully functional there.

- Advanced pop-up detection

Popup Blocker doesn't apply the _filtering rules_ approach to pop-up detection. Instead, it adds an additional layer on top of browser's native APIs that are used to create pop-ups. This way, these APIs can only be called when caused by a manual input, and not by pop-up/pop-under scripts. That allows to block pop-ups even on websites that try to bypass regular ad blockers by using WebRTC or varying the ad servers.

- Restores the expected click behavior

Self-explanatory but important: if a click would cause a pop-up to show, not only the pop-up is blocked, but also the initial click is processed as it would be without the pop-up.

- Invisible to other scripts

Other scripts on the page can not detect that Popup Blocker is being used, other than by actually trying to open a pop-up. This prevents any possible circumvention of Popup Blocker.

## Installation

- **Current release version**: https://userscripts.adtidy.org/release/popup-blocker/2.5/popupblocker.user.js

- Current beta version: https://userscripts.adtidy.org/beta/popup-blocker/2.5/popupblocker.user.js

Popup Blocker is being developed by the same team that develops AdGuard, and AdGuard for Windows can serve as a userscript manager. If you are an AdGuard user, go to Settings – Extensions – Add Extension and enter the desired Popup Blocker .js file URL there. This way you can use it in literally any browser.

On the other hand, Popup Blocker is an independent project, you can use it with any other userscript manager like Greasemonkey, Tampermonkey or Violentmonkey. Make sure one of them is installed in your browser to be able to use the Popup Blocker (just enter the script URL into the address bar, it will be automatically detected by the manager).

## Options page

You can manage a list of allowlisted domains and silenced domain on a dedicated options page:
* **Current release version**: https://popupblocker.adguard.com/release/v1
* Current beta version: https://popupblocker.adguard.com/beta/v1

## Reporting a bug

To report a bug, go to [this page](https://github.com/AdguardTeam/PopupBlocker/issues) and create a new issue.

## Translation

You can help us with translating Popup Blocker into other languages! Our project on [Crowdin](https://adguard.com/kb/miscellaneous/contribute/translate/program/) is open for public contributions.

## Development build

Development builds have logging enabled and overrides significantly more browser apis to introspect behavior of popup/popunder script. It is not suitable for normal usage.

Unit test for dev build is [here](https://popupblocker.adguard.com/release/v1/test/).

## How to build

To build the project, follow these steps:

Install local dependencies by running the following command in the terminal:

```
yarn install
```

To build, run the following command in the terminal:

```
$ NODE_ENV=<channel> ts-node tasks/builder --target=<target>
```

Replace `channel` with the desired channel, which can be `dev`, `beta`, or `release`. Also, replace `target` with the desired build target, which can be

- `userscript` – build userscript for a specified channel;
- `options` – build options page, which is a standalone page, that provides the user with convenient way of managing allowed and silenced websites;
- `tests` – build tests;
- `bundle` – build and bundle all of the above for a specified channel.

Alternatively, you can run the following commands in a minimist style:

```
yarn userscript-<channel>
yarn options-page
yarn tests
yarn bundle:dev
yarn bundle:beta
yarn bundle:release
```

If you are building for development, note that the output will not be minified and will contain logs in the browser console.

Beta and release builds will be minified, and all logging codes will be stripped out.

## How to debug the options page

Build using the options page, go to the build folder via `cd` command and run local server of you choice

```
yarn options-page
```

Modify `isOptionsPage` at `option-init.ts` to allow specific address and port.
After that, ensure, that userscript (for example, in AG) contains this address and port too.

To see the options page, ensure, that AG filters your debug page.

## How to test

An easy way to test the script is to visit http://code.ptcong.com/better-js-popunder-script/

Just click anywhere on that page to get a popunder, or use specific links to get popup/popunder/tabup/etc.

Expected behavior: new windows get blocked with a notification in the top right corner.

## How to deploy options page

Options page is deployed via GitHub Pages with a manual actions `Deploy popup blocker beta` and `Deploy popup blocker release` for `beta` and `release` versions respectively.

## Exclusions Meta Information

`AdGuard` exclusion websites are manually added to the meta information in the `/exclusions.ts` file. For `TinyShield` websites, the process is automated using a script. Here is how it works:

1. **Update TinyShield Websites**:

- Run the script to update the `TinyShield` websites:

  ```bash
  yarn update-tinyshield-websites
  ```

- This script downloads the latest `TinyShield` websites from the TinyShield Meta file at `https://raw.githubusercontent.com/List-KR/tinyShield/refs/heads/main/sources/banner.txt`.

- The script updates the `/tinyShieldWebsites.json` file with the latest `TinyShield` websites.

1. **Build Process**:

- During the build process, the websites listed in `tasks/tinyShieldWebsites.json` and in `/exclusions.ts` are automatically added to the meta information with `//@exclude` prefix.

We exclude TinyShield websites in the metadata due to errors. For more details, refer to [this issue](https://github.com/List-KR/tinyShield/issues/1).
