#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const tmpPath = require('os').tmpdir()

// 修改了原项目`app.js`内的引入路径
// 开发环境下调用安装在`siye-music`项目内的依赖包启动netease-cloud-music-api
// 这样就不用再专门启动一个项目
const generateConfig = require('./node_modules/netease-cloud-music-api/generateConfig');
const server = require('./node_modules/netease-cloud-music-api/server');

async function start() {
  // 检测是否存在 anonymous_token 文件,没有则生成
  if (!fs.existsSync(path.resolve(tmpPath, 'anonymous_token'))) {
    fs.writeFileSync(path.resolve(tmpPath, 'anonymous_token'), '', 'utf-8')
  }
  // 启动时更新anonymous_token
  await generateConfig()
  server.serveNcmApi({
    checkVersion: true,
  })
}
start()
