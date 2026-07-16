const LISTENING_PORT = process.env.PORT || process.env.CHAT_PORT || '3030';
const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
const CONNECT_URL = process.env.VUE_APP_SOCKET_URL
  || process.env.CONNECT_URL
  || `http://${SERVER_HOST}:${LISTENING_PORT}`;
const CORS_ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN || '*';
const CHAT_HISTORY_API_BASE_URL = process.env.CHAT_HISTORY_API_BASE_URL || 'http://106.52.222.106:8181';
const CHAT_ROOM_CODE = 'public-room';
const CHAT_HISTORY_PAGE_SIZE = 10;

module.exports = {
  LISTENING_PORT,
  CONNECT_URL,
  CORS_ALLOW_ORIGIN,
  SOCKET_ORIGIN: `http://${SERVER_HOST}:8080`,
  CHAT_HISTORY_API_BASE_URL,
  CHAT_ROOM_CODE,
  CHAT_HISTORY_PAGE_SIZE,
};
