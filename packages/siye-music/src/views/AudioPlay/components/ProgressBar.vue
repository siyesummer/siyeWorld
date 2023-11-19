<template>
  <div ref="bar" class="bar-bg" @click.stop="handleClick">
    <!-- 缓存条 -->
    <div class="ready-bar" :style="{ width: readyPercent + '%' }"></div>
    <!-- 进度条 -->
    <div class="current-bar" :style="{ width: percent + '%' }">
      <span ref="btn" class="bar-btn" @mousedown.self="handleMousedown"></span>
    </div>
  </div>
</template>

<script>
import progressMixin from './progress.mixin';

// 进度条
export default {
  name: 'ProgressBar',

  mixins: [progressMixin],

  props: {
    readyPercent: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      percent: '',
      barRefKey: 'bar',
    };
  },

  methods: {
    // 点击进度跳转
    handleClick(e) {
      const percent = this.getPercent(e);
      this.percent = percent * 100;

      this.$emit('seek', percent);
    },

    setPercent(percent = 0) {
      this.percent = percent;
    },
  },
};
</script>

<style lang="less" scoped>
.bar-bg,
.current-bar,
.ready-bar {
  height: 9px;
  background: url(https://s2.music.126.net/style/web2/img/frame/statbar.png?986632afaf85125521821ee38ffb11f4)
    no-repeat 0 9999px;
}

.bar-bg {
  background-position: right 0;
  display: inline-block;
  width: 466px;
  position: relative;
}

.ready-bar {
  position: absolute;
  top: 0;
  left: 0;
  background-position: right -30px;
}

.current-bar {
  position: absolute;
  top: 0;
  left: 0;
  background-position: left -66px;

  .bar-btn {
    position: absolute;
    right: -13px;
    width: 22px;
    height: 24px;
    margin-left: -11px;
    top: -7px;
    background: url(https://s2.music.126.net/style/web2/img/iconall.png?3e746411716a04735638b6660887d68b)
      no-repeat;
    background-position: 0 -250px;

    &:hover {
      background-position: 0 -280px;
    }
  }
}
</style>
