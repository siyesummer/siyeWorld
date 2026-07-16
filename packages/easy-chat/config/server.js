const LISTENING_PORT = process.env.PORT || process.env.CHAT_PORT || '3030';
const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
const CONNECT_URL = process.env.VUE_APP_SOCKET_URL
  || process.env.CONNECT_URL
  || `http://${SERVER_HOST}:${LISTENING_PORT}`;
const CORS_ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN || '*';

module.exports = {
  LISTENING_PORT,
  CONNECT_URL,
  CORS_ALLOW_ORIGIN,
};
