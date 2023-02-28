const app = require('express')();
const http = require('http').createServer(app);
const socketIo = require('socket.io');
const logger = require('siye-core/src/utils/logger');
const { LISTENING_PORT, CONNECT_URL } = require('./config');

const io = socketIo(http, {
  cors: {
    /**
     * 从v3开始需要显式启用跨域
     * @see https://socket.io/docs/v3/handling-cors/
     * @tip 调整为允许任何ip访问，解决跨域问题
     */
    origin: '*',
  }
});

io.on('connection', socket => {
  logger.info('socket.io链接成功');
  // 客户端新用户链接
  socket.on('linkStart', msg => {
    // 通知所有客户端
    io.emit('linkSuccess', msg);
  });

  // 客户端用户发送的消息
  socket.on('clientMsg', msg => {
    // 返回给所有客户端
    io.emit('backClientMsg', msg);
  });
});

http.listen(LISTENING_PORT, () => {
  console.log(`listening on *:${LISTENING_PORT}`);
  logger.info(`socket.io代理到listening on *:${CONNECT_URL}`);
});
