# siyeWorld

`siyeWorld` 是一个基于 Vue 2 和 Yarn Workspaces 的前端项目，当前包含音乐播放、Socket.IO 聊天、聊天历史持久化和服务日志查询等能力。

## 在线地址

- 正式站点：[https://music.siyes.cn](https://music.siyes.cn)
- GitHub Pages：[https://siyesummer.github.io/siyeWorld/](https://siyesummer.github.io/siyeWorld/)
- 音乐 API：`https://music-api.siyes.cn`
- Socket.IO：`https://socket.siyes.cn`
- 聊天历史和日志 API：`https://linux-api.siyes.cn`

正式站点由 Docker 中的 Nginx 提供静态资源，通过独立 HTTPS 域名访问后端服务。GitHub Pages 使用相同的正式后端，但使用 `/siyeWorld/` 资源前缀和 hash 路由。

## 项目结构

```text
.
|-- .github/workflows/       GitHub Actions 发布流程
|-- deploy/                  前端和 easy-chat 的 Docker 构建资料
|-- packages/
|   |-- siye-core/           共享组件、请求封装和工具
|   |-- siye-music/          音乐播放器及本地音乐 API 启动入口
|   `-- easy-chat/           聊天组件和 Socket.IO 服务
|-- public/                  公共静态资源
|-- src/                     主应用入口、页面和路由
|-- .env.development         本地开发构建配置
|-- .env.production          正式 Docker 构建配置
`-- .env.pages               GitHub Pages 构建配置
```

## 环境要求

- Node.js 20
- Yarn Classic 1.22
- 完整聊天和日志联调还需要本地运行 `linux-server`，默认地址为 `http://localhost:8081`

## 本地开发

安装锁定版本的依赖：

```shell
yarn install --frozen-lockfile
```

只启动前端开发服务器：

```shell
yarn serve
```

同时启动本地音乐 API、easy-chat 和前端时，先准备 easy-chat 的本地配置：

```shell
cp packages/easy-chat/.env.example packages/easy-chat/.env.local
yarn dev
```

Windows PowerShell 可使用：

```powershell
Copy-Item packages/easy-chat/.env.example packages/easy-chat/.env.local
yarn dev
```

`.env.development` 默认使用以下本地服务：

```text
前端              http://localhost:8080
音乐 API          http://localhost:3000
Socket.IO         http://localhost:3030
聊天历史和日志 API http://localhost:8081
```

`packages/easy-chat/.env.local` 是本地服务端配置，不提交 Git。个人前端配置覆盖应使用 `.env.development.local`、`.env.production.local` 或 `.env.pages.local`。

## 构建模式

| 场景 | 命令 | 环境文件 | 资源路径 | 路由模式 |
| --- | --- | --- | --- | --- |
| 本地开发 | `yarn serve` | `.env.development` | `/` | `history` |
| 正式构建 | `yarn build` | `.env.production` | `/` | `history` |
| GitHub Pages | `yarn build:pages` | `.env.pages` | `/siyeWorld/` | `hash` |

所有 `VUE_APP_*` 地址都会在构建时写入浏览器 JavaScript。修改服务器容器的运行时 `.env` 不会改变已经生成的前端制品，服务地址变化后必须重新构建并发布。

## 常用命令

```shell
# ESLint 和 easy-chat 定向测试
yarn verify

# 仅执行 ESLint
yarn lint

# 正式前端构建
yarn build

# GitHub Pages 前端构建
yarn build:pages
```

根项目当前没有 `yarn test` 命令，提交前以 `yarn verify` 和对应模式的真实构建作为基础校验。

## GitHub Pages 发布

Pages Workflow 位于 `.github/workflows/deploy-github-pages.yml`，只支持手动触发，不会因 `push` 自动发布。

首次使用时，在 GitHub 仓库中打开 `Settings -> Pages`，将 `Build and deployment` 的来源设置为 `GitHub Actions`。之后进入 `Actions -> Deploy siyeWorld to GitHub Pages`，选择目标分支并点击 `Run workflow`。

发布流程会：

1. 按 `yarn.lock` 安装依赖。
2. 执行 `yarn verify`。
3. 使用 `.env.pages` 执行 `yarn build:pages`。
4. 上传 `dist` 并部署到 GitHub Pages。

Pages 页面发起跨域请求时的 Origin 是 `https://siyesummer.github.io`，该值必须保留在 music-api、easy-chat 和 linux-server 的生产 CORS 白名单中。

## Docker 镜像发布

- `Release siye-world image`：手动构建并发布前端多架构镜像。
- `Release easy-chat image`：手动构建并发布 Socket.IO 服务多架构镜像。

镜像发布流程使用明确版本标签和 commit SHA 标签，不使用 `latest` 作为生产版本。前端镜像的构建和独立运行方式参见 [deploy/siye-world/README.md](deploy/siye-world/README.md)，easy-chat 参见 [deploy/easy-chat/README.md](deploy/easy-chat/README.md)。

## Workspace 依赖管理

向根项目添加依赖：

```shell
yarn add <dependency-name> -W
yarn add <dependency-name> -W -D
```

向指定工作区添加依赖：

```shell
yarn workspace <package-name> add <dependency-name>
yarn workspace <package-name> add <dependency-name> -D
```

例如：

```shell
yarn workspace siye-music add lodash
```
