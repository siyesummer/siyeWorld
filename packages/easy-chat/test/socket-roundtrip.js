const io = require('socket.io-client');

const serverUrl = process.argv[2] || 'http://127.0.0.1:3131';
const origin = process.argv[3] || 'http://localhost:8080';
const payload = {
  messageId: `easy-chat-smoke-${Date.now()}`,
  content: 'easy-chat socket roundtrip smoke',
};

const socket = io(serverUrl, {
  transports: ['polling'],
  extraHeaders: {
    Origin: origin,
  },
});

const timeout = setTimeout(() => {
  console.error('[ERROR] Socket.IO roundtrip timed out');
  socket.close();
  process.exit(1);
}, 10000);

socket.on('connect', () => {
  socket.emit('clientMsg', payload);
});

socket.on('backClientMsg', message => {
  clearTimeout(timeout);
  socket.close();

  if (message.messageId !== payload.messageId) {
    console.error('[ERROR] Socket.IO roundtrip payload mismatch');
    process.exit(1);
  }

  console.log(`[OK] Socket.IO roundtrip ${message.messageId}`);
  process.exit(0);
});

socket.on('connect_error', error => {
  clearTimeout(timeout);
  console.error(`[ERROR] Socket.IO connection failed: ${error.message}`);
  socket.close();
  process.exit(1);
});
