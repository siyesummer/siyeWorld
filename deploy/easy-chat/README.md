# easy-chat Docker 镜像

`siyesummer/easy-chat` 是 `siyeWorld` 的 Socket.IO 实时聊天服务镜像。该服务只负责连接和消息广播；历史消息由浏览器直接调用 `linux-server` 保存和查询。

## 镜像信息

- Docker Hub：`siyesummer/easy-chat`
- 容器端口：`3030`
- 健康检查：`GET /health`
- 支持架构：`linux/amd64`、`linux/arm64`
- 运行时：Node.js 20
- 容器用户：官方 Node 镜像的非 root `node` 用户

正式环境使用明确版本：

```text
siyesummer/easy-chat:0.0.1
```

每次发布还会生成 `sha-<git-commit-sha>` 追踪标签。正式 Compose 不使用 `latest`。

Docker 镜像版本与 npm 包 `@siyesummer/easy-chat` 的版本相互独立：npm 包当前版本不决定镜像版本。镜像首次发布仍从 `0.0.1` 开始，并使用 `easy-chat-image-v<version>` Git Tag。

## 运行时配置

以下变量由服务器 `deploy/easy-chat/.env` 提供，经 Compose 传入容器；它们不会修改已经编译进浏览器 JavaScript 的前端地址。

| 环境变量 | 要求 | 说明 |
| --- | --- | --- |
| `PORT` | 必填 | 容器内 HTTP / Socket.IO 端口，由 Compose 明确注入 |
| `CORS_ALLOW_ORIGIN` | 必填 | Socket.IO 允许的 Origin，支持逗号分隔多个值 |

部署 `.env` 中使用 `EASY_CHAT_CONTAINER_PORT` 生成容器的 `PORT` 和端口映射目标；镜像内不提供端口或 CORS 默认值，缺少配置时服务会直接退出并指出缺失变量。
| `TZ` | `Asia/Shanghai` | 容器时区 |

多 Origin 示例：

```dotenv
CORS_ALLOW_ORIGIN=http://localhost:8080,http://127.0.0.1:8080,http://106.52.222.106:8090,https://music.siyes.cn
```

未授权 Origin 的 Socket.IO 握手会被拒绝；无 `Origin` 的服务器内健康检查仍允许。

## 前端构建配置

仓库根 `.env.example` 记录浏览器构建时使用的变量。本地联调时复制为不会提交 Git 的 `.env.local`：

```dotenv
VUE_APP_MUSIC_API_BASE_URL=http://localhost:3000
VUE_APP_SOCKET_URL=http://localhost:3030
VUE_APP_CHAT_HISTORY_API_BASE_URL=http://localhost:8081
VUE_APP_LOG_SERVER_BASE_URL=http://localhost:8081
```

Vue CLI 只会向浏览器代码注入 `VUE_APP_` 前缀变量。四项地址均为必填，源码不提供默认地址。修改 `.env.local` 后必须重启 `yarn serve`；服务器 `deploy/easy-chat/.env` 与前端 `.env.local` 是两套不同作用域的配置。

## 更新运行时依赖

`deploy/easy-chat` 是独立的镜像运行时包。修改依赖后使用临时 Node 容器生成锁文件，避免宿主机 npm 自动关联仓库根 workspace：

```shell
docker run --rm \
  -v "$PWD:/work" \
  -w /work/deploy/easy-chat \
  node:20-bookworm-slim \
  npm install --package-lock-only --ignore-scripts --no-audit --no-fund \
    --registry=https://registry.npmmirror.com
```

## Docker Compose

```shell
cd deploy/easy-chat
cp .env.example .env
chmod 600 .env
docker compose --env-file .env -f compose.example.yml config
docker compose --env-file .env -f compose.example.yml pull
docker compose --env-file .env -f compose.example.yml up -d --no-build
```

验证：

```shell
curl -fsS http://127.0.0.1:3130/health
docker compose --env-file .env -f compose.example.yml logs --tail=100 easy-chat
```

## 职责边界

Socket Server 处理：

- Socket.IO polling / WebSocket 连接
- `linkStart -> linkSuccess`
- `clientMsg -> backClientMsg`
- 连接、断开、消息和异常日志

Socket Server 不直接连接 MySQL，也不调用 `linux-server`。消息持久化失败不应阻断 Socket 广播。
镜像只复制 `config/server.js`，不会包含浏览器端聊天历史接口地址等前端构建配置。

## 发布

正式发布在 GitHub Actions 手动触发 `Release easy-chat image`：

1. 安装锁定依赖并执行仓库 Lint、Node 语法检查和 CORS 测试。
2. 首次镜像版本为 `0.0.1`，后续默认递增 patch。
3. 构建并推送 `linux/amd64`、`linux/arm64`、commit SHA 标签。
4. 使用本文件同步 Docker Hub Description。
5. 创建 `easy-chat-image-v<version>` Git Tag 和 GitHub Release。

使用 `easy-chat-image-v` 前缀是为了避免与已有 npm 包 Tag `easy-chat@0.0.x` 冲突。Docker Hub 标签仍使用纯版本号。

仓库需要 `DOCKERHUB_USERNAME` 和 `DOCKERHUB_TOKEN` Secrets。同步 Description 时 Token 需要 `Read, Write, Delete` 权限。
