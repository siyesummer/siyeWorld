<!--
  SMenuItem 菜单项
  还原 ant-design-vue Menu.Item
  props:
    itemKey: 菜单项标识（对应 antd 的 key，因 key 为 Vue 保留属性，这里用 itemKey）
  events:
    click 透传自身点击
  点击时同时上报给父级 SMenu
-->
<template>
  <li class="s-menu-item" @click="handleClick">
    <slot></slot>
  </li>
</template>

<script>
export default {
  name: 'SMenuItem',

  inject: {
    sMenu: { default: null },
  },

  props: {
    itemKey: {
      type: [String, Number],
      default: undefined,
    },
  },

  methods: {
    handleClick(e) {
      this.$emit('click', e);
      if (this.sMenu) this.sMenu.onItemClick(this.itemKey);
    },
  },
};
</script>

<style lang="less" scoped>
@import '../styles/theme';

.s-menu-item {
  position: relative;
  display: block;
  margin: 0;
  padding: 5px 12px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: @bg-color-gray;
  }
}
</style>
