<!--
  SInputSearch 搜索输入框
  还原 ant-design-vue Input.Search
  props:
    value: v-model 绑定值
    placeholder / maxlength
    enterButton: 是否显示搜索按钮
  events:
    input / pressEnter / search（回车或点击按钮均触发）
-->
<template>
  <span class="s-input-search" :class="{ 's-input-search-enter-button': enterButton }">
    <input
      class="s-input"
      :value="value"
      :placeholder="placeholder"
      :maxlength="maxlength"
      @input="$emit('input', $event.target.value)"
      @keydown.enter="handleEnter"
    />
    <button
      v-if="enterButton"
      type="button"
      class="s-input-search-button"
      @click="handleSearch"
    >
      <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
        <path
          d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"
        />
      </svg>
    </button>
  </span>
</template>

<script>
export default {
  name: 'SInputSearch',

  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    maxlength: {
      type: [String, Number],
      default: undefined,
    },
    enterButton: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    handleEnter(e) {
      this.$emit('pressEnter', e);
      this.$emit('search', this.value, e);
    },
    handleSearch(e) {
      this.$emit('pressEnter', e);
      this.$emit('search', this.value, e);
    },
  },
};
</script>

<style lang="less" scoped>
@import '../styles/theme';

.s-input-search {
  display: inline-flex;
  width: 100%;
  vertical-align: middle;

  .s-input {
    box-sizing: border-box;
    flex: 1;
    height: 32px;
    padding: 4px 11px;
    color: @text-color;
    font-size: @font-size-base;
    line-height: 1.5;
    background-color: #fff;
    border: 1px solid @border-color-base;
    border-radius: @border-radius-base;
    outline: none;
    transition: all 0.3s;

    &::placeholder {
      color: #bfbfbf;
    }

    &:hover {
      border-color: @primary-color;
    }

    &:focus {
      border-color: @border-color-base;
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0);
    }
  }

  &.s-input-search-enter-button {
    .s-input {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
    }
  }

  .s-input-search-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 32px;
    color: #fff;
    font-size: 16px;
    background-color: @primary-color;
    border: 1px solid @primary-color;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: @border-radius-base;
    border-bottom-right-radius: @border-radius-base;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);

    &:hover {
      background-color: @primary-color;
      box-shadow: none;
    }
  }
}
</style>
