/**
 * 部署打包脚本
 *
 * 用法:
 *   yarn deploy          # 构建并打包到 deploy/ 目录
 *   yarn deploy --dry    # 仅查看会生成哪些文件，不实际执行
 *
 * 生成产物 deploy/ 目录结构:
 *   dist/                  Vue 前端构建产物
 *   app.js                 siye-music Netease API 入口
 *   server.js              easy-chat Socket.IO 服务
 *   config.js              服务器配置（IP/端口，部署前修改）
 *   package.json           服务端依赖清单（npm install 用）
 *   install.bat            Windows 一键安装依赖
 *   ecosystem.config.js    PM2 进程管理配置
 *   start.js               一键启动全部服务
 *   start-api.js           单独启动 Netease API
 *   start-chat.js          单独启动 easy-chat
 *   stop.js                停止全部服务
 *   status.js              查看服务状态
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ─── 配置 ───────────────────────────────────────
const ROOT = path.resolve(__dirname, '..');
const DEPLOY_DIR = path.join(ROOT, 'siyeWorldDeploy');
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry');

// ─── 工具函数 ────────────────────────────────────
function log(msg) { console.log(`  ${msg}`); }
function ensureDir(dir) {
  if (!isDryRun && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
function copyFile(src, dest) {
  log(`COPY ${path.relative(ROOT, src)} → ${path.relative(ROOT, dest)}`);
  if (!isDryRun) {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
  }
}
function copyDir(src, dest) {
  log(`COPY ${path.relative(ROOT, src)}/ → ${path.relative(ROOT, dest)}/`);
  if (!isDryRun) {
    if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
    fs.cpSync(src, dest, { recursive: true });
  }
}
function writeFile(filePath, content) {
  log(`GEN  ${path.relative(ROOT, filePath)}`);
  if (!isDryRun) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content, 'utf8');
  }
}
function run(cmd, label) {
  log(`RUN  ${cmd}`);
  if (isDryRun) return;
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
  } catch (err) {
    console.error(`\n❌ ${label || cmd} 执行失败`);
    process.exit(1);
  }
}

// ─── 1. 构建前端 ─────────────────────────────────
console.log('\n🔨 构建前端...');
run('yarn build', '前端构建');

// 确认 dist 存在
if (!isDryRun && !fs.existsSync(path.join(ROOT, 'dist'))) {
  console.error('\n❌ dist/ 目录不存在，请检查构建日志');
  process.exit(1);
}

// ─── 2. 清空并创建 deploy 目录 ──────────────────
console.log('\n📁 准备 deploy 目录...');
if (!isDryRun) {
  if (fs.existsSync(DEPLOY_DIR)) {
  log('删除旧的 siyeWorldDeploy/ ...');
  fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
}
  fs.mkdirSync(DEPLOY_DIR, { recursive: true });
}

// ─── 3. 复制构建产物 ─────────────────────────────
console.log('\n📋 复制文件...');
copyDir(path.join(ROOT, 'dist'), path.join(DEPLOY_DIR, 'dist'));
copyFile(
  path.join(ROOT, 'packages', 'siye-music', 'app.js'),
  path.join(DEPLOY_DIR, 'app.js'),
);
copyFile(
  path.join(ROOT, 'packages', 'easy-chat', 'server.js'),
  path.join(DEPLOY_DIR, 'server.js'),
);

// ─── 4. 生成服务端 config.js ────────────────────
console.log('\n⚙  生成服务端配置...');
const serverConfig = `/**
 * 服务器配置 — 部署到云服务器后修改此文件
 */
module.exports = {
  // 服务器公网 IP 或域名（不要带 http://）
  SERVER_HOST: 'localhost',

  // CORS 跨域允许来源（设为前端地址）
  CORS_ALLOW_ORIGIN: 'http://localhost:8080',

  // easy-chat Socket.IO 配置
  LISTENING_PORT: '3030',
  CONNECT_URL: 'http://localhost:3030',

  // 内部端口号（start/stop/status 脚本使用）
  API_PORT: 3000,          // Netease API
  CHAT_PORT: 3030,         // easy-chat Socket.IO
};
`;
writeFile(path.join(DEPLOY_DIR, 'config.js'), serverConfig);

// ─── 5. 生成 package.json ───────────────────────
console.log('\n📦 生成 package.json...');
const deployPkgJson = JSON.stringify({
  name: 'siyeworld-deploy',
  version: '1.0.0',
  private: true,
  scripts: {
    start: 'node start.js',
    'start-api': 'node start-api.js',
    'start-chat': 'node start-chat.js',
    stop: 'node stop.js',
    status: 'node status.js',
  },
  dependencies: {
    express: '^4.17.1',
    'socket.io': '^3.1.2',
    'siye-core': '^0.1.3',
    'NeteaseCloudMusicApi': '^4.13.6',
  },
}, null, 2);
writeFile(path.join(DEPLOY_DIR, 'package.json'), `${deployPkgJson}\n`);

// ─── 6. 生成 install.bat ────────────────────────
console.log('\n💿 生成 install.bat...');
writeFile(path.join(DEPLOY_DIR, 'install.bat'), `@echo off
echo ============================================
echo   siyeWorld Server Setup
echo ============================================
echo.
echo Installing dependencies...
call npm install --registry=https://registry.npmmirror.com
echo.
echo Done!
echo.
echo Next:
echo   1. Edit config.js - set SERVER_HOST to your server IP
echo   2. Run: node start.js
echo.
pause
`);

// ─── 7. 生成 start-api.js ───────────────────────
console.log('\n🚀 生成启动脚本...');
writeFile(path.join(DEPLOY_DIR, 'start-api.js'), `/**
 * 单独启动 Netease Cloud Music API（端口 3000）
 * 前台运行，Ctrl+C 停止，日志实时输出
 */
const { spawn } = require('child_process');
const path = require('path');
const net = require('net');
const { API_PORT } = require('./config');

const NAME = 'Netease API';

// 检查端口是否已被占用
const tester = net.createServer();
tester.once('error', () => {
  console.log(\`✅ \${NAME} 已在运行 (端口 \${API_PORT} 已占用)\`);
  process.exit(0);
});
tester.once('listening', () => {
  tester.close();
  console.log(\`🚀 启动 \${NAME} (端口 \${API_PORT})...\\n\`);
  const child = spawn('node', [path.join(__dirname, 'app.js')], {
    cwd: __dirname,
    stdio: 'inherit',
    env: { ...process.env, PORT: String(API_PORT), CORS_ALLOW_ORIGIN: process.env.CORS_ALLOW_ORIGIN || '*' },
  });
  child.on('exit', (code) => process.exit(code));
});
tester.listen(API_PORT);
`);

// ─── 8. 生成 start-chat.js ──────────────────────
writeFile(path.join(DEPLOY_DIR, 'start-chat.js'), `/**
 * 单独启动 easy-chat Socket.IO 服务（端口 3030）
 * 前台运行，Ctrl+C 停止，日志实时输出
 */
const { spawn } = require('child_process');
const path = require('path');
const net = require('net');
const { CHAT_PORT, SERVER_HOST } = require('./config');

const NAME = 'easy-chat';

// 检查端口是否已被占用
const tester = net.createServer();
tester.once('error', () => {
  console.log(\`✅ \${NAME} 已在运行 (端口 \${CHAT_PORT} 已占用)\`);
  process.exit(0);
});
tester.once('listening', () => {
  tester.close();
  console.log(\`🚀 启动 \${NAME} (端口 \${CHAT_PORT})...\\n\`);
  const child = spawn('node', [path.join(__dirname, 'server.js')], {
    cwd: __dirname,
    stdio: 'inherit',
    env: { ...process.env, SERVER_HOST, CHAT_PORT: String(CHAT_PORT) },
  });
  child.on('exit', (code) => process.exit(code));
});
tester.listen(CHAT_PORT);
`);

// ─── 9. 生成 start.js（一键启动全部）──────────────
writeFile(path.join(DEPLOY_DIR, 'start.js'), `/**
 * 一键启动全部服务（Netease API + easy-chat）
 * 每个服务在独立命令行窗口中运行，已运行则跳过
 */
const { spawn } = require('child_process');
const path = require('path');
const net = require('net');
const { API_PORT, CHAT_PORT, CORS_ALLOW_ORIGIN } = require('./config');

function portInUse(port, callback) {
  const tester = net.createServer();
  tester.once('error', () => callback(true));
  tester.once('listening', () => { tester.close(); callback(false); });
  tester.listen(port);
}

function openWindow(name, script, port, extraEnv) {
  portInUse(port, (busy) => {
    if (busy) {
      console.log(\`✅ \${name} 已在运行 (端口 \${port})\`);
      return;
    }
    console.log(\`🚀 启动 \${name}...\`);
    const scriptPath = path.join(__dirname, script);
    const envPrefix = extraEnv ? \`set \${extraEnv} && \` : '';
    const cmdStr = \`start "\${name}" cmd /k "\${envPrefix}node \${scriptPath}"\`;
    spawn(cmdStr, {
      cwd: __dirname,
      shell: true,
      detached: true,
      stdio: 'ignore',
    }).unref();
  });
}

console.log('╔══════════════════════════════════════╗');
console.log('║   siyeWorld 服务端一键启动           ║');
console.log('╚══════════════════════════════════════╝\\n');

setTimeout(() => openWindow('Netease API', 'app.js', API_PORT, \`CORS_ALLOW_ORIGIN=\${CORS_ALLOW_ORIGIN}\`), 0);
setTimeout(() => openWindow('easy-chat', 'server.js', CHAT_PORT), 500);

setTimeout(() => {
  console.log('\\n🎉 全部服务已启动！');
  console.log('   Netease API → http://127.0.0.1:' + API_PORT);
  console.log('   easy-chat   → http://127.0.0.1:' + CHAT_PORT);
  process.exit(0);
}, 2000);
`);

// ─── 10. 生成 stop.js ────────────────────────────
writeFile(path.join(DEPLOY_DIR, 'stop.js'), `/**
 * 停止全部服务（按端口杀进程）
 */
const { execSync } = require('child_process');
const { API_PORT, CHAT_PORT } = require('./config');

const SERVICES = [
  { name: 'Netease API', port: API_PORT },
  { name: 'easy-chat',   port: CHAT_PORT },
];

SERVICES.forEach(({ name, port }) => {
  try {
    // Windows: 查找占用端口的 PID 并终止
    const result = execSync(\`netstat -ano | findstr :\${port} | findstr LISTENING\`, { encoding: 'utf8' });
    const match = result.trim().match(/(\\d+)\\s*$/m);
    if (match) {
      execSync(\`taskkill /PID \${match[1]} /F\`);
      console.log(\`✅ \${name} 已停止 (端口 \${port})\`);
    } else {
      console.log(\`⚠  \${name}: 未找到监听进程\`);
    }
  } catch (e) {
    console.log(\`⚠  \${name}: 未运行或已停止\`);
  }
});

console.log('\\n所有服务已停止');
`);

// ─── 11. 生成 status.js ──────────────────────────
writeFile(path.join(DEPLOY_DIR, 'status.js'), `/**
 * 查看所有服务运行状态（按端口检测）
 */
const net = require('net');
const { API_PORT, CHAT_PORT } = require('./config');

const SERVICES = [
  { name: 'Netease API', port: API_PORT },
  { name: 'easy-chat',   port: CHAT_PORT },
];

function checkPort(port) {
  return new Promise((resolve) => {
    const s = net.createServer();
    s.once('error', () => resolve('✅ 运行中'));
    s.once('listening', () => { s.close(); resolve('❌ 未运行'); });
    s.listen(port);
  });
}

(async () => {
  console.log('\\n📊 siyeWorld 服务状态\\n');
  console.log('服务           状态       端口');
  console.log('────────────────────────────');
  for (const { name, port } of SERVICES) {
    const status = await checkPort(port);
    console.log(\`\${name.padEnd(13)} \${status.padEnd(8)} \${port}\`);
  }
  console.log('');
})();
`);

// ─── 12. 生成 ecosystem.config.js（PM2）───────────
console.log('\n📄 生成 PM2 配置...');
writeFile(path.join(DEPLOY_DIR, 'ecosystem.config.js'), `/**
 * PM2 进程管理配置
 *
 * 使用:
 *   npm install -g pm2
 *   pm2 start ecosystem.config.js
 *   pm2 save      # 保存进程列表
 *   pm2 startup   # 开机自启
 */
module.exports = {
  apps: [
    {
      name: 'netease-api',
      script: './app.js',
      cwd: __dirname,
      env: { PORT: '3000' },
    },
    {
      name: 'easy-chat',
      script: './server.js',
      cwd: __dirname,
      env: { CHAT_PORT: '3030' },
    },
  ],
};
`);

// ─── 13. 完成 ────────────────────────────────────
console.log(`\n✅ 部署包生成完成！位于: ${DEPLOY_DIR}`);

console.log(`
📋 部署步骤:
   1. 将 siyeWorldDeploy/ 文件夹复制到云服务器（如 C:\\www\\siyeWorld）
   2. 修改 config.js 中的 SERVER_HOST 为服务器实际 IP
   3. 双击 install.bat 安装依赖
   4. node start.js  一键启动全部服务
   5. 配置 NGINX 指向 dist/ 目录并代理 /socket.io/ 和 /api/
`);
