<!--
  SForm 表单
  还原 ant-design-vue FormModel
  props:
    model: 表单数据对象
    rules: 校验规则 { [prop]: rule[] }
  通过 provide 暴露表单上下文给 SFormItem 注册
  methods:
    validate(callback): 校验全部字段，callback(valid)
    resetFields() / clearValidate()
-->
<template>
  <form class="s-form" @submit.prevent>
    <slot></slot>
  </form>
</template>

<script>
export default {
  name: 'SForm',

  provide() {
    return {
      sForm: this,
    };
  },

  props: {
    model: {
      type: Object,
      default: () => ({}),
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      fields: [],
    };
  },

  methods: {
    addField(field) {
      this.fields.push(field);
    },

    removeField(field) {
      this.fields = this.fields.filter(f => f !== field);
    },

    // 校验全部字段；兼容 antd 的 validate(cb => ...) 用法
    validate(callback) {
      let valid = true;
      this.fields.forEach(field => {
        const ok = field.validate();
        if (!ok) valid = false;
      });
      if (typeof callback === 'function') callback(valid);
      return valid;
    },

    clearValidate() {
      this.fields.forEach(field => field.clearValidate());
    },

    resetFields() {
      this.fields.forEach(field => field.clearValidate());
    },
  },
};
</script>

<style lang="less" scoped>
.s-form {
  width: 100%;
}
</style>
