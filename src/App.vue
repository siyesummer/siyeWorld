<template>
  <div id="app">
    <!-- <TopNav /> -->
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
};
</script>

<style lang='less' scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  .main-content {
    padding: 70px 100px 0 100px;
  }
}
</style>
