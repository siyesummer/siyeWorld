<!--
  SPopover 气泡卡片
  还原 ant-design-vue Popover（点击触发、箭头、点击外部关闭）
  props:
    value: v-model 显隐
    trigger: 'click'（本项目仅用 click）
    placement: 'top' | 'topRight'
    overlayClassName: 透传到浮层根（外部覆盖钩子）
    overlayStyle: 透传到浮层根的内联样式（如 z-index）
  slots:
    default: 触发元素
    content: 浮层内容
-->
<template>
  <span ref="trigger" class="s-popover-trigger" @click="onTriggerClick">
    <slot></slot>

    <transition name="s-zoom">
      <div
        v-show="innerVisible"
        ref="overlay"
        class="s-popover"
        :class="[`s-popover-placement-${placement}`, overlayClassName]"
        :style="[floatStyle, overlayStyle]"
        @click.stop
      >
        <div class="s-popover-content">
          <div class="s-popover-arrow"></div>
          <div class="s-popover-inner">
            <div class="s-popover-inner-content">
              <slot name="content"></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </span>
</template>

<script>
export default {
  name: 'SPopover',

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    trigger: {
      type: String,
      default: 'click',
    },
    placement: {
      type: String,
      default: 'top',
    },
    overlayClassName: {
      type: String,
      default: '',
    },
    overlayStyle: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      innerVisible: this.value,
      floatStyle: {},
    };
  },

  watch: {
    value(val) {
      this.setVisible(val);
    },
  },

  mounted() {
    document.addEventListener('click', this.onDocumentClick, true);
    if (this.innerVisible) this.updatePosition();
  },

  beforeDestroy() {
    document.removeEventListener('click', this.onDocumentClick, true);
  },

  methods: {
    onTriggerClick() {
      this.setVisible(!this.innerVisible);
    },

    async setVisible(val) {
      if (val === this.innerVisible) {
        if (val) {
          await this.$nextTick();
          this.updatePosition();
        }
        return;
      }
      this.innerVisible = val;
      this.$emit('change', val);
      if (val) {
        await this.$nextTick();
        this.updatePosition();
      }
    },

    onDocumentClick(e) {
      if (!this.innerVisible) return;
      if (this.$el.contains(e.target)) return;
      this.setVisible(false);
    },

    updatePosition() {
      const trigger = this.$refs.trigger;
      const overlay = this.$refs.overlay;
      if (!trigger || !overlay) return;

      const tw = trigger.offsetWidth;
      const ow = overlay.offsetWidth;
      const oh = overlay.offsetHeight;
      const gap = 10;

      let left;
      if (this.placement === 'topRight') {
        left = tw - ow;
      } else {
        // top：水平居中
        left = tw / 2 - ow / 2;
      }

      this.floatStyle = {
        left: `${left}px`,
        top: `${-oh - gap}px`,
      };
    },
  },
};
</script>

<style lang="less" scoped>
.s-popover-trigger {
  position: relative;
  display: inline-block;
}

.s-popover {
  position: absolute;
  z-index: 1030;
  font-size: 12px;
  line-height: 1.5;
  cursor: auto;
  user-select: text;

  .s-popover-inner {
    background-color: #fff;
    background-clip: padding-box;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .s-popover-inner-content {
    padding: 12px 16px;
    color: rgba(0, 0, 0, 0.85);
  }

  // 箭头（指向下方触发元素）
  .s-popover-arrow {
    position: absolute;
    bottom: 6px;
    display: block;
    width: 8.48528137px;
    height: 8.48528137px;
    background: #fff;
    border-style: solid;
    border-width: 4.24264069px;
    border-color: transparent #fff #fff transparent;
    box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.07);
    transform: rotate(45deg);
  }

  &.s-popover-placement-top {
    .s-popover-arrow {
      left: 50%;
      margin-left: -4.24264069px;
    }
  }

  &.s-popover-placement-topRight {
    .s-popover-arrow {
      right: 16px;
    }
  }
}

// zoom 过渡
.s-zoom-enter-active,
.s-zoom-leave-active {
  transition: opacity 0.2s, transform 0.2s;
  transform-origin: bottom center;
}
.s-zoom-enter,
.s-zoom-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
