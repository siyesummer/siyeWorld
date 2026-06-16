<!--
  SSpin 加载中
  还原 ant-design-vue Spin（四点旋转指示 + 内容遮罩）
  props:
    spinning: 是否旋转
  slots:
    default: 被包裹内容
-->
<template>
  <div class="s-spin-nested-loading">
    <div v-if="spinning" class="s-spin s-spin-spinning">
      <span class="s-spin-dot">
        <i class="s-spin-dot-item"></i>
        <i class="s-spin-dot-item"></i>
        <i class="s-spin-dot-item"></i>
        <i class="s-spin-dot-item"></i>
      </span>
    </div>
    <div class="s-spin-container" :class="{ 's-spin-blur': spinning }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SSpin',

  props: {
    spinning: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="less" scoped>
@import '../styles/theme';

.s-spin-nested-loading {
  position: relative;

  .s-spin {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 4;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .s-spin-dot {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    font-size: 20px;
    animation: s-spin-rotate 1.2s infinite linear;

    .s-spin-dot-item {
      position: absolute;
      display: block;
      width: 9px;
      height: 9px;
      background-color: @primary-color;
      border-radius: 100%;
      opacity: 0.3;
      transform: scale(0.75);
      transform-origin: 50% 50%;
      animation: s-spin-move 1s infinite linear alternate;

      &:nth-child(1) {
        top: 0;
        left: 0;
      }
      &:nth-child(2) {
        top: 0;
        right: 0;
        animation-delay: 0.4s;
      }
      &:nth-child(3) {
        right: 0;
        bottom: 0;
        animation-delay: 0.8s;
      }
      &:nth-child(4) {
        bottom: 0;
        left: 0;
        animation-delay: 1.2s;
      }
    }
  }

  .s-spin-container {
    position: relative;
    transition: opacity 0.3s;

    &.s-spin-blur {
      clear: both;
      opacity: 0.5;
      user-select: none;
      pointer-events: none;
    }
  }
}

@keyframes s-spin-rotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes s-spin-move {
  to {
    opacity: 1;
  }
}
</style>
