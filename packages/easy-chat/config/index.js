const serverConfig = require('./server');

const CHAT_HISTORY_API_BASE_URL = process.env.CHAT_HISTORY_API_BASE_URL || 'http://106.52.222.106:8181';
const CHAT_ROOM_CODE = 'public-room';
const CHAT_HISTORY_PAGE_SIZE = 10;

module.exports = {
  ...serverConfig,
  CHAT_HISTORY_API_BASE_URL,
  CHAT_ROOM_CODE,
  CHAT_HISTORY_PAGE_SIZE,
};
