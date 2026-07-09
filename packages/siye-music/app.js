#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const http = require('http');
const util = require('util');
const tmpPath = require('os').tmpdir();

const SERVICE_NAME = 'music-api';
const REQUEST_LOG_HOOKED = Symbol('requestLogHooked');
const CHINA_TIME_FORMATTER = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});
const originalConsole = {
  log: console.log.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};
const IGNORE_LEGACY_OUTPUT_PATTERNS = [
  /^server running @ /i,
  /^\[OK\]\s+/,
];
const LEGACY_LEVEL_PATTERNS = [
  { level: 'ERROR', pattern: /^\[(ERR|ERROR)\]\s+/i },
  { level: 'WARN', pattern: /^\[WARN\]\s+/i },
  { level: 'INFO', pattern: /^\[INFO\]\s+/i },
];

function formatTimestamp() {
  const now = new Date();
  const parts = Object.fromEntries(CHINA_TIME_FORMATTER.formatToParts(now)
    .filter(part => part.type !== 'literal')
    .map(part => [part.type, part.value]));
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}.${milliseconds}`;
}

function log(level, scope, message, extra = {}) {
  const suffix = Object.keys(extra).length ? ` ${JSON.stringify(extra)}` : '';
  const text = `[${formatTimestamp()}] [${level}] [${SERVICE_NAME}] [${scope}] ${message}${suffix}`;
  if (level === 'ERROR') {
    originalConsole.error(text);
    return;
  }
  if (level === 'WARN') {
    originalConsole.warn(text);
    return;
  }
  originalConsole.log(text);
}

function normalizeConsoleOutput(args) {
  return util.format(...args).replace(/\s+$/, '');
}

function detectLegacyLevel(line) {
  const matched = LEGACY_LEVEL_PATTERNS.find(item => item.pattern.test(line));
  return matched ? matched.level : '';
}

function shouldIgnoreLegacyOutput(line) {
  return IGNORE_LEGACY_OUTPUT_PATTERNS.some(pattern => pattern.test(line));
}

function relayConsole(method, args) {
  const line = normalizeConsoleOutput(args);
  if (!line) {
    originalConsole[method](...args);
    return;
  }

  if (shouldIgnoreLegacyOutput(line)) {
    return;
  }

  const legacyLevel = detectLegacyLevel(line);
  if (legacyLevel) {
    log(legacyLevel, 'legacy', line);
    return;
  }

  originalConsole[method](...args);
}

console.log = (...args) => relayConsole('log', args);
console.info = (...args) => relayConsole('info', args);
console.warn = (...args) => relayConsole('warn', args);
console.error = (...args) => relayConsole('error', args);

function resolveMusicApiModule(relativeModulePath, packageModulePath) {
  const localModulePath = path.resolve(__dirname, relativeModulePath);
  console.log('localModulePath路径', localModulePath);

  if (fs.existsSync(`${localModulePath}.js`) || fs.existsSync(localModulePath)) {
    log('INFO', 'bootstrap', 'using local source module', {
      module: relativeModulePath,
    });
    return require(localModulePath);
  }

  log('INFO', 'bootstrap', 'using package module', {
    module: packageModulePath,
  });
  return require(packageModulePath);
}

function addRequestLog(server) {
  if (server[REQUEST_LOG_HOOKED]) {
    return;
  }
  server[REQUEST_LOG_HOOKED] = true;

  server.on('request', (req, res) => {
    const start = Date.now();
    const originalEnd = res.end;
    res.end = function (...endArgs) {
      const ms = Date.now() - start;
      log('INFO', 'http', `${req.method} ${req.url} ${res.statusCode} ${ms}ms`);
      return originalEnd.call(this, ...endArgs);
    };
  });
}

const originalCreateServer = http.createServer;
http.createServer = function (requestListener, ...args) {
  const server = originalCreateServer.call(http, requestListener, ...args);
  addRequestLog(server);
  return server;
};

const originalListen = http.Server.prototype.listen;
http.Server.prototype.listen = function (...args) {
  addRequestLog(this);
  return originalListen.apply(this, args);
};

const generateConfig = resolveMusicApiModule('./generateConfig', 'NeteaseCloudMusicApi/generateConfig');
const server = resolveMusicApiModule('./server', 'NeteaseCloudMusicApi/server');

async function start() {
  try {
    log('INFO', 'bootstrap', 'initializing');
    if (!fs.existsSync(path.resolve(tmpPath, 'anonymous_token'))) {
      fs.writeFileSync(path.resolve(tmpPath, 'anonymous_token'), '', 'utf-8');
    }
    await generateConfig();
    log('INFO', 'bootstrap', 'configuration generated, starting service');
    server.serveNcmApi({
      checkVersion: true,
    });
    log('INFO', 'startup', 'service started on port 3000');
  } catch (error) {
    log('ERROR', 'bootstrap', error && error.stack ? error.stack : (error.message || String(error)));
    process.exit(1);
  }
}

process.on('uncaughtException', error => {
  log('ERROR', 'uncaughtException', error && error.stack ? error.stack : String(error));
});

process.on('unhandledRejection', reason => {
  log('ERROR', 'unhandledRejection', reason && reason.stack ? reason.stack : String(reason));
});

start();