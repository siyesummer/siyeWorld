<!--
  SInput 输入框
  还原 ant-design-vue Input
  props:
    value: v-model 绑定值
    placeholder / maxlength / disabled
    allowClear: 有值时显示清除按钮
  slots:
    prefix: 前置内容（如图标）
  events:
    input / change / pressEnter / focus / blur
-->
<template>
  <span
    class="s-input-affix-wrapper"
    :class="{ 's-input-affix-wrapper-focused': focused }"
    v-if="hasPrefix || allowClear"
    @click="focusInput"
  >
    <span v-if="hasPrefix" class="s-input-prefix">
      <slot name="prefix"></slot>
    </span>
    <input
      ref="input"
      class="s-input"
      :value="value"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :disabled="disabled"
      @input="handleInput"
      @change="$emit('change', $event.target.value)"
      @keydown.enter="$emit('pressEnter', $event)"
      @focus="onFocus"
      @blur="onBlur"
    />
    <span
      v-if="allowClear && value"
      class="s-input-clear"
      @click="handleClear"
    >
      <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
        <path
          d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"
        />
      </svg>
    </span>
  </span>
  <input
    v-else
    ref="input"
    class="s-input"
    :value="value"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :disabled="disabled"
    @input="handleInput"
    @change="$emit('change', $event.target.value)"
    @keydown.enter="$emit('pressEnter', $event)"
    @focus="onFocus"
    @blur="onBlur"
  />
</template>

<script>
export default {
  name: 'SInput',

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
    disabled: {
      type: Boolean,
      default: false,
    },
    allowClear: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      focused: false,
    };
  },

  computed: {
    hasPrefix() {
      return !!this.$slots.prefix;
    },
  },

  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value);
    },
    handleClear() {
      this.$emit('input', '');
      this.$emit('change', '');
      this.focusInput();
    },
    focusInput() {
      this.$refs.input && this.$refs.input.focus();
    },
    // 对外暴露 focus / blur，便于 ref 调用（对齐 antd Input API）
    focus() {
      this.focusInput();
    },
    blur() {
      this.$refs.input && this.$refs.input.blur();
    },
    onFocus(e) {
      this.focused = true;
      this.$emit('focus', e);
    },
    onBlur(e) {
      this.focused = false;
      this.$emit('blur', e);
    },
  },
};
</script>

<style lang="less" scoped>
@import '../styles/theme';

.s-input {
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  padding: 4px 11px;
  color: @text-color;
  font-size: @font-size-base;
  line-height: 1.5;
  background-color: #fff;
  border: 1px solid @border-color-base;
  border-radius: @border-radius-base;
  transition: all 0.3s;
  outline: none;

  &::placeholder {
    color: #bfbfbf;
  }

  &:hover {
    border-color: @primary-color;
  }

  // 还原原 input.less：聚焦态去掉默认蓝色外发光
  &:focus {
    border-color: @border-color-base;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0);
  }

  &:disabled {
    color: @disabled-color;
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
}

.s-input-affix-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
  padding: 0 11px;
  background-color: #fff;
  border: 1px solid @border-color-base;
  border-radius: @border-radius-base;
  transition: all 0.3s;

  &:hover {
    border-color: @primary-color;
  }

  &.s-input-affix-wrapper-focused {
    border-color: @primary-color;
  }

  .s-input {
    width: 100%;
    height: 30px;
    padding: 4px 0;
    border: none;

    &:hover,
    &:focus {
      border: none;
      box-shadow: none;
    }
  }

  .s-input-prefix {
    display: inline-flex;
    align-items: center;
    margin-right: 4px;
  }

  .s-input-clear {
    display: inline-flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.25);
    font-size: 12px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: rgba(0, 0, 0, 0.45);
    }
  }
}
</style>
