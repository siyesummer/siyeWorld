const LISTENING_PORT = process.env.CHAT_PORT || '3030';
const SERVER_HOST = process.env.SERVER_HOST || 'siyefun.top';

module.exports = {
  LISTENING_PORT,
  CONNECT_URL: `http://${SERVER_HOST}:${LISTENING_PORT}`,
  SOCKET_ORIGIN: `http://${SERVER_HOST}:8080`,
};
