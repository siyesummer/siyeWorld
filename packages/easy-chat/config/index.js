const { requireEnv } = require('./env');

// 浏览器服务地址只允许通过 Vue 环境文件注入，不兼容其他变量名或源码默认值。
const CONNECT_URL = requireEnv('VUE_APP_SOCKET_URL');
const CHAT_HISTORY_API_BASE_URL = requireEnv('VUE_APP_CHAT_HISTORY_API_BASE_URL');

// 当前公共聊天室编码，前端保存和读取历史时保持一致。
const CHAT_ROOM_CODE = 'public-room';

// 首屏和上拉加载历史消息时，每次请求的默认条数。
const CHAT_HISTORY_PAGE_SIZE = 10;

module.exports = {
  CONNECT_URL,
  CHAT_HISTORY_API_BASE_URL,
  CHAT_ROOM_CODE,
  CHAT_HISTORY_PAGE_SIZE,
};
