# PopupBlocker [![Build Status](https://travis-ci.org/AdguardTeam/PopupBlocker.svg?branch=master)](https://travis-ci.org/AdguardTeam/PopupBlocker)
Popup blocking userscript


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
