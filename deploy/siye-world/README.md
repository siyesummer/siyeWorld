# siyeWorld 前端 Docker 镜像

`siyesummer/siye-world` 是 `siyeWorld` 的 Vue 2 前端静态站点镜像。镜像内由 Nginx 提供静态资源、健康检查和 Vue Router history 模式所需的 SPA 回退。

## 镜像信息

- Docker Hub：`siyesummer/siye-world`
- 容器端口：`80`
- 健康检查：`GET /health`
- 支持架构：`linux/amd64`、`linux/arm64`
- 构建运行时：Node.js 20
- 静态服务器：Nginx 1.27 Alpine

准生产演练固定明确版本，不使用 `latest`：

```text
siyesummer/siye-world:0.0.1
```

每次发布还会生成 `sha-<git-commit-sha>` 追踪标签。

## 当前演练服务地址

正式发布 Workflow 读取并校验仓库根 `.env.production`；Dockerfile 只复制这份文件，由 Vue CLI 在 `yarn build` 时自动读取，不再维护第二套构建参数：

```dotenv
VUE_APP_MUSIC_API_BASE_URL=http://106.52.222.106:8090/music-api
VUE_APP_SOCKET_URL=http://106.52.222.106:8090
VUE_APP_CHAT_HISTORY_API_BASE_URL=http://106.52.222.106:8090
VUE_APP_LOG_SERVER_BASE_URL=http://106.52.222.106:8090
```

这些值会编译进浏览器 JavaScript，不是容器启动后读取的运行时变量。当前域名仍在备案，`0.0.1` 作为准生产演练镜像，通过 Linux edge-nginx 的 `106.52.222.106:8090` 完成真实业务验证：

| 演练路径 | 上游服务 | 说明 |
| --- | --- | --- |
| `106.52.222.106:8090/music-api/` | `music-api:3000` | 转发时移除 `/music-api` 前缀 |
| `106.52.222.106:8090/socket.io/` | `easy-chat:3030` | 支持 polling 和 WebSocket Upgrade |
| `106.52.222.106:8090/api/` | `linux-server:8081` | 聊天历史、消息保存和日志接口 |

备案和 HTTPS 完成后的正式方案会将 `.env.production` 切换为 `https://music-api.siyes.cn`、`https://socket.siyes.cn`、`https://linux-api.siyes.cn`。届时前端部署服务器只负责静态文件和 SPA 回退，无需增加业务代理，其他客户端也可直接调用独立服务域名。该变化必须发布下一新版本，例如 `0.0.2`，不能覆盖已冻结的演练版 `0.0.1`。

第三方服务端程序直接调用独立域名不受浏览器 CORS 限制；第三方浏览器站点仍需将自己的精确 Origin 加入对应服务 CORS 白名单，或使用后续单独设计的公开 API 策略。

本地手工构建也直接读取仓库根 `.env.production`：

```shell
docker build \
  -f deploy/siye-world/Dockerfile \
  -t siye-world:local .
```

国内本地构建还可以通过 `NODE_IMAGE` 和 `NGINX_IMAGE` 构建参数替换为 DaoCloud 对应基础镜像；GitHub Actions 使用官方镜像源。

## 多环境文件

- `.env.development`：由 `yarn serve` 自动读取，使用 localhost 的 `3000/3030/8081`。
- `.env.production`：由 `yarn build`、镜像 Dockerfile 和发布 Workflow 共同读取，是唯一发布构建地址来源；当前演练阶段使用 `106.52.222.106:8090`，备案完成后切换为独立 HTTPS 域名并发布新版本。
- `.env.pages`：由 `yarn build:pages` 读取，复用当前演练 API 地址，同时使用 `/siyeWorld/` 资源前缀和 `hash` 路由。
- `.env.*.local`：仅用于个人临时覆盖，不提交 Git；它的优先级高于标准模式文件，遗留文件可能造成构建地址被意外覆盖。

GitHub Pages 地址是 `https://siyesummer.github.io/siyeWorld/`，当前演练接口是 `http://106.52.222.106:8090`。HTTPS 页面请求 HTTP API/Socket 会被现代浏览器按 Mixed Content 拦截，所以当前 Pages 制品只用于验证静态页面、资源路径和 hash 路由，不能作为音乐、聊天和日志的完整联调入口。备案完成并切换到三个 HTTPS 服务域名后，重新构建 Pages 制品才能完成真实业务验收。

当前只准备 `build:pages` 能力，不创建或启用 Pages 发布 Workflow；按第七套计划，待演练完成且域名仍不可用时再新增手动发布流程。

当前演练镜像只部署到 Linux 第七套环境。`siyefun.top` 暂不纳入本阶段部署，不在本目录提供可直接启用的 Windows Nginx 配置。

后续发布 `siyefun.top` 时需要单独演练。Windows 服务器不使用 Docker，应从同一正式 Git commit 生成版本化 `dist`，并新增独立 Nginx 配置文件进行灰度验证；不能直接修改或覆盖服务器现有旧配置。新配置验证通过后再决定切换方式，并预先准备旧 dist 和旧入口回滚。

## 独立运行

```shell
cd deploy/siye-world
cp .env.example .env
chmod 600 .env
docker compose --env-file .env -f compose.example.yml config
docker compose --env-file .env -f compose.example.yml pull
docker compose --env-file .env -f compose.example.yml up -d --no-build
curl -fsS http://127.0.0.1:8088/health
```

直接访问不存在的前端路径（例如 `/log-query`）应返回 `index.html`，以支持 Vue Router history 模式。

## 正式 Compose 边界

正式服务器不从源码构建该镜像，只拉取 Docker Hub 固定版本。`siye-world` 加入 `edge-net`，通常不发布宿主机端口，由 `edge-nginx` 通过容器 DNS `siye-world:80` 访问。

更新步骤：

1. 备份正式 Compose 和服务器 `.env`。
2. 将 `SIYE_WORLD_IMAGE` 改为新的固定版本。
3. 执行 `docker compose pull siye-world`。
4. 执行 `docker compose config` 检查解析结果。
5. 执行 `docker compose up -d --no-build siye-world edge-nginx`。
6. 验证容器健康、SPA 回退、静态资源、音乐、Socket、聊天历史和日志页面。

回滚时恢复上一镜像版本并重新执行 `pull` 与 `up -d`。

## 发布

在 GitHub Actions 手动触发 `Release siye-world image`：

1. 安装锁定依赖并执行仓库校验。
2. 从 `siye-world-image-v*` Tag 计算独立镜像版本，首次为 `0.0.1`。
3. 构建并推送多架构版本标签和 commit SHA 标签。
4. 使用本文件同步 Docker Hub Description。
5. 创建 `siye-world-image-v<version>` Git Tag 和 GitHub Release。

仓库需要 `DOCKERHUB_USERNAME` 和 `DOCKERHUB_TOKEN` Secrets；同步 Description 时 Token 需要 `Read, Write, Delete` 权限。
