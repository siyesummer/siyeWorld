<!--
  SSkeleton 骨架屏
  还原 ant-design-vue Skeleton（标题条 + 段落多行）
  props:
    active: 是否开启 shimmer 动画
    rows: 段落行数（默认 3）
-->
<template>
  <div class="s-skeleton" :class="{ 's-skeleton-active': active }">
    <div class="s-skeleton-content">
      <h3 class="s-skeleton-title"></h3>
      <ul class="s-skeleton-paragraph">
        <li v-for="n in rows" :key="n"></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SSkeleton',

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: Number,
      default: 3,
    },
  },
};
</script>

<style lang="less" scoped>
@skeleton-color: #f2f2f2;
@skeleton-to-color: #e6e6e6;

.s-skeleton {
  display: table;
  width: 100%;

  .s-skeleton-content {
    display: table-cell;
    width: 100%;
    vertical-align: top;
  }

  .s-skeleton-title {
    width: 38%;
    height: 16px;
    margin-top: 16px;
    background: @skeleton-color;
    border-radius: 4px;
  }

  .s-skeleton-paragraph {
    padding: 0;
    margin: 24px 0 0;

    li {
      width: 100%;
      height: 16px;
      list-style: none;
      background: @skeleton-color;
      border-radius: 4px;

      + li {
        margin-top: 16px;
      }

      &:last-child {
        width: 61%;
      }
    }
  }
}

// active 态：横向 shimmer 动画（还原 antd 渐变扫光）
.s-skeleton-active {
  .s-skeleton-title,
  .s-skeleton-paragraph li {
    position: relative;
    z-index: 0;
    overflow: hidden;
    background: linear-gradient(
      90deg,
      @skeleton-color 25%,
      @skeleton-to-color 37%,
      @skeleton-color 63%
    );
    background-size: 400% 100%;
    animation: s-skeleton-loading 1.4s ease infinite;
  }
}

@keyframes s-skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
