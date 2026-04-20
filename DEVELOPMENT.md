# Development Guide

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
    - [Clone the Repository](#clone-the-repository)
    - [Install Dependencies](#install-dependencies)
    - [Build the Userscript](#build-the-userscript)
- [Development Workflow](#development-workflow)
    - [Build Targets](#build-targets)
    - [Available Scripts](#available-scripts)
    - [Build-time Environment](#build-time-environment)
    - [Running Tests](#running-tests)
    - [Linting](#linting)
- [Common Tasks](#common-tasks)
    - [Debugging the Options Page](#debugging-the-options-page)
    - [Manual Testing](#manual-testing)
    - [Managing Exclusions](#managing-exclusions)
    - [Working with Locales](#working-with-locales)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

## Prerequisites

| Tool    | Version | Notes                                |
| ------- | ------- | ------------------------------------ |
| Node.js | >= 18.x | LTS recommended                      |
| Yarn    | 1.x     | Yarn Classic (`npm install -g yarn`) |

Verify your setup:

```bash
node --version   # v18.x or higher
yarn --version   # 1.x
```

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/AdguardTeam/PopupBlocker.git
cd PopupBlocker
```

### Install Dependencies

```bash
yarn install
```

### Build the Userscript

Build a development version with logging enabled:

```bash
yarn userscript-dev
```

The output is written to the `build/` directory. Install the
resulting `build/userscript/popupblocker.user.js` in your
userscript manager (Tampermonkey, Violentmonkey, Greasemonkey,
or AdGuard).

## Development Workflow

### Build Targets

The build system supports four targets, each producing output
in the `build/` directory:

- **userscript** — the main popup blocker userscript
- **options** — standalone options page (Preact SPA)
- **tests** — browser-based Mocha test runner
- **bundle** — all of the above combined

### Available Scripts

| Command                   | Description                    |
| ------------------------- | ------------------------------ |
| `yarn userscript-dev`     | Build userscript with logging  |
| `yarn userscript-beta`    | Build userscript (beta)        |
| `yarn userscript-release` | Build userscript (minified)    |
| `yarn bundle:dev`         | Build all targets (dev)        |
| `yarn bundle:beta`        | Build all targets (beta)       |
| `yarn bundle:release`     | Build all targets (release)    |
| `yarn options-page`       | Build the options page         |
| `yarn tests`              | Build the test runner          |
| `yarn lint`               | Run ESLint                     |
| `yarn lint:md`            | Run Markdownlint               |
| `yarn increment`          | Bump patch version             |

You can also invoke the builder directly:

```text
cross-env NODE_ENV=<channel> ts-node tasks/builder --target=<target>
```

where

- `<channel>` is `dev | beta | release`;
- `<target>` is `userscript | options | tests | bundle`.

### Build-time Environment

The build channel is controlled by the `NODE_ENV` environment
variable. The Rollup config injects these compile-time flags
based on the channel:

| Flag       | `dev`   | `beta` / `release` | Purpose                      |
| ---------- | ------- | ------------------ | ---------------------------- |
| `DEBUG`    | `true`  | `false`            | Enable console logging       |
| `RECORD`   | `true`  | `false`            | Enable timeline recording    |
| `NO_PROXY` | `false` | `true`             | Disable extra proxy wrapping |

Beta and release builds are minified via Terser and have all
debug code stripped.

### Running Tests

Tests run in the browser — there is no CLI test runner.

1. Build the test runner:

    ```bash
    yarn tests
    ```

2. Open `build/tests.html` in a browser to execute the Mocha
   suite.

The test entry point is `test/index.ts`. Test files mirror the
`src/` structure (e.g., `test/events/verify.ts` tests
`src/events/verify.ts`). Mocks are located in `test/mocks/`.

### Linting

Run all linters before submitting changes:

```bash
yarn lint        # ESLint
yarn lint:md     # Markdownlint
```

Also verify that the project compiles without TypeScript errors:

```bash
yarn userscript-dev
```

See the [Code Quality](AGENTS.md#code-quality) section in
`AGENTS.md` for coding standards and ESLint configuration
details.

## Common Tasks

### Debugging the Options Page

1. Build the options page:

    ```bash
    yarn options-page
    ```

2. Serve the `build/` directory with a local HTTP server:

    ```bash
    cd build && npx serve .
    ```

3. In `src/pages/options/option-init.ts`, modify `isOptionsPage`
   to allow your local address and port.

4. Ensure the userscript (e.g., installed in AdGuard) also
   references the same local address.

5. Verify that your ad blocker is filtering the debug page so
   the userscript is active.

### Manual Testing

An easy way to verify popup blocking is to visit a test page
such as http://code.ptcong.com/better-js-popunder-script/ and
click anywhere on the page. Popups should be blocked with a
notification in the top-right corner.

### Managing Exclusions

**AdGuard exclusions** are manually maintained in
`/exclusions.ts`. Edit the file and rebuild.

**TinyShield exclusions** are auto-updated:

```bash
yarn update-tinyshield-websites
```

This downloads the latest TinyShield domains and writes them to
`tasks/tinyShieldWebsites.json`. Both sets of exclusions are
added to the userscript metadata (`@exclude`) during the build.

### Working with Locales

Translation strings live in `src/locales/`. To sync with the
Crowdin translation platform:

```bash
yarn locales:download   # Pull latest translations
yarn locales:upload     # Push source strings
```

## Troubleshooting

- **`ts-node` errors on build** — ensure you are using Node.js 18.x or higher.
  Older versions may lack required ES module support.

- **Tests page is blank** — make sure you opened
  `build/tests.html` (not `test/index.html`). The raw HTML
  file does not include the compiled test bundle.

- **Lint errors after pulling** — run `yarn install` to ensure
  dependencies are up to date, then `yarn lint`.

- **Build fails with missing module** — delete `node_modules/`,
  then run `yarn install` again.

- **Options page not loading settings** — the options page
  communicates with the userscript via message passing. Ensure
  the userscript is installed and active on the page you are
  testing.

## Additional Resources

- [AGENTS.md](./AGENTS.md) — code guidelines, architecture, and
  project structure
- [README.md](./README.md) — project overview and installation
- [CHANGELOG.md](./CHANGELOG.md) — release history
- [GitHub Issues](https://github.com/AdguardTeam/PopupBlocker/issues) —
  bug reports and feature requests
- [Crowdin](https://adguard.com/kb/miscellaneous/contribute/translate/program/) —
  translation contributions
