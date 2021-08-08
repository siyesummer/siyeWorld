const LISTENING_PORT = '3030';

module.exports = {
  LISTENING_PORT, // socket.io监听端口
  CONNECT_URL: `http://localhost:${LISTENING_PORT}`, // socket.io连接url
  SOCKET_ORIGIN: 'http://localhost:8080' // socket.io跨域url
};
