# 构建参数只在 docker build 时生效，可替换为 DaoCloud 的 Node 镜像地址。
ARG NODE_IMAGE=node:20-bookworm-slim
FROM ${NODE_IMAGE}

ENV NODE_ENV=production \
    TZ=Asia/Shanghai

WORKDIR /app

COPY deploy/easy-chat/package.json deploy/easy-chat/package-lock.json ./

RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund \
    && npm cache clean --force

COPY --chown=node:node packages/easy-chat/server.js ./server.js
COPY --chown=node:node packages/easy-chat/config/server.js ./config/server.js
COPY --chown=node:node packages/easy-chat/config/env.js ./config/env.js
COPY --chown=node:node packages/easy-chat/cors.js ./cors.js
COPY --chown=node:node packages/easy-chat/logger.js ./logger.js
COPY --chown=node:node packages/easy-chat/fileLogger.js ./fileLogger.js

USER node

HEALTHCHECK --interval=10s --timeout=5s --retries=10 --start-period=20s \
  CMD node -e "fetch('http://127.0.0.1:' + process.env.PORT + '/health').then(response => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
