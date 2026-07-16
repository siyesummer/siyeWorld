import { customRequest } from 'siye-core/src/modules/request';
import {
  CHAT_HISTORY_API_BASE_URL,
  CHAT_HISTORY_PAGE_SIZE,
  CHAT_ROOM_CODE,
} from '../../config/index';

const chatHistoryRequest = customRequest({
  port: CHAT_HISTORY_API_BASE_URL,
});

function normalizeChatHistoryResponse(payload = {}) {
  const data = payload.data || payload.result || payload;
  const records = Array.isArray(data.records) ? data.records : [];

  return {
    roomCode: data.roomCode || CHAT_ROOM_CODE,
    total: Number(data.total || 0),
    pageSize: Number(data.pageSize || CHAT_HISTORY_PAGE_SIZE),
    nextBeforeId: data.nextBeforeId || null,
    hasMore: Boolean(data.hasMore),
    generatedAt: data.generatedAt || '',
    records: records.map(item => ({
      dbId: item.id,
      id: item.senderId || '',
      messageId: item.messageId || `message-${item.id}`,
      userName: item.userName || '',
      content: item.content || '',
      sendtime: item.sendTime || item.sendtime || '',
      type: item.type || 'USER',
      roomCode: item.roomCode || CHAT_ROOM_CODE,
      isSelf: Boolean(item.isSelf),
    })),
  };
}

export async function fetchChatHistory(params = {}) {
  const payload = await chatHistoryRequest.get('/api/chat/messages', {
    params: {
      roomCode: CHAT_ROOM_CODE,
      pageSize: CHAT_HISTORY_PAGE_SIZE,
      ...params,
    },
  });

  return normalizeChatHistoryResponse(payload);
}

export function saveChatMessage(message = {}) {
  return chatHistoryRequest.post('/api/chat/messages', {
    roomCode: message.roomCode || CHAT_ROOM_CODE,
    messageId: message.messageId,
    senderId: message.id,
    userName: message.userName,
    content: message.content,
    sendTime: message.sendtime,
    type: message.type || 'USER',
  });
}
