<!--
  SFormItem 表单项
  还原 ant-design-vue FormModel.Item
  props:
    prop: 对应 model / rules 的字段名
    layout: 'inline' 时行内布局
  从父 SForm 取 model[prop] 校验，规则取自 SForm.rules[prop]
  支持的规则：required / pattern / whitespace / message
  失焦（focusout）时触发校验并在下方红字显示错误
-->
<template>
  <div
    class="s-form-item"
    :class="[
      { 's-form-item-has-error': errorMessage },
      layout === 'inline' ? 's-form-item-inline' : '',
    ]"
    @focusout="onBlur"
  >
    <div class="s-form-item-control">
      <slot></slot>
      <div v-if="errorMessage" class="s-form-item-explain">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SFormItem',

  inject: {
    sForm: { default: null },
  },

  props: {
    prop: {
      type: String,
      default: '',
    },
    layout: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      errorMessage: '',
    };
  },

  computed: {
    fieldValue() {
      if (!this.sForm || !this.prop) return undefined;
      return this.sForm.model[this.prop];
    },
    rules() {
      if (!this.sForm || !this.prop) return [];
      const r = this.sForm.rules[this.prop];
      if (!r) return [];
      return Array.isArray(r) ? r : [r];
    },
  },

  created() {
    if (this.sForm && this.prop) this.sForm.addField(this);
  },

  beforeDestroy() {
    if (this.sForm && this.prop) this.sForm.removeField(this);
  },

  methods: {
    onBlur() {
      if (this.rules.length) this.validate();
    },

    // 按顺序校验规则，返回首个错误的 message；通过则置空
    validate() {
      const value = this.fieldValue;
      for (let i = 0; i < this.rules.length; i += 1) {
        const error = this.checkRule(this.rules[i], value);
        if (error) {
          this.errorMessage = error;
          return false;
        }
      }
      this.errorMessage = '';
      return true;
    },

    checkRule(rule, value) {
      const str = value === undefined || value === null ? '' : String(value);

      if (rule.required) {
        const isEmpty = rule.whitespace ? str.trim() === '' : str === '';
        if (isEmpty) return rule.message || '必填项';
      }

      if (rule.pattern && str !== '') {
        if (!rule.pattern.test(str)) return rule.message || '格式不正确';
      }

      return '';
    },

    clearValidate() {
      this.errorMessage = '';
    },
  },
};
</script>

<style lang="less" scoped>
@import '../styles/theme';

.s-form-item {
  margin-bottom: 24px;

  &.s-form-item-inline {
    display: inline-block;
    margin-right: 16px;
    vertical-align: top;
  }

  .s-form-item-control {
    position: relative;
  }

  .s-form-item-explain {
    min-height: 22px;
    margin-top: 2px;
    color: @error-color;
    font-size: @font-size-base;
    line-height: 1.5;
  }
}
</style>
