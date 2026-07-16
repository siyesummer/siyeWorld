<template>
  <div class="chat-room" ref="chatRoom" :style="chatRoomStyle">
    <div class="room-header" ref="roomHeader" @click.stop>
      <img class="img" :src="photoSrc" alt="avatar" />

      <div class="title">
        <span
          v-if="!isEdit"
          @click="onEditName"
        >{{ userName.trim() ? `昵称: ${userName.trim()}` : '编辑昵称' }}</span>

        <Input
          v-else
          v-model="userName"
          ref="userName"
          :maxlength="6"
          placeholder="你的昵称"
          style="display:inline-block"
          @mousedown.native="e => e.stopPropagation()"
          @blur="onNameBlur"
        />
      </div>
    </div>

    <div
      class="room-content"
      ref="roomContent"
      @scroll.passive="handleContentScroll"
    >
      <div v-if="loadingHistory || showNoMoreHistoryTip" class="history-tip">
        {{ loadingHistory ? '正在加载更多消息...' : '没有更多信息了' }}
      </div>
      <div v-else-if="historyLoaded && !dataList.length" class="history-tip history-tip--empty">
        暂无聊天记录，发一条消息试试吧。
      </div>

      <div
        class="message-item"
        :class="{ 'message-item--self': isOwnMessage(item) }"
        v-for="item in dataList"
        :key="item.messageId"
      >
        <div class="left-block">
          <img class="avatar" :src="photoSrc" alt="avatar" />
        </div>
        <div class="right-block">
          <div class="content">
            <span class="user-name" v-if="item.userName">{{ item.userName }}：</span>
            <span class="text">{{ item.content }}</span>
          </div>

          <div class="sendtime">{{ formatSendTime(item.sendtime) }}</div>
        </div>
      </div>
    </div>

    <div class="room-footer">
      <Input
        v-model="chatValue"
        :maxlength="25"
        placeholder="和大家一起聊聊天吧 ^_^"
        @pressEnter="handleEnter"
      />
    </div>
  </div>
</template>

<script>
import io from 'socket.io/client-dist/socket.io';
import MoveElement from 'siye-core/src/modules/class/move.class';
import dayjs from 'dayjs';
import { SInput } from 'siye-core/src/components';
import { guid } from 'siye-core/src/utils';
import {
  CHAT_HISTORY_PAGE_SIZE,
  CHAT_ROOM_CODE,
  CONNECT_URL,
} from '../../config/index';
import { fetchChatHistory, saveChatMessage } from '../api/chat';

const TOP_LOAD_THRESHOLD = 16;
const BOTTOM_STICK_THRESHOLD = 48;
const CHAT_SENDER_ID_STORAGE_KEY = 'easy-chat:sender-id';
const CHAT_USER_NAME_STORAGE_KEY = 'easy-chat:user-name';

function readChatIdentity() {
  const identity = {
    senderId: '',
    userName: '',
  };

  try {
    identity.senderId = window.localStorage.getItem(CHAT_SENDER_ID_STORAGE_KEY) || '';
    identity.userName = (window.localStorage.getItem(CHAT_USER_NAME_STORAGE_KEY) || '').trim().slice(0, 6);
  } catch (error) {
    // localStorage may be unavailable in private browsing or restricted webviews.
  }

  return identity;
}

function writeChatIdentity(senderId, userName) {
  try {
    window.localStorage.setItem(CHAT_SENDER_ID_STORAGE_KEY, senderId);
    window.localStorage.setItem(CHAT_USER_NAME_STORAGE_KEY, userName);
  } catch (error) {
    // Chat can continue with in-memory identity when localStorage is unavailable.
  }
}

const storedIdentity = readChatIdentity();

export default {
  name: 'EasyChat',

  components: {
    Input: SInput,
  },

  props: {
    width: {
      type: String,
      default: '280px',
    },
    minHeight: {
      type: String,
      default: '300px',
    },
    maxHeight: {
      type: String,
      default: '550px',
    },
    right: {
      type: [String, Number],
      default: '20px',
    },
    top: {
      type: [String, Number],
      default: '100px',
    },
    customStyle: {
      type: Object,
      default() {
        return {};
      },
    },
    persistMessages: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      socketIns: null,
      moveElementIns: null,
      photoSrc: 'https://avatar.hitv.com/0758c44d6ce15f21b7ac05c2bea2e466/uwsUD8k9vFUv.jpg',
      chatValue: '',
      userName: storedIdentity.userName,
      uid: storedIdentity.senderId || guid(),
      dataList: [],
      isEdit: false,
      loadingHistory: false,
      hasMoreHistory: true,
      historyLoaded: false,
      historyCursor: null,
      showNoMoreHistoryTip: false,
    };
  },

  created() {
    this.persistChatIdentity();
  },

  computed: {
    chatRoomStyle() {
      const { width, minHeight, maxHeight, top, right, customStyle } = this;

      return {
        width,
        minHeight,
        maxHeight,
        top,
        right,
        ...customStyle,
      };
    },
  },

  mounted() {
    this.setupConnect();
    this.loadInitialHistory();

    this.moveElementIns = new MoveElement({
      el: this.$refs.roomHeader,
      moveEl: this.$refs.chatRoom,
    });
  },

  beforeDestroy() {
    if (this.moveElementIns) {
      this.moveElementIns.clearEvent();
    }
    if (this.socketIns) {
      this.socketIns.disconnect();
    }
  },

  methods: {
    formatSendTime(value) {
      if (!value) {
        return '--';
      }
      const parsed = dayjs(value);
      return parsed.isValid() ? parsed.format('YYYY年MM月DD日 HH:mm') : value;
    },
    async loadInitialHistory() {
      this.loadingHistory = true;
      try {
        const result = await fetchChatHistory({
          roomCode: CHAT_ROOM_CODE,
          pageSize: CHAT_HISTORY_PAGE_SIZE,
        });
        this.dataList = this.mergeMessages([], result.records);
        this.hasMoreHistory = result.hasMore;
        this.historyCursor = result.nextBeforeId;
        this.historyLoaded = true;
        this.showNoMoreHistoryTip = false;
        this.scrollToBottom();
      } catch (error) {
        this.historyLoaded = true;
        this.hasMoreHistory = false;
        // eslint-disable-next-line no-console
        console.error('加载聊天记录失败', error);
      } finally {
        this.loadingHistory = false;
      }
    },
    async loadMoreHistory() {
      if (!this.hasMoreHistory || this.loadingHistory || !this.historyCursor) {
        if (!this.hasMoreHistory && this.historyLoaded) {
          this.showNoMoreHistoryTip = true;
        }
        return;
      }

      const contentEl = this.$refs.roomContent;
      const previousScrollHeight = contentEl ? contentEl.scrollHeight : 0;
      const previousScrollTop = contentEl ? contentEl.scrollTop : 0;

      this.loadingHistory = true;
      try {
        const result = await fetchChatHistory({
          roomCode: CHAT_ROOM_CODE,
          pageSize: CHAT_HISTORY_PAGE_SIZE,
          beforeId: this.historyCursor,
        });

        this.dataList = this.mergeMessages(result.records, this.dataList);
        this.hasMoreHistory = result.hasMore;
        this.historyCursor = result.nextBeforeId;
        this.historyLoaded = true;
        this.showNoMoreHistoryTip = !result.hasMore;

        this.$nextTick(() => {
          const currentContentEl = this.$refs.roomContent;
          if (!currentContentEl) {
            return;
          }
          const currentScrollHeight = currentContentEl.scrollHeight;
          currentContentEl.scrollTop = currentScrollHeight - previousScrollHeight + previousScrollTop;
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('加载更多聊天记录失败', error);
      } finally {
        this.loadingHistory = false;
      }
    },
    setupConnect() {
      const socket = io(CONNECT_URL);

      this.socketIns = socket;

      socket.on('connect', () => {
        socket.emit(
          'linkStart',
          this.genMessage(this.uid, '一位新朋友加入了聊天室', 'SYSTEM')
        );
      });

      socket.on('linkSuccess', msg => {
        // eslint-disable-next-line no-console
        console.log('新用户连接', msg);
      });

      socket.on('backClientMsg', msg => {
        const result = this.dataList.find(item => item.messageId === msg.messageId);
        if (result) {
          return;
        }

        const shouldStickToBottom = this.isContentNearBottom();
        this.dataList.push({
          ...msg,
          roomCode: msg.roomCode || CHAT_ROOM_CODE,
        });

        if (shouldStickToBottom || msg.id === this.uid) {
          this.scrollToBottom();
        }
      });
    },
    handleEnter() {
      const content = this.chatValue.trim();
      if (!content) {
        this.chatValue = '';
        return;
      }

      const message = this.genMessage(this.uid, content);
      this.socketIns.emit('clientMsg', message);
      if (this.persistMessages) {
        saveChatMessage(message).catch(error => {
          this.$emit('message-persist-error', {
            error,
            message,
          });
          // eslint-disable-next-line no-console
          console.error('保存聊天消息失败', error);
        });
      }
      this.chatValue = '';
    },
    onNameBlur() {
      this.isEdit = false;
      this.persistChatIdentity();
    },
    persistChatIdentity() {
      writeChatIdentity(this.uid, this.userName.trim().slice(0, 6));
    },
    isOwnMessage(message) {
      return Boolean(message && (
        message.isSelf
        || message.id === this.uid
        || message.senderId === this.uid
      ));
    },
    genMessage(id, content, type = 'USER') {
      return {
        id,
        roomCode: CHAT_ROOM_CODE,
        messageId: guid(),
        sendtime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        userName: this.userName.trim(),
        content,
        type,
      };
    },
    mergeMessages(prependList = [], appendList = []) {
      const result = [];
      const messageIds = new Set();

      [...prependList, ...appendList].forEach(item => {
        if (!item || !item.messageId || messageIds.has(item.messageId)) {
          return;
        }
        messageIds.add(item.messageId);
        result.push(item);
      });

      return result;
    },
    isContentNearBottom() {
      const contentEl = this.$refs.roomContent;
      if (!contentEl) {
        return true;
      }

      return contentEl.scrollHeight - contentEl.scrollTop - contentEl.clientHeight <= BOTTOM_STICK_THRESHOLD;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        if (!this.$refs.roomContent) {
          return;
        }
        this.$refs.roomContent.scrollTop = this.$refs.roomContent.scrollHeight;
      });
    },
    handleContentScroll() {
      const contentEl = this.$refs.roomContent;
      if (!contentEl) {
        return;
      }

      if (contentEl.scrollTop <= TOP_LOAD_THRESHOLD) {
        if (this.hasMoreHistory) {
          this.showNoMoreHistoryTip = false;
          this.loadMoreHistory();
        } else if (this.historyLoaded) {
          this.showNoMoreHistoryTip = true;
        }
        return;
      }

      this.showNoMoreHistoryTip = false;
    },
    onEditName() {
      this.isEdit = true;
      this.$nextTick(() => {
        this.$refs.userName.focus();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.chat-room {
  position: fixed;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  border: 1px solid #dce6f0;
  border-radius: 3px;
  background-color: @bg-color;

  &:hover {
    div::-webkit-scrollbar-thumb {
      display: block;
    }
  }

  .room-header {
    display: flex;
    align-items: center;
    height: 60px;
    border-bottom: 1px solid #e0e0e0;
    cursor: move;

    .img {
      width: 50px;
      height: 50px;
      margin-right: 5px;
      border-radius: 50%;
    }

    .title {
      flex-grow: 1;

      span {
        display: inline-block;
        height: 45px;
        line-height: 45px;
      }
    }
  }

  .room-content {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px 0;
  }

  .history-tip {
    padding: 6px 0 10px;
    color: #8f98a3;
    font-size: 12px;
    text-align: center;

    &--empty {
      padding-top: 18px;
    }
  }

  .message-item {
    display: flex;
    column-gap: 8px;
    box-sizing: border-box;
    min-height: 50px;
    padding-top: 5px;

    .left-block {
      flex: 0 0 30px;
      min-width: 30px;

      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
    }

    .right-block {
      flex-grow: 1;

      .content {
        font-size: 12px;

        .user-name {
          color: #0c73c2;
        }

        .text {
          color: #333;
          word-break: break-word;
        }
      }

      .sendtime {
        color: #999;
        font-size: 9px;
      }
    }

    &--self {
      justify-content: flex-end;

      .left-block {
        order: 2;
      }

      .right-block {
        order: 1;
        flex: 0 1 auto;
        max-width: calc(100% - 38px);
        text-align: right;

        .content,
        .sendtime {
          text-align: right;
        }
      }
    }
  }

  .room-footer {
    display: flex;
    align-items: center;
  }

  div::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  div::-webkit-scrollbar-track {
    background-color: @bg-color;
  }

  div::-webkit-scrollbar-thumb {
    display: none;
    border: 1px solid #f1f1f1;
    border-radius: 5px;
    background-color: #bfbfbf;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  div::-webkit-scrollbar-thumb:hover {
    background-color: #a8a8a8;
  }

  div::-webkit-scrollbar-thumb:active {
    background-color: #787878;
  }

  div::-webkit-scrollbar-corner {
    background-color: @bg-color;
  }
}
</style>
