<template>
  <div>
    <h1>{{ value }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    value: String,
  },
};
</script>
