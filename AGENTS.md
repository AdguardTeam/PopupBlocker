# AGENTS.md — Popup Blocker by AdGuard

## Table of Contents

- [Project Overview](#project-overview)
- [Technical Context](#technical-context)
- [Project Structure](#project-structure)
- [Build And Test Commands](#build-and-test-commands)
- [Contribution Instructions](#contribution-instructions)
- [Code Guidelines](#code-guidelines)
    - [System Design](#system-design)
    - [Architecture](#architecture)
    - [Code Quality](#code-quality)
    - [Testing](#testing)
    - [Dependency Management](#dependency-management)
    - [Configuration & Documentation](#configuration--documentation)
    - [Markdown Formatting](#markdown-formatting)

## Project Overview

Popup Blocker by AdGuard is a **userscript** that blocks unwanted pop-up
and pop-under windows in web browsers. Instead of using filtering rules,
it wraps browser APIs (`window.open`, `.click()`, `.dispatchEvent()`,
etc.) with an additional verification layer that only allows calls
triggered by genuine user input. It works in any browser that supports
userscript managers (Tampermonkey, Violentmonkey, Greasemonkey, or
AdGuard).

The project also includes a standalone **options page** (Preact SPA)
that lets users manage allowlisted and silenced domains.

## Technical Context

- **Language**: TypeScript (ES2015 target), compiled with Rollup
- **Primary Dependencies**: Preact (UI), `@adguard/translate`
  (i18n), tslib
- **Storage**: Greasemonkey userscript API (`GM_getValue` /
  `GM_setValue`)
- **Testing**: Mocha + Chai (browser-based test runner)
- **Linting**: ESLint (airbnb-typescript config) + Markdownlint
- **Target Platform**: Web browsers via userscript managers; the
  options page is deployed as a static site via GitHub Pages
- **Project Type**: Userscript (browser extension–like)
- **Performance Goals**: N/A — the script must be invisible to page
  scripts and add negligible overhead to page load
- **Constraints**: Must not be detectable by other scripts on the
  page; must work across all major browsers
- **Scale/Scope**: Public userscript used by AdGuard users worldwide

## Project Structure

```text
├── AGENTS.md                   # AI agent guidelines (this file)
├── README.md                   # Project overview and setup
├── CHANGELOG.md                # Release history
├── DEVELOPMENT.md              # Developer setup and workflow guide
├── package.json                # Dependencies and npm scripts
├── tsconfig.json               # TypeScript configuration
├── rollup.config.ts            # Rollup build configuration
├── postcss.config.ts           # PostCSS plugin setup
├── .eslintrc.js                # ESLint configuration
├── .markdownlint.json          # Markdownlint configuration
├── exclusions.ts               # AdGuard exclusion websites
├── locales.ts                  # Locale upload/download script
├── bamboo-specs/               # CI/CD pipeline definitions
├── src/
│   ├── main.ts                 # Core orchestration — wires all layers
│   ├── on-blocked.ts           # Blocked-popup notification logic
│   ├── mock-window.ts          # Mock window for blocked popups
│   ├── page-script-namespace.ts # Global `adguard` namespace
│   ├── init/                   # Entry points (userscript, page-script)
│   ├── dom/                    # Browser API wrappers (open, click, …)
│   ├── events/                 # Event verification and analysis
│   ├── proxy/                  # Proxy/interception service layer
│   ├── timeline/               # Heuristic timeline engine
│   ├── observers/              # DOM mutation and overlay observers
│   ├── messaging/              # Cross-frame message hub
│   ├── storage/                # Settings DAO and GM API wrapper
│   ├── pages/                  # Options and notification pages (Preact)
│   ├── ui/                     # Alert and toast UI components
│   ├── i18n/                   # Internationalization utilities
│   ├── shared/                 # Protected APIs, utilities, constants
│   ├── types/                  # TypeScript type definitions
│   ├── assets/                 # Fonts and icons
│   └── locales/                # Source and translated strings (JSON)
├── tasks/                      # Build scripts and metadata generation
│   ├── builder.ts              # Build orchestrator (rollup invocations)
│   ├── metadata/               # Userscript metadata plugin
│   └── ...                     # Channels, paths, constants, utils
└── test/                       # Unit tests (Mocha + Chai)
    ├── index.ts                # Test entry point
    ├── events/                 # Event verification tests
    ├── storage/                # Storage migration tests
    ├── timeline/               # Timeline heuristic tests
    ├── shared/                 # Shared utility tests
    └── mocks/                  # GM API and other mocks
```

## Build And Test Commands

| Command                  | Purpose                              |
| ------------------------ | ------------------------------------ |
| `yarn install`           | Install dependencies                 |
| `yarn lint`              | Run ESLint on the codebase           |
| `yarn lint:md`           | Run Markdownlint on Markdown files   |
| `yarn userscript-dev`    | Build userscript (dev, with logging) |
| `yarn userscript-beta`   | Build userscript (beta)              |
| `yarn userscript-release`| Build userscript (release, minified) |
| `yarn bundle:dev`        | Build all targets (dev)              |
| `yarn bundle:beta`       | Build all targets (beta)             |
| `yarn bundle:release`    | Build all targets (release)          |
| `yarn options-page`      | Build the options page               |
| `yarn tests`             | Build the browser test runner        |

Tests are built into an HTML file and run in a browser — there is no
CLI test runner. After running `yarn tests`, open the generated
`build/tests.html` in a browser to execute the Mocha suite.

## Contribution Instructions

- You MUST verify your changes with the linter and type checker.

    Use the following commands:
    - `yarn lint` to run ESLint
    - `yarn lint:md` to run Markdownlint on Markdown files
    - `yarn userscript-dev` to check for TypeScript compilation errors

- You MUST update the unit tests for changed code.

- You MUST build the tests with `yarn tests` and verify manually in a
  browser that your changes do not break existing functionality.

- When making changes to the project structure, ensure the Project
  Structure section in `AGENTS.md` is updated and remains valid.

- If the prompt essentially asks you to refactor or improve existing
  code, check if you can phrase it as a code guideline. If it's
  possible, add it to the relevant Code Guidelines section in
  `AGENTS.md`.

- After completing the task you MUST verify that the code you've
  written follows the Code Guidelines in this file.

## Code Guidelines

### System Design

Design for a browser extension (userscript):

- The script runs in a sandboxed environment with limited APIs —
  interact with the page only through the Greasemonkey/Tampermonkey
  API and standard DOM APIs. Do not assume access to browser
  extension APIs (e.g., `chrome.*`, `browser.*`).
- Keep the script lightweight — every added size slows down page
  load. Avoid bundling large dependencies.
- Separate concerns across contexts: the **userscript entry**
  (`src/init/userscript-entry.ts`) bootstraps the environment; the
  **page script** (`src/init/page-script.ts`) runs in the page's JS context
  and wraps native APIs; the **options page** is a standalone Preact
  SPA. Do not put business logic in the options page; it communicates
  with the userscript via message passing.
- Handle lifecycle correctly — the userscript is injected once per
  page load. Capture references to native APIs immediately in
  `src/shared/protected-api.ts` before page scripts can override
  them.
- Use message passing (`InterContextMessageHub`) between parent and
  child frame contexts; never share mutable state directly across
  frames. Treat each frame context as an independent process.
- React to browser events asynchronously; never block the main
  thread of the page.
- The script MUST be invisible to other scripts — do not expose
  globals, do not modify observable behavior of native APIs beyond
  what is necessary for popup blocking, and ensure wrapped functions
  pass native-function detection checks.

### Architecture

Universal design principles:

- **Separation of Concerns** — each module handles one aspect of
  the system (e.g., `src/dom/` only wraps DOM APIs,
  `src/timeline/` only runs heuristics)
- **Single Responsibility Principle** — every file, class, or
  function has one reason to change
- **Dependency Direction** — dependencies point inward/downward;
  never from lower layers to higher ones
- **Explicit Boundaries** — module interfaces are intentional; no
  reaching into internals of other layers
- **Data Flow Clarity** — data moves through the system in a
  predictable, traceable path (user event → DOM wrapper → event
  verification → timeline check → allow/block)
- **Minimize Coupling, Maximize Cohesion** — modules are
  self-contained and interact through narrow interfaces
- **Make Invalid States Impossible** — use TypeScript interfaces
  and enums to prevent illegal combinations at compile time
- **Observability Built-in** — the Timeline system and debug
  logging (`DEBUG` flag) provide built-in tracing in dev builds.
  Less critical in production where the `DEBUG` / `RECORD` flags
  are stripped.
- **Keep It Boring** — prefer well-understood patterns (proxy
  wrapping, event verification) over clever or novel solutions

The easiest way to achieve these principles is **layered
architecture**. This project's layers, from top to bottom:

```text
Entry Points (src/init/)
    ↓
Core Orchestration (src/main.ts)
    ↓
DOM API Wrappers (src/dom/)
    ↓
Event Verification (src/events/) + Observers (src/observers/)
    ↓
Proxy Service (src/proxy/) + Timeline Engine (src/timeline/)
    ↓
Messaging (src/messaging/) + Storage (src/storage/)
    ↓
Shared Utilities (src/shared/)
```

Upper layers may call lower layers. No layer may depend on a layer
above it. The UI layer (`src/pages/`, `src/ui/`) is a separate
vertical slice that sits alongside the core stack, depending on
Storage and Shared but not on DOM wrappers or Proxy.

### Code Quality

- **Linting**: ESLint with `airbnb-typescript/base` config.
  Indentation, line length, import style, and other formatting
  rules are defined in `.eslintrc.js` — refer to that file as
  the single source of truth. Do not disable or modify ESLint
  rules without team approval.
- **Error handling**: Wrap external/untrusted code in
  `ProxyServiceExternalError`; let internal errors propagate. The
  proxy layer catches and logs errors from page scripts without
  crashing the blocker.
- **Protected APIs**: Always use the safe references from
  `src/shared/protected-api.ts` (e.g., `call`, `apply`, native
  constructors) instead of directly referencing `Function.prototype
  .call` etc., because page scripts may override them.
- **No `any` in UI code**: The pages ESLint config
  (`src/pages/.eslintrc.js`) warns on explicit `any`. In the
  core codebase, `any` is allowed but should be avoided where
  possible.

### Testing

- **Framework**: Mocha + Chai, running in a browser environment
- **Test location**: `test/` directory mirrors `src/` structure
  (e.g., `test/events/verify.ts` tests `src/events/verify.ts`)
- **Test entry point**: `test/index.ts` imports all test modules
- **Mocks**: Located in `test/mocks/` (e.g., `gm-api.ts` mocks
  the Greasemonkey API)
- **Running tests**: Build with `yarn tests`, then open
  `build/tests.html` in a browser
- **Coverage**: No automated coverage gate; strive to test all
  heuristic logic (event verification, timeline checks) and
  storage migration paths
- **What to mock**: GM API methods, `window.event`, browser APIs
  that are unavailable in test context
- **No E2E tests**: The project has no end-to-end integration
  tests; unit tests focus on individual components in isolation

### Dependency Management

- **Pin all dependency versions explicitly** — do not use version
  ranges that allow automatic upgrades to untested versions.
- **Prefer vanilla solutions** — use the language's standard
  library and built-in APIs when they adequately solve the problem.
  Only add a dependency when it provides significant value over a
  vanilla implementation.
- **Reputable sources only** — dependencies MUST come from
  well-established, actively maintained projects. Evaluate by
  download counts, repository activity, and known maintainers.
- **Avoid unpopular libraries** — do NOT add niche or obscure
  packages with limited community adoption. These pose security
  risks and may become unmaintained.
- **Minimize dependency count** — each new dependency increases
  attack surface, bundle size, and maintenance burden. Justify
  every addition. This is especially critical for a userscript
  that must stay lightweight.
- **Use the latest stable version** — when adding a new
  dependency, explicitly check the package registry for the latest
  stable release and use it. Do not copy outdated version numbers
  from memory, training data, or existing lock files of other
  projects.

**Rationale**: Fewer, well-vetted dependencies reduce security
vulnerabilities, supply chain risks, and long-term maintenance
costs.

<!-- FIXME: pin dependencies and remove this part -->
**Known exclusions** (existing range versions to be pinned):

- All `devDependencies` and `dependencies` in `package.json`
  currently use caret (`^`) ranges instead of exact pinning.

### Configuration & Documentation

- **Runtime configuration**: The userscript has no config files;
  user settings (allowed/silenced domains) are stored via the
  Greasemonkey storage API (`GM_getValue` / `GM_setValue`).
- **Build-time configuration**: The build channel (`dev`, `beta`,
  `release`) is set via the `NODE_ENV` environment variable.
  Debug flags (`DEBUG`, `RECORD`, `NO_PROXY`) are injected at
  build time via Rollup's `replace` plugin.
- **Exclusions**: AdGuard exclusion domains are maintained in
  `/exclusions.ts`; TinyShield exclusions are auto-updated via
  `yarn update-tinyshield-websites` into
  `tasks/tinyShieldWebsites.json`.
- **Locales**: Translation strings live in `src/locales/`. Use
  `yarn locales:download` and `yarn locales:upload` to sync with
  the Crowdin translation platform.
- **Documentation updates**: Changes to build commands, project
  structure, or public API must be reflected in both `README.md`
  and this `AGENTS.md` file.
- **No hardcoded secrets**: The project has no secrets or API keys.

<!-- FIXME: do not duplicate markdownlint configuration in text -->
### Markdown Formatting

All Markdown files MUST follow these formatting rules:

- **Line length**: Keep lines at most 120 characters (matching the
  project's `.markdownlint.json` `line-length` setting). Lines
  inside fenced code blocks are exempt from this limit.
- **Unordered lists**: Use dashes (`-`) for bullet points. Indent
  nested list items by 4 spaces.
- **Emphasis**: Use asterisks (`*`) for emphasis (`*italic*`,
  `**bold**`). Do NOT use underscores.
- **Headings**: Duplicate heading names are allowed only among
  sibling headings (same parent level). Avoid duplicates across
  different levels.
- **Inline HTML**: Avoid raw HTML in Markdown. The only allowed
  elements are `<a>`, `<p>`, `<details>`, `<summary>`, and
  `<img>`.
- **Trailing spaces**: Do NOT leave trailing whitespace on any
  line. Do NOT use two-space line breaks — use a blank line
  instead.
- **Bare URLs**: Bare URLs are permitted and do not need to be
  wrapped in angle brackets.
- **Table formatting**: Align table columns with padding when the
  table fits within 120 characters. If the table exceeds 120
  characters or triggers an MD060 linter warning, switch to a
  compact format using single spaces only. This applies to the
  separator row as well — it should be written as `| --- |`,
  not `|--|`.

    Example of correct layout:

    ```markdown
    | Col1   | Col2   |
    | ------ | ------ |
    | Value1 | Value2 |
    ```

    Do NOT use extra padding or alignment characters beyond single
    spaces.

**Rationale**: Uniform Markdown formatting improves readability for
both humans and AI agents that consume project documentation.
