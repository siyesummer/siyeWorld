import axios from 'axios';
import requireEnv from '../configs/env';

// 日志服务地址只允许通过 Vue 环境文件注入，不在源码中提供回退地址。
const LOG_SERVER_BASE_URL = requireEnv('VUE_APP_LOG_SERVER_BASE_URL');

function trimTrailingSlash(value = '') {
  return value.replace(/\/$/, '');
}

export function fetchLogs(params = {}) {
  const requestUrl = `${trimTrailingSlash(LOG_SERVER_BASE_URL)}/api/logs/query`;

  return axios.get(requestUrl, {
    params,
  }).then(res => res.data);
}

export function normalizeLogResponse(payload = {}) {
  const data = payload.data || payload.result || payload;
  const sourceRecords = data.records || data.lines || [];

  return {
    service: data.service || '',
    total: Number(data.total || sourceRecords.length || 0),
    page: Number(data.page || 1),
    pageSize: Number(data.pageSize || 10),
    truncated: Boolean(data.truncated),
    generatedAt: data.generatedAt || data.queryTime || data.timestamp || '',
    records: sourceRecords.map((item, index) => ({
      id: item.id || `${item.source || item.fileName || 'log'}-${item.lineNo || index}`,
      source: item.source || item.fileName || item.service || '--',
      level: String(item.level || item.logLevel || 'INFO').toUpperCase(),
      time: item.timestamp || item.time || item.datetime || '--',
      lineNo: item.lineNo || item.line || '--',
      content: item.content || item.message || item.raw || '',
    })),
  };
}
