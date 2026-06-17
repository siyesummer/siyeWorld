#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const http = require('http');
const tmpPath = require('os').tmpdir();

// 注入请求日志 — hook 所有 HTTP server 创建路径
function addRequestLog(server) {
  server.on('request', (req, res) => {
    const start = Date.now();
    const origEnd = res.end;
    res.end = function (...endArgs) {
      const ms = Date.now() - start;
      console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url} ${res.statusCode} ${ms}ms`);
      return origEnd.call(this, ...endArgs);
    };
  });
}

// Hook 1: http.createServer
const origCreateServer = http.createServer;
http.createServer = function (requestListener, ...args) {
  const server = origCreateServer.call(http, requestListener, ...args);
  addRequestLog(server);
  return server;
};

// Hook 2: new http.Server 的 listen（兜底，覆盖直接 new Server 的场景）
const origListen = http.Server.prototype.listen;
http.Server.prototype.listen = function (...args) {
  addRequestLog(this);
  return origListen.apply(this, args);
};

const generateConfig = require('NeteaseCloudMusicApi/generateConfig');
const server = require('NeteaseCloudMusicApi/server');

async function start() {
  try {
    console.log('[API] 初始化...');
    if (!fs.existsSync(path.resolve(tmpPath, 'anonymous_token'))) {
      fs.writeFileSync(path.resolve(tmpPath, 'anonymous_token'), '', 'utf-8');
    }
    await generateConfig();
    console.log('[API] 配置已生成，启动服务...');
    server.serveNcmApi({
      checkVersion: true,
    });
    console.log('[API] 服务已启动，端口 3000');
  } catch (err) {
    console.error('[API] 启动失败:', err.message || err);
    console.error('[API] 请按任意键退出...');
    process.stdin.resume();
  }
}
start();
