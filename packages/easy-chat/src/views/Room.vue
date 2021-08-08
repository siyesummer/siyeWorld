<template>
  <div class="chat-room" ref="chatRoom" :style="chatRoomStyle">
    <div class="room-header" ref="roomHeader" @click.stop>
      <img class="img" :src="photoSrc" />

      <div class="title">
        <!-- 你好，易聊(⊙o⊙)… -->
        <span
          v-if="!isEdit"
          @click="onEditName"
        >{{userName.trim() ? `昵称: ${userName.trim()}` : '编辑昵称'}}</span>

        <Input
          v-if="isEdit"
          v-model="userName"
          ref="userName"
          :maxLength="6"
          placeholder="你的昵称"
          style="display:inline-block"
          @mousedown="e => e.stopPropagation()"
          @blur="isEdit = false"
        />
      </div>
    </div>

    <div class="room-content" ref="roomContent">
      <div class="message-item" v-for="item in dataList" :key="item.messageId">
        <div class="left-block">
          <img class="avatar" :src="photoSrc" alt />
        </div>
        <div class="right-block">
          <div class="content">
            <span class="user-name" v-if="item.userName">{{item.userName}}：</span>
            <span class="text">{{ item.content }}</span>
          </div>

          <div class="sendtime">{{ dayjs(item.sendtime).format('YYYY年MM月DD日 HH:mm') }}</div>
        </div>
      </div>
    </div>

    <div class="room-footer">
      <Input
        v-model="chatValue"
        :maxLength="25"
        placeholder="和大家一起聊聊吧^_^"
        @pressEnter="handleEnter"
      />
    </div>
  </div>
</template>

<script>
import io from 'socket.io/client-dist/socket.io';
import MoveElement from 'siye-core/src/modules/class/move.class';
import dayjs from 'dayjs';
import { Input } from 'ant-design-vue';
import { guid } from 'siye-core/src/utils';
import photo from '../../static/images/xuewei.jpg';
import { CONNECT_URL } from '../../config/index';

export default {
  name: 'EasyChat',

  components: {
    Input,
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
  },

  data() {
    return {
      socketIns: null,
      moveElementIns: null,
      photoSrc: photo,
      chatValue: '',
      userName: '',
      uid: null,
      dataList: [],
      isEdit: false,
    };
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
  directives: {
    focus: {},
  },
  mounted() {
    this.setupConnect();

    const moveElementIns = new MoveElement({
      el: this.$refs.roomHeader,
      moveEl: this.$refs.chatRoom,
    });
    this.moveElementIns = moveElementIns;
  },
  beforeDestroy() {
    // eslint-disable-next-line no-unused-expressions
    this.moveElementIns && this.moveElementIns.clearEvent();
    this.socketIns.on('disconnect');
  },
  methods: {
    dayjs,
    setupConnect() {
      const socket = io(CONNECT_URL);

      this.socketIns = socket;

      socket.on('connect', () => {
        this.uid = guid();

        socket.emit(
          'linkStart',
          this.genMessage(this.uid, '一位新朋友加入了聊天室')
        );
      });

      socket.on('linkSuccess', msg => {
        console.log('新用户', msg);
      });

      socket.on('backClientMsg', msg => {
        console.log('接收服务端数据', msg);
        const result = this.dataList.find(i => i.messageId === msg.messageId);
        if (result) return;

        this.dataList.push(msg);

        this.scrollToBottom();
      });
    },

    handleEnter() {
      const content = this.chatValue.trim();
      if (!content) {
        this.chatValue = '';
        return;
      }

      this.socketIns.emit('clientMsg', this.genMessage(guid(), content));

      this.chatValue = '';
    },

    genMessage(id, content) {
      return {
        id,
        messageId: guid(),
        sendtime: dayjs(),
        userName: this.userName.trim(),
        content,
      };
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.roomContent.scrollTop = this.$refs.roomContent.scrollHeight;
      });
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
  border: 1px solid #dce6f0;
  border-radius: 3px;
  position: fixed;
  z-index: 99999;
  background-color: @bg-color;
  padding: 5px 10px;
  display: flex;
  flex-direction: column;

  &:hover {
    // hover时显示滚动条
    div::-webkit-scrollbar-thumb {
      display: block;
    }
  }

  .room-header {
    display: flex;
    height: 60px;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
    cursor: move;

    .img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 5px;
    }

    .title {
      flex-grow: 1;

      span {
        display: inline-block;
        align-items: center;
        height: 45px;
        line-height: 45px;
      }
    }
  }

  .room-content {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px 0;
    .message-item {
      min-height: 50px;
      display: flex;
      padding-top: 5px;
      box-sizing: border-box;
      .left-block {
        min-width: 35px;
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
          }
        }
        .sendtime {
          color: #999;
          font-size: 9px;
        }
      }
    }
  }

  .room-footer {
    display: flex;
    align-items: center;
  }

  /*滚动条整体部分*/
  div::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  /*滚动条的轨道*/
  div::-webkit-scrollbar-track {
    background-color: @bg-color;
  }

  /*滚动条里面的小方块，能向上向下移动*/
  div::-webkit-scrollbar-thumb {
    background-color: #bfbfbf;
    border-radius: 5px;
    border: 1px solid #f1f1f1;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    display: none;
  }

  div::-webkit-scrollbar-thumb:hover {
    background-color: #a8a8a8;
  }

  div::-webkit-scrollbar-thumb:active {
    background-color: #787878;
  }

  /*边角，即两个滚动条的交汇处*/
  div::-webkit-scrollbar-corner {
    background-color: @bg-color;
  }
}
</style>
