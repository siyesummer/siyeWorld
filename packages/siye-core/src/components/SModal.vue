<!--
  SModal 对话框
  还原 ant-design-vue Modal
  props:
    value: v-model 显隐
    title / okText / cancelText
    confirmLoading: 确定按钮 loading
    centered: 垂直居中
    width: 宽度（number=px 或 字符串）
    footer: 传 null 则不渲染底部
    zIndex: 层级
  events:
    ok / cancel
  说明：点击遮罩 / 关闭✕ / 取消按钮 → 触发 cancel 并关闭（更新 v-model）；
        点击确定仅触发 ok，由父级决定是否关闭（与 antd 一致）
  slots:
    default: 弹窗主体
-->
<template>
  <transition name="s-fade">
    <div v-if="value" class="s-modal-root" :style="{ zIndex }">
      <div class="s-modal-mask"></div>
      <div class="s-modal-wrap" :class="{ 's-modal-centered': centered }" @click.self="onMaskClick">
        <transition name="s-modal-zoom" appear>
          <div v-if="value" class="s-modal" :style="{ width: modalWidth }">
            <!-- 关闭按钮 -->
            <button type="button" class="s-modal-close" @click="onCancel">
              <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
                <path
                  d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
                />
              </svg>
            </button>

            <!-- 标题 -->
            <div v-if="title" class="s-modal-header">
              <div class="s-modal-title">{{ title }}</div>
            </div>

            <!-- 主体 -->
            <div class="s-modal-body">
              <slot></slot>
            </div>

            <!-- 底部 -->
            <div v-if="footer !== null" class="s-modal-footer">
              <button type="button" class="s-btn s-btn-default" @click="onCancel">
                {{ cancelText }}
              </button>
              <button
                type="button"
                class="s-btn s-btn-primary"
                :class="{ 's-btn-loading': confirmLoading }"
                :disabled="confirmLoading"
                @click="onOk"
              >
                <span v-if="confirmLoading" class="s-btn-spin"></span>
                {{ okText }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SModal',

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    okText: {
      type: String,
      default: '确定',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    confirmLoading: {
      type: Boolean,
      default: false,
    },
    centered: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [String, Number],
      default: 520,
    },
    // 传 null 表示不展示底部按钮
    footer: {
      type: null,
      default: undefined,
    },
    zIndex: {
      type: Number,
      default: 1000,
    },
  },

  computed: {
    modalWidth() {
      return typeof this.width === 'number' ? `${this.width}px` : this.width;
    },
  },

  methods: {
    onMaskClick() {
      this.onCancel();
    },
    onCancel() {
      this.$emit('change', false);
      this.$emit('cancel');
    },
    onOk() {
      this.$emit('ok');
    },
  },
};
</script>

<style lang="less" scoped>
@import '../styles/theme';

.s-modal-root {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.s-modal-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.45);
}

.s-modal-wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  outline: 0;

  &.s-modal-centered {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.s-modal {
  position: relative;
  box-sizing: border-box;
  max-width: calc(100vw - 32px);
  margin: 100px auto;
  padding: 0;
  color: @text-color;
  background-color: #fff;
  border-radius: @border-radius-base;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  .s-modal-centered & {
    margin: 0;
    top: 0;
  }

  .s-modal-close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    width: 56px;
    height: 56px;
    padding: 0;
    color: rgba(0, 0, 0, 0.45);
    font-size: 16px;
    background: transparent;
    border: 0;
    outline: 0;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: rgba(0, 0, 0, 0.75);
    }
  }

  .s-modal-header {
    padding: 16px 24px;
    border-bottom: 1px solid #f0f0f0;
    border-radius: @border-radius-base @border-radius-base 0 0;

    .s-modal-title {
      margin: 0;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
    }
  }

  .s-modal-body {
    padding: 24px;
    font-size: @font-size-base;
    line-height: 1.5;
  }

  // 还原原 LoginModal 里 .ant-modal-footer { text-align:center }
  .s-modal-footer {
    padding: 10px 16px;
    text-align: center;
    border-top: 1px solid #f0f0f0;
    border-radius: 0 0 @border-radius-base @border-radius-base;
  }
}

// 按钮
.s-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 4px 15px;
  font-size: @font-size-base;
  line-height: 1.5;
  border: 1px solid @border-color-base;
  border-radius: @border-radius-base;
  cursor: pointer;
  transition: all 0.3s;
  outline: none;

  + .s-btn {
    margin-left: 8px;
  }

  &.s-btn-default {
    color: @text-color;
    background-color: #fff;

    &:hover {
      color: @primary-color;
      border-color: @primary-color;
    }
  }

  // 还原原 all.less 的 ant-btn-primary 主题
  &.s-btn-primary {
    color: #fff;
    background-color: @primary-color;
    border-color: @primary-color;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);

    &:hover {
      background-color: @primary-color;
      box-shadow: none;
    }
  }

  &.s-btn-loading {
    cursor: default;
    opacity: 0.65;
  }

  .s-btn-spin {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-right: 8px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: s-btn-spin 1s linear infinite;
  }
}

@keyframes s-btn-spin {
  to {
    transform: rotate(360deg);
  }
}

// 遮罩淡入
.s-fade-enter-active,
.s-fade-leave-active {
  transition: opacity 0.3s;
}
.s-fade-enter,
.s-fade-leave-to {
  opacity: 0;
}

// 弹窗 zoom
.s-modal-zoom-enter-active,
.s-modal-zoom-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.s-modal-zoom-enter,
.s-modal-zoom-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
