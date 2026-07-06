# DEPLOYMENT.md

Production deployment reference for Popup Blocker by AdGuard userscript
artifacts.

## Table Of Contents

- [Deployment Model](#deployment-model)
- [Release Channels](#release-channels)
- [Deployment Artifacts](#deployment-artifacts)
- [Environment Variables](#environment-variables)
- [Infrastructure Dependencies](#infrastructure-dependencies)
- [External Integrations](#external-integrations)
- [Error Reporting](#error-reporting)
- [Logging](#logging)
- [Health Checks](#health-checks)
- [Security Notes](#security-notes)
- [Related Documentation](#related-documentation)

## Deployment Model

Popup Blocker has no long-running production server. Production consists of
static userscript files published to `userscripts.adtidy.org` and executed by
userscript hosts or AdGuard for Windows.

Deployment is handled by GitHub Actions (`publish-release.yml`). The tag name
entered in `prepare-release.yml` determines which channel receives the build:

- **Beta tags** (e.g. `v2.5.116-beta.1`) — deploy only to the beta channel
  and create a GitHub Release marked as a **prerelease**.
- **Stable tags** (e.g. `v2.5.116`) — deploy only to the release channel
  and create a full GitHub Release.

| Job                  | Beta tag                 | Stable tag                  |
| -------------------- | ------------------------ | --------------------------- |
| `deploy-static`      | `adguard-popup-beta`     | `adguard-popup-release`     |
| `mirror-and-release` | prerelease = `true`      | prerelease = `false`        |

The `deploy-static` job uploads the userscript artifacts to
`userscripts.adtidy.org` via the `deploy-to-static.yml` reusable workflow; the
Deployer module and environment are selected dynamically from the tag
(`-beta` suffix → beta channel, no suffix → release channel). The Deployer
publishes each artifact file by its exact name to the module's static-host
path.

GitHub Releases are created **only** on the public mirror
(`AdguardTeam/PopupBlocker`) by the `mirror-and-release` job, which also
mirrors the repo (including the tag) before creating the release.

CI/CD pipeline details live in `.github/workflows/`; this document only
records the production deployment configuration and runtime dependencies.

## Release Channels

- **Beta**:
    - Published URL:
      `https://userscripts.adtidy.org/beta/popup-blocker/2.5/popupblocker.user.js`
    - Metadata URL:
      `https://userscripts.adtidy.org/beta/popup-blocker/2.5/popupblocker.meta.js`
- **Release**:
    - Published URL:
      `https://userscripts.adtidy.org/release/popup-blocker/2.5/popupblocker.user.js`
    - Metadata URL:
      `https://userscripts.adtidy.org/release/popup-blocker/2.5/popupblocker.meta.js`

The release channel is only updated for stable tags. The beta channel is only
updated for beta tags. The two channels are mutually exclusive.

The `@downloadURL` and `@updateURL` metadata values are rendered into the
userscript metadata at build time.

## Deployment Artifacts

Each production deployment publishes these required artifacts:

- `popupblocker.user.js`: userscript metadata plus bundled runtime code.
- `popupblocker.meta.js`: userscript metadata for update checks.
- `assets/`: fonts and icon referenced by `@resource` headers.

The build outputs these artifacts as individual files (not an archive). The
`deploy-to-static.yml` workflow uploads each file by its exact name, and the
Deployer publishes them to the module's static-host path.

The release version is parsed from `CHANGELOG.md` by `tag-from-changelog.yml`
and injected into `package.json` at build time. The `increment` script has been
removed — the version is driven by the changelog and injected at build time.
The compiled userscript metadata carries the release tag version.

## Environment Variables

- `NODE_ENV`
    - Required: yes for builds.
    - Used by: Rollup build configuration.
    - Purpose: selects build channel. `BETA` and `RELEASE` produce minified
      production artifacts; any other value falls back to `dev`.
    - Example: `RELEASE`.
- `LOCALES`
    - Required: only for locale sync.
    - Used by: `locales.ts`.
    - Purpose: selects translation sync mode. Not used by deployed runtime.
    - Example: `DOWNLOAD`.

No runtime environment variables are required after artifacts are published.
The userscript runs entirely in the browser page context.

## Infrastructure Dependencies

- **Static artifact hosting**: `userscripts.adtidy.org` serves beta and release
  userscript files.
- **Deployer service**: The `deploy-to-static.yml` workflow uploads artifacts
  to `${DEPLOYER_BASE_URL}/adguard-popup-beta` and
  `${DEPLOYER_BASE_URL}/adguard-popup-release` (org variable
  `DEPLOYER_BASE_URL`). No secrets are required for static deploys.
- **CI runner**: `team-extensions` (self-hosted GitHub Actions runner).
- **Build container**: Docker build stages use `adguard/node-ssh:22.17--0` and
  emit artifacts from `build-output` / `build-beta-output` stages.
- **Package manager**: yarn.

There are no production databases, caches, queues, object storage clients, or
server processes in this repository.

## External Integrations

- **Twosky/Crowdin translation API**: `locales.ts` uses
  `https://twosky.int.agrd.dev/api/v1` for translation download and upload.
  Project, base locale, languages, and localizable files are configured in
  `.twosky.json`.
- **Userscript update mechanism**: Userscript hosts read `@downloadURL` and
  `@updateURL` from generated metadata. These values are rendered at build
  time.
- **Public mirror**: `AdguardTeam/PopupBlocker` receives a code mirror on
  every push to `master` (via `mirror.yml`) and a GitHub Release on every
  published tag (via `mirror-and-release`).

No OAuth provider, webhook receiver, payment provider, email provider, or other
runtime third-party service is configured.

## Error Reporting

No Sentry, Bugsnag, Rollbar, or equivalent error reporting integration is
configured. The deployed userscript does not report browser runtime errors to an
external service.

## Logging

- Runtime userscript code does not intentionally emit production logs.
- Build and deployment scripts write plain text logs to GitHub Actions
  stdout/stderr. Docker build steps use `--progress plain` for readable logs.
- `locales.ts` writes translation sync success and error messages when
  `LOCALES` is set.

There is no configurable log level and no structured JSON logging.

## Health Checks

There are no `/health`, `/ready`, or `/live` endpoints because this project does
not run a server in production. Production validation is artifact availability at
the beta and release URLs.

## Security Notes

- Do not commit secrets. Credentials for Twosky/Crowdin must be managed
  outside this repository. The Deployer service uses the org variable
  `DEPLOYER_BASE_URL` — no secrets are required for static deploys.
- Keep `@include` and `@exclude` metadata patterns as narrow as possible because
  they control where the userscript executes.
- Do not publish artifacts that were not generated from the expected beta or
  release channel configuration.

## Related Documentation

- [User manual](README.md)
- [Development](DEVELOPMENT.md)
- [LLM agent rules](AGENTS.md)
- [Changelog](CHANGELOG.md)
