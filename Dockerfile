FROM adguard/node-ssh:22.17--0 AS base
WORKDIR /workdir
ENV YARN_CACHE_FOLDER=/yarn-cache

FROM base AS deps
RUN --mount=type=cache,target=/yarn-cache,id=popup-blocker-yarn \
    --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    yarn install --frozen-lockfile

FROM base AS source-deps
COPY --from=deps /workdir/node_modules ./node_modules
COPY . .

# =============================================================================
# Test plan
# =============================================================================

FROM source-deps AS test
RUN yarn lint && \
    yarn lint:md && \
    yarn userscript-dev && \
    tar -C build -zcvf build/userscript.tar.gz userscript

FROM scratch AS test-output
COPY --from=test /workdir/build/userscript.tar.gz /artifacts/userscript.tar.gz

# =============================================================================
# Build beta plan
# =============================================================================

FROM source-deps AS build-beta
RUN yarn userscript-beta && \
    tar -C build -zcvf build/userscript.tar.gz userscript

FROM scratch AS build-beta-output
COPY --from=build-beta /workdir/build/userscript.tar.gz /artifacts/userscript.tar.gz
COPY --from=build-beta /workdir/build/build.txt /artifacts/build.txt

# =============================================================================
# Build release plan
# =============================================================================

FROM source-deps AS build-release
COPY --from=private . /workdir/private
RUN yarn userscript-release && \
    tar -C build -zcvf build/userscript.tar.gz userscript

FROM scratch AS build-release-output
COPY --from=build-release /workdir/build/userscript.tar.gz /artifacts/userscript.tar.gz
COPY --from=build-release /workdir/build/build.txt /artifacts/build.txt
