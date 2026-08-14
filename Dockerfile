FROM adguard/node-ssh:22.22--0 AS base
WORKDIR /workdir
ENV npm_config_store_dir=/pnpm-store

FROM base AS deps
RUN --mount=type=cache,target=/pnpm-store,id=popup-blocker-pnpm \
    --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=bind,source=pnpm-workspace.yaml,target=pnpm-workspace.yaml \
    pnpm install --frozen-lockfile --prefer-offline

FROM base AS source-deps
COPY --from=deps /workdir/node_modules ./node_modules
COPY . .

# =============================================================================
# Test plan
# =============================================================================

# The build stages emit the deployable userscript files directly (no archive):
# popupblocker.user.js, popupblocker.meta.js, and assets/. Each file is
# published by its exact name via the artifact-only deploy-to-static contract.
FROM source-deps AS test
RUN pnpm lint && \
    pnpm lint:md && \
    pnpm userscript-dev

FROM scratch AS test-output
COPY --from=test /workdir/build/userscript/. /

# =============================================================================
# Build beta plan
# =============================================================================

FROM source-deps AS build-beta
RUN pnpm userscript-beta

FROM scratch AS build-beta-output
COPY --from=build-beta /workdir/build/userscript/. /
COPY --from=build-beta /workdir/build/build.txt /build.txt

# =============================================================================
# Build release plan
# =============================================================================

# The userscript build does not require the extensions-private build context
# (signing material is only needed for the browser extension bundle target).
FROM source-deps AS build-release
RUN pnpm userscript-release

FROM scratch AS build-release-output
COPY --from=build-release /workdir/build/userscript/. /
COPY --from=build-release /workdir/build/build.txt /build.txt

# Alias used by publish-release.yml to fetch the compiled release userscript.
FROM build-release-output AS build-output
