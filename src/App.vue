<template>
  <div id="app">
    <div class="main-content">
      <router-view />
    </div>
    <router-link
      class="log-entry"
      :to="{ name: 'logQuery' }"
      target="_blank"
      rel="noopener noreferrer"
      title="打开日志查询"
      aria-label="打开日志查询"
    >
      日志
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang='less' scoped>
#app {
  min-height: 100vh;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background:
    radial-gradient(circle at top left, rgba(194, 12, 12, 0.08), transparent 26%),
    linear-gradient(180deg, #f7f8fa 0%, #eef1f5 100%);
}

.main-content {
  padding: 32px 32px 88px;
}

.log-entry {
  position: fixed;
  right: auto;
  bottom: max(20px, env(safe-area-inset-bottom));
  left: max(20px, env(safe-area-inset-left));
  z-index: 30;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 40px;
  border: 1px solid rgba(194, 12, 12, 0.22);
  border-radius: 12px;
  color: #fff;
  background: rgba(17, 24, 39, 0.94);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.2);
  font-size: 14px;
  text-decoration: none;
  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
  backdrop-filter: blur(12px);

  &:hover,
  &:focus-visible {
    color: #fff;
    background: #c20c0c;
    box-shadow: 0 14px 28px rgba(194, 12, 12, 0.28);
    transform: translateY(-2px);
  }
}
</style>
