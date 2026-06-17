/**
 * 启动 siyeWorldDeploy 产物
 *
 * 用法:
 *   yarn start:deploy          # 首次自动安装依赖
 *   yarn start:deploy --skip-install  # 跳过安装直接启动
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEPLOY_DIR = path.resolve(__dirname, '..', 'siyeWorldDeploy');
const NODE_MODULES = path.join(DEPLOY_DIR, 'node_modules');

if (!fs.existsSync(DEPLOY_DIR)) {
  console.error('❌ siyeWorldDeploy/ 目录不存在，请先运行 yarn deploy');
  process.exit(1);
}

const skipInstall = process.argv.includes('--skip-install');

if (!skipInstall && !fs.existsSync(NODE_MODULES)) {
  console.log('📦 首次启动，安装依赖...');
  execSync('npm install --registry=https://registry.npmmirror.com', {
    cwd: DEPLOY_DIR,
    stdio: 'inherit',
  });
}

console.log('🛑 停止已有服务...');
try { execSync('node stop.js', { cwd: DEPLOY_DIR, stdio: 'inherit' }); } catch (e) { /* ok */ }

console.log('\n🚀 启动服务...\n');
try {
  execSync('node start.js', { cwd: DEPLOY_DIR, stdio: 'inherit' });
} catch (err) {
  // start.js exits with 0 after spawning detached processes
  if (err.status !== 0) {
    console.error(`❌ 启动失败: ${err.message}`);
    process.exit(err.status);
  }
}
