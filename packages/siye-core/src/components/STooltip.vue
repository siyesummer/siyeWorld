<!--
  STooltip 文字提示
  还原 ant-design-vue Tooltip（hover 显示深色气泡 + 箭头）
  props:
    placement: 'top'（默认，本项目仅用 top）
  slots:
    default: 触发元素
    title: 提示文案
-->
<template>
  <span
    ref="trigger"
    class="s-tooltip-trigger"
    @mouseenter="show"
    @mouseleave="hide"
  >
    <slot></slot>

    <transition name="s-zoom">
      <div
        v-if="visible"
        class="s-tooltip"
        :class="`s-tooltip-placement-${placement}`"
        :style="floatStyle"
      >
        <div class="s-tooltip-content">
          <div class="s-tooltip-arrow"></div>
          <div class="s-tooltip-inner">
            <slot name="title"></slot>
          </div>
        </div>
      </div>
    </transition>
  </span>
</template>

<script>
export default {
  name: 'STooltip',

  props: {
    placement: {
      type: String,
      default: 'top',
    },
  },

  data() {
    return {
      visible: false,
      floatStyle: {},
    };
  },

  methods: {
    async show() {
      this.visible = true;
      await this.$nextTick();
      this.updatePosition();
    },

    hide() {
      this.visible = false;
    },

    updatePosition() {
      const trigger = this.$refs.trigger;
      const float = this.$el.querySelector('.s-tooltip');
      if (!trigger || !float) return;

      const rect = trigger.getBoundingClientRect();
      const fw = float.offsetWidth;
      const fh = float.offsetHeight;

      // 默认 top：水平居中，位于触发元素上方
      const left = rect.width / 2 - fw / 2;
      const top = -fh - 8;

      this.floatStyle = {
        left: `${left}px`,
        top: `${top}px`,
      };
    },
  },
};
</script>

<style lang="less" scoped>
.s-tooltip-trigger {
  position: relative;
  display: inline-block;
}

.s-tooltip {
  position: absolute;
  z-index: 1060;
  display: block;
  max-width: 250px;
  font-size: 12px;
  line-height: 1.5;

  .s-tooltip-inner {
    min-width: 30px;
    min-height: 32px;
    padding: 6px 8px;
    color: #fff;
    text-align: left;
    text-decoration: none;
    word-wrap: break-word;
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .s-tooltip-arrow {
    position: absolute;
    bottom: -4px;
    left: 50%;
    width: 8px;
    height: 8px;
    margin-left: -4px;
    background-color: rgba(0, 0, 0, 0.75);
    transform: rotate(45deg);
  }
}

// zoom 过渡
.s-zoom-enter-active,
.s-zoom-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.s-zoom-enter,
.s-zoom-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
