# PopupBlocker [![Build Status](https://travis-ci.org/AdguardTeam/PopupBlocker.svg?branch=master)](https://travis-ci.org/AdguardTeam/PopupBlocker)
PopupBlocker is a userscript that blocks unwanted popups.

## How is this work?

It adds a layer of check on top of browser's native apis, that are used to create popups, so that it can be called only when it is caused by a human input, not by popup/popunder scripts.

## Development build

Built automatically on every new commit:
https://AdguardTeam.github.io/PopupBlocker/popupblocker.user.js

Unit test for dev build [here](https://AdguardTeam.github.io/PopupBlocker/test/)

## How to build

For development build run:

    $ gulp dev

This will compile `popupblocker.user.js` file without minification.

For production build run:

    $ gulp release

This will compile `popupblocker.user.js` file with minification.
