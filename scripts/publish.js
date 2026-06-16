/**
 * npm 发布脚本 — 用于将 siye-world 下的子包发布到 npm
 *
 * 用法:
 *   node scripts/publish.js core          # 发布 siye-core
 *   node scripts/publish.js music         # 发布 siye-music
 *   node scripts/publish.js chat          # 发布 easy-chat
 *   node scripts/publish.js all           # 按依赖顺序发布全部（core → music → chat）
 *
 *   node scripts/publish.js core --dry    # 仅预览，不实际发布
 *   node scripts/publish.js all --tag beta  # 全部打 beta 标签
 *
 * 发布前会自动运行各包的 standard-version 更新版本号与 CHANGELOG
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// ─── 包名映射 ──────────────────────────────────────
const PKG_MAP = {
  core: 'siye-core',
  music: 'siye-music',
  chat: '@siyesummer/easy-chat',
};

// 反向映射：也支持直接用完整包名
Object.keys(PKG_MAP).forEach(short => {
  PKG_MAP[PKG_MAP[short]] = PKG_MAP[short];
});

// 全部发布时的顺序（siye-core 必须最先，其余包依赖它）
const PUBLISH_ORDER = ['core', 'music', 'chat'];

// ─── 参数解析 ──────────────────────────────────────
const args = process.argv.slice(2);
const pkgKey = args[0];
const flags = args.slice(1);

const isDryRun = flags.includes('--dry') || flags.includes('--dry-run');
const tagIndex = flags.indexOf('--tag');
const tag = tagIndex !== -1 ? flags[tagIndex + 1] : 'latest';
const otpIndex = flags.indexOf('--otp');
const otp = otpIndex !== -1 ? flags[otpIndex + 1] : null;
const rootDir = path.resolve(__dirname, '..');

// ─── 工具函数 ──────────────────────────────────────
function run(cmd, cwd) {
  console.log(`  > ${cmd}`);
  if (isDryRun) return '';
  return execSync(cmd, { cwd, stdio: 'inherit', encoding: 'utf8' });
}

/** 发布单个包 */
function publishOne(shortName) {
  const pkgName = PKG_MAP[shortName];
  const pkgDir = path.join(rootDir, 'packages', pkgName);

  if (!fs.existsSync(pkgDir)) {
    console.error(`❌ 目录不存在: ${pkgDir}`);
    return false;
  }

  const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));

  console.log(`\n📦 发布: ${pkgName}@${pkgJson.version}`);

  // 1. standard-version
  console.log('  1️⃣  更新版本号与 CHANGELOG ...');
  run('npx standard-version', pkgDir);

  // 2. npm publish
  console.log(`  2️⃣  发布到 npm (tag: ${tag}) ...`);
  const publishArgs = ['publish'];
  if (tag && tag !== 'latest') publishArgs.push('--tag', tag);
  if (pkgName.startsWith('@')) publishArgs.push('--access', 'public');
  if (otp) publishArgs.push('--otp', otp);
  if (isDryRun) publishArgs.push('--dry-run');

  run(`npm ${publishArgs.join(' ')}`, pkgDir);

  console.log(`  ✅ ${pkgName} 完成`);
  return true;
}

// ─── 校验 ─────────────────────────────────────────
const targets = pkgKey === 'all' ? PUBLISH_ORDER : [pkgKey];

for (const key of targets) {
  if (!PKG_MAP[key]) {
    console.error(`❌ 未知包名: "${key}". 可用: core | music | chat | all`);
    process.exit(1);
  }
}

// ─── 发布 ──────────────────────────────────────────
console.log(`\n🚀 开始发布${targets.length > 1 ? ` (共 ${targets.length} 个包)` : ''}`);
if (isDryRun) console.log('   (dry-run 模式，不会真正发布)');

let failed = false;
targets.some(key => {
  try {
    if (!publishOne(key)) {
      failed = true;
      return true;
    }
  } catch (err) {
    console.error(`\n❌ ${PKG_MAP[key]} 发布失败: ${err.message}`);
    failed = true;
    return true;
  }
  return false;
});

if (failed) {
  console.error('\n❌ 发布中断');
  process.exit(1);
}

console.log('\n✅ 全部发布完成！');
