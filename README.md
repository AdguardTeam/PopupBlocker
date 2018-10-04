# Popup Blocker by AdGuard [![Build Status](https://travis-ci.org/AdguardTeam/PopupBlocker.svg?branch=master)](https://travis-ci.org/AdguardTeam/PopupBlocker)
## Summary: 

Popup Blocker by AdGuard is a userscript that blocks all unwanted pop-up windows in different browsers.

## Key features:

 * Cross-browser support

Works in Chrome, Firefox, Edge, Safari, IE10+ etc, basically in any browser that supports userscript managers. Exceptions are some of the oldest browsers that do not support the API we use, the script may not be fully functional there.
		
 * Advanced pop-up detection

Popup Blocker doesn't apply the *filtering rules* approach to pop-up detection. Instead, it adds an additional layer on top of browser's native APIs that are used to create pop-ups. This way, these APIs can only be called when caused by a manual input, and not by pop-up/pop-under scripts. That allows to block pop-ups even on websites that try to bypass regular ad blockers by using WebRTC or varying the ad servers.
 
 * Restores the expected click behavior

Self-explanatory but important: if a click would cause a pop-up to show, not only the pop-up is blocked, but also the initial click is processed as it would be without the pop-up.
 
 * Invisible to other scripts

Other scripts on the page can not detect that Popup Blocker is being used, other than by actually trying to open a pop-up. This prevents any possible circumvention of Popup Blocker.
		
## Installation

Current release version (2.5.7): https://cdn.adguard.com/public/Userscripts/AdguardPopupBlocker/2.5/popupblocker.user.js

Curent beta version (2.5.7): https://cdn.adguard.com/public/Userscripts/Beta/AdguardPopupBlocker/2.5/popupblocker.user.js

All versions: https://github.com/AdguardTeam/PopupBlocker/releases

Popup Blocker is being developed by the same team that develops AdGuard, and AdGuard for Windows can serve as a userscript manager. If you are an AdGuard user, go to Settings – Extensions – Add Extension and enter the desired Popup Blocker .js file URL there. This way you can use it in literally any browser.

On the other hand, Popup Blocker is an independent project, you can use it with any other userscript manager like Greasemonkey, Tampermonkey or Violentmonkey. Make sure one of them is installed in your browser to be able to use the Popup Blocker (just enter the script URL into the address bar, it will be automatically detected by the manager).

## Options page

From userscript version 2.5.0 and higher, you can manage a list of whitelisted domains and silenced domain on a dedicated [options page](https://popupblocker.adguard.com/options.html).

## Reporting a bug

To report a bug, go to [this page](https://github.com/AdguardTeam/PopupBlocker/issues) and create a new issue.
		
## Translation	

You can help us with translating Popup Blocker into other languages! Our project on [OneSky](https://adguard.oneskyapp.com/collaboration/project?id=124184) is open for public contributions.

## Development build

Built automatically on every new commit:
https://popupblocker.adguard.com/popupblocker.user.js

Development builds have logging enabled and overrides significantly more browser apis to introspect behavior of popup/popunder script. It is not suitable for normal usage.

Unit test for dev build is [here](https://popupblocker.adguard.com/test/).

## How to build

Install `gulp` and `ts-node` globally by running:
```
npm install -g gulp ts-node
```
Install local dependencies by runnning:
```
yarn install
```

To build, run:
```
$ gulp <channel>-<target>[-[un]minified]
```
or in a minimist style:
```
gulp build --channel=<channel> --target=<target> --minify=(boolean) --use_adg_domain
```
Available channels are: `dev`, `beta`, `release`.
Available targets are: `userscript`, `chrome`, `webext`, `userscript-settings`.
Use `userscript-settings` option to build an `options.js` file only.

`minify` option will override default minification settings for `channel`.

`use_adg_domain` option will make userscript builds to use urls in `adguard.com` domain as urls of `@resource` meta tags.

Developement builds are not minified, and will print logs into the browser console.

Beta and release builds will be minified and have all logging codes stripped out.
For minified builds, ensure that you have Java installed and have necessary environment variables.

## How to debug the options page
Build using the `userscript-settings` option, go to the build folder via `cd` command, then run local server:
```
python -m SimpleHTTPServer
```
Open http://localhost:8000/options.html

If you use the other address or port, you have to modify the `src/platform/userscript/content_script.ts` file with you address and port.
After that, ensure, that userscript (for example, in AG) contains this address and port too.

To see the options page, ensure, that AG is run and filters your debug page.

## How to test

An easy way to test the script is to visit http://code.ptcong.com/better-js-popunder-script/

Just click anywhere on that page to get a popunder, or use specific links to get popup/popunder/tabup/etc.

Expected behavior: new windows get blocked with a notification in the top right corner. 
