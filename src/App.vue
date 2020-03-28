<template>
  <div id="app">
    <HelloWorld value="你好，世界" />
  </div>
</template>

<script>
import { HelloWorld } from './components';

export default {
  name: 'app',
  components: {
    HelloWorld,
  },
};
</script>

<style lang='less' scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
