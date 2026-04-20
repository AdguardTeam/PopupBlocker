# Popup Blocker by AdGuard

Popup Blocker is a userscript that blocks unwanted pop-up and pop-under windows in any browser
that supports a userscript manager.

Unlike filter-list approaches, it wraps the browser's native APIs (`window.open`, `.click()`,
`.dispatchEvent()`, etc.) with an additional verification layer. Only calls triggered by genuine
user input are allowed through — automated pop-up scripts are blocked regardless of the domain or
technique they use.

## Key Features

- **Advanced detection** — blocks pop-ups at the API level, not via filter rules. Works even when
    pop-up scripts use WebRTC or rotate ad servers to bypass rule-based blockers.
- **Restores expected click behavior** — when a click would trigger a pop-up, the pop-up is
    blocked and the original click is still processed normally.
- **Invisible to other scripts** — the script cannot be detected by page scripts, which prevents
    circumvention attempts.
- **Cross-browser** — works in Chrome, Firefox, Edge, Safari, and any other browser that supports
    a userscript manager.

## Installation

Popup Blocker is a `.user.js` file. To use it, first install a userscript manager in your browser:

- [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Edge, Safari)
- [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)
- [Greasemonkey](https://www.greasespot.net/) (Firefox)
- **AdGuard** — go to **Settings → Extensions → Add Extension** and paste the script URL. Works in
    any browser AdGuard supports; the userscript comes pre-installed in AdGuard for Windows.

Then install Popup Blocker by clicking the link for your preferred channel:

| Channel     | URL                                                                           |
| ----------- | ----------------------------------------------------------------------------- |
| **Release** | https://userscripts.adtidy.org/release/popup-blocker/2.5/popupblocker.user.js |
| Beta        | https://userscripts.adtidy.org/beta/popup-blocker/2.5/popupblocker.user.js    |

Your userscript manager will detect the `.user.js` file and prompt you to confirm installation.

## How It Works

When a page attempts to open a pop-up or pop-under, Popup Blocker intercepts the call and checks
whether it was triggered by a real user action (a click, keyboard event, etc.). If no qualifying
user action preceded the call, the pop-up is blocked.

## Popup Notifications

When a pop-up is blocked, a notification appears in the top-right corner of the page. From the
notification you can:

- **Show [URL]** — allow the specific pop-up through once.
- **Continue blocking** — dismiss the notification and keep the pop-up blocked.
- **Allow popups for [domain]** — add the current site to the allowlist permanently.
- **Don't show this message on [domain]** — keep blocking pop-ups on this site but stop showing
  notifications.
- **Manage preferences** — open the options page.

## Options Page

The options page lets you manage two site lists:

| List         | Effect                                                                    |
| ------------ | ------------------------------------------------------------------------- |
| **Allowed**  | Pop-ups are allowed through on these domains without restriction.         |
| **Silenced** | Pop-ups are still blocked on these domains, but no notification is shown. |

Open the options page for your channel:

| Channel     | URL                                         |
| ----------- | ------------------------------------------- |
| **Release** | https://popupblocker.adguard.com/release/v1 |
| Beta        | https://popupblocker.adguard.com/beta/v1    |

To add a domain, navigate to the options page, select the **Allowed** or **Silenced** section,
enter the domain name, and click **Add**. To remove a domain, click the remove icon next to it.

## Reporting a Bug

Submit bug reports and feature requests on the
[GitHub Issues page](https://github.com/AdguardTeam/PopupBlocker/issues).

## Contributing Translations

Help translate Popup Blocker into other languages via
[Crowdin](https://adguard.com/kb/miscellaneous/contribute/translate/program/).

## Documentation

For build setup and contribution instructions, see [DEVELOPMENT.md](./DEVELOPMENT.md).

- [Changelog](./CHANGELOG.md)
- [LLM agent rules](./AGENTS.md)
