<!--
  SAvatar 头像
  还原 ant-design-vue Avatar（圆形图片）
  props:
    src: 图片地址
    size: 尺寸（px），默认 32
  events:
    click
-->
<template>
  <span class="s-avatar" :style="sizeStyle" @click="$emit('click', $event)">
    <img v-if="src" :src="src" class="s-avatar-img" />
    <slot v-else></slot>
  </span>
</template>

<script>
export default {
  name: 'SAvatar',

  props: {
    src: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 32,
    },
  },

  computed: {
    sizeStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`,
        lineHeight: `${this.size}px`,
      };
    },
  },
};
</script>

<style lang="less" scoped>
.s-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #fff;
  white-space: nowrap;
  text-align: center;
  vertical-align: middle;
  background: #ccc;
  border-radius: 50%;

  .s-avatar-img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
