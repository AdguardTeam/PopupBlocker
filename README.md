# PopupBlocker [![Build Status](https://travis-ci.org/AdguardTeam/PopupBlocker.svg?branch=master)](https://travis-ci.org/AdguardTeam/PopupBlocker)
## Summary: 

PopupBlocker is a userscript that blocks all unwanted pop-up windows in different browsers.

## Key features:

 * Cross-browser support

Works in Chrome, Firefox, Edge, Safari, IE10+ etc, basically in any browser that supports userscript managers. Exceptions are some of the oldest browsers that do not support the API we use, the script may not be fully functional there.
		
 * Advanced pop-up detection

PopupBlocker doesn't apply the *filtering rules* approach to pop-up detection. Instead, it adds an additional layer on top of browser's native APIs that are used to create pop-ups. This way, these APIs can only be called when caused by a manual input, and not by pop-up/pop-under scripts. That allows to block pop-ups even on websites that try to bypass regular ad blockers by using WebRTC or varying the ad servers.
 
 * Restores the expected click behavior

Self-explanatory but important: if a click would cause a pop-up to show, not only the pop-up is blocked, but also the initial click is processed as it would be without the pop-up.
 
 * Invisible to other scripts

Other scripts on the page can not detect that PopupBlocker is being used, other than by actually trying to open a pop-up. This prevents any possible circumvention of PopupBlocker.
		
## Installation

Current release version (2.1.9): https://cdn.adguard.com/public/Userscripts/AdguardPopupBlocker/2.1/popupblocker.user.js

Curent beta version (2.1.9): https://cdn.adguard.com/public/Userscripts/Beta/AdguardPopupBlocker/2.1/popupblocker.user.js

All versions: https://github.com/AdguardTeam/PopupBlocker/releases

PopupBlocker is being developed by the same team that develops AdGuard, and AdGuard for Windows can serve as a userscript manager. If you are an AdGuard user, go to Settings – Extensions – Add Extension and enter the desired PopupBlocker .js file URL there. This way you can use it in literally any browser.

On the other hand, PopupBlocker is an independent project, you can use it with any other userscript manager like Greasemonkey, Tampermonkey or Violentmonkey. Make sure one of them is installed in your browser to be able to use the PopupBlocker (just enter the script URL into the address bar, it will be automatically detected by the manager).

## Reporting a bug

To report a bug, go to [this page](https://github.com/AdguardTeam/PopupBlocker/issues) and create a new issue.
		
## Translation	

You can help us with translating PopupBlocker into other languages! Our project on [OneSky](https://adguard.oneskyapp.com/collaboration/project?id=124184) is open for public contributions.

## Development build

Built automatically on every new commit:
https://AdguardTeam.github.io/PopupBlocker/popupblocker.user.js

Development builds have logging enabled and overrides significantly more browser apis to introspect behavior of popup/popunder script. It is not suitable for normal usage.

Unit test for dev build is [here](https://AdguardTeam.github.io/PopupBlocker/test/).

## How to build

For development build run:

    $ gulp dev

This will compile `popupblocker.user.js` file without minification.

For production build run:

    $ gulp release

This will compile `popupblocker.user.js` file with minification and without logging.
