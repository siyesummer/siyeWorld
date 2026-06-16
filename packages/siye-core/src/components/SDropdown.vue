<!--
  SDropdown 下拉菜单
  还原 ant-design-vue Dropdown
  props:
    trigger: ['click']（本项目仅用 click）
    placement: 'bottomRight' | 'bottomLeft'
  slots:
    default: 触发元素
    overlay: 下拉浮层（通常是 SMenu）
  说明：点击触发元素切换显隐；点击浮层内容（菜单项）或外部均关闭
-->
<template>
  <span ref="trigger" class="s-dropdown-trigger" @click="toggle">
    <slot></slot>

    <transition name="s-slide">
      <div
        v-show="visible"
        ref="overlay"
        class="s-dropdown"
        :class="`s-dropdown-placement-${placement}`"
        :style="floatStyle"
        @click="onOverlayClick"
      >
        <slot name="overlay"></slot>
      </div>
    </transition>
  </span>
</template>

<script>
export default {
  name: 'SDropdown',

  props: {
    trigger: {
      type: Array,
      default: () => ['click'],
    },
    placement: {
      type: String,
      default: 'bottomLeft',
    },
  },

  data() {
    return {
      visible: false,
      floatStyle: {},
    };
  },

  mounted() {
    document.addEventListener('click', this.onDocumentClick, true);
  },

  beforeDestroy() {
    document.removeEventListener('click', this.onDocumentClick, true);
  },

  methods: {
    async toggle() {
      this.visible = !this.visible;
      if (this.visible) {
        await this.$nextTick();
        this.updatePosition();
      }
    },

    onOverlayClick() {
      // 选中菜单项后关闭（菜单自身的 click 先于此冒泡处理）
      this.visible = false;
    },

    onDocumentClick(e) {
      if (!this.visible) return;
      if (this.$el.contains(e.target)) return;
      this.visible = false;
    },

    updatePosition() {
      const trigger = this.$refs.trigger;
      const overlay = this.$refs.overlay;
      if (!trigger || !overlay) return;

      const tw = trigger.offsetWidth;
      const th = trigger.offsetHeight;
      const ow = overlay.offsetWidth;
      const gap = 4;

      const left = this.placement === 'bottomRight' ? tw - ow : 0;

      this.floatStyle = {
        left: `${left}px`,
        top: `${th + gap}px`,
      };
    },
  },
};
</script>

<style lang="less" scoped>
.s-dropdown-trigger {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.s-dropdown {
  position: absolute;
  z-index: 1050;
  min-width: 120px;
}

// slide 过渡
.s-slide-enter-active,
.s-slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
  transform-origin: top center;
}
.s-slide-enter,
.s-slide-leave-to {
  opacity: 0;
  transform: scaleY(0.8);
}
</style>
