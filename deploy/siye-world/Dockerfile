ARG NODE_IMAGE=node:20-bookworm-slim
ARG NGINX_IMAGE=nginx:1.27-alpine

FROM --platform=$BUILDPLATFORM ${NODE_IMAGE} AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY packages/siye-core/package.json packages/siye-core/package.json
COPY packages/siye-music/package.json packages/siye-music/package.json
COPY packages/easy-chat/package.json packages/easy-chat/package.json

RUN yarn config set registry https://registry.npmmirror.com \
    && yarn install --frozen-lockfile --network-timeout 600000 --network-concurrency 4

COPY babel.config.js prettier.config.js vue.config.js .eslintrc.js ./
COPY .env.production ./
COPY public ./public
COPY src ./src
COPY packages ./packages

RUN yarn build

FROM ${NGINX_IMAGE}

ARG APP_VERSION=dev
ARG APP_REVISION=unknown

LABEL org.opencontainers.image.title="siye-world" \
    org.opencontainers.image.version="${APP_VERSION}" \
    org.opencontainers.image.revision="${APP_REVISION}"

COPY deploy/siye-world/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

RUN printf '{"service":"siye-world","version":"%s","revision":"%s"}\n' \
    "$APP_VERSION" \
    "$APP_REVISION" \
    > /usr/share/nginx/html/release.json

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=5s --retries=10 --start-period=10s \
  CMD wget -q -O /dev/null http://127.0.0.1/health || exit 1
