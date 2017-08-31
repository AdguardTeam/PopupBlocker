# PopupBlocker [![Build Status](https://travis-ci.org/AdguardTeam/PopupBlocker.svg?branch=master)](https://travis-ci.org/AdguardTeam/PopupBlocker)
PopupBlocker is a userscript that blocks unwanted popups.

 - Cross-browser support
 - Advanced popup detection
 - Restores expected click behavior

Current release version: https://cdn.adguard.com/public/Userscripts/AdguardPopupBlocker/2.0/popupblocker.user.js

Curent beta version: https://cdn.adguard.com/public/Userscripts/Beta/AdguardPopupBlocker/2.0/popupblocker.user.js

## How does it work?

It adds a layer of check on top of browser's native apis, that are used to create popups, so that it can be called _only_ when it is caused by a human input, not by popup/popunder scripts. Instead of checking popup url with _filter rules_, it does a _generic_ behavioral detection of popups. In virtue of this, it can block popups on websites which tries (They are still blockable with _site-specific_ adblock filter rules) to bypass adblocker by using revolving adservers or using WebRTC, without any specific treatment. However, of course, this userscript should and strives to block all unwanted popups without the help of adblockers. 

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
