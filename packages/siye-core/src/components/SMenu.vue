<!--
  SMenu 菜单
  还原 ant-design-vue Menu
  通过 provide 暴露 onItemClick，子项点击时上报 key
  events:
    click({ key }) 菜单项被点击
-->
<template>
  <ul class="s-menu">
    <slot></slot>
  </ul>
</template>

<script>
export default {
  name: 'SMenu',

  provide() {
    return {
      sMenu: this,
    };
  },

  methods: {
    onItemClick(key) {
      this.$emit('click', { key });
    },
  },
};
</script>

<style lang="less" scoped>
@import '../styles/theme';

.s-menu {
  padding: 4px 0;
  margin: 0;
  color: @text-color;
  font-size: @font-size-base;
  list-style: none;
  background: #fff;
  border-radius: @border-radius-base;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  outline: none;
}
</style>
