<template>
  <Popover v-model="visible" trigger="click" overlayClassName="vol-pop">
    <template slot="content">
      <div class="vol-bar">
        <div class="barbg"></div>

        <!-- 音量 -->
        <div ref="barWrap" class="bar-wrap" @click.stop="handleClick">
          <div class="current-bar" :style="{ height: percent + '%' }"></div>
          <span
            ref="btn"
            class="bar-btn"
            :style="{
              top: btnTop + 'px',
            }"
            @mousedown.self="handleMousedown"
          ></span>
        </div>
      </div>
    </template>

    <span class="vol-btn" :class="{ 'vol-no': percent === 0 }"> </span>
  </Popover>
</template>

<script>
import { Popover } from 'ant-design-vue';
import progressMixin from './progress.mixin';

// 音量调节
export default {
  name: 'VolBar',

  mixins: [progressMixin],

  components: {
    Popover,
  },

  data() {
    return {
      percent: '100',
      barRefKey: 'barWrap',
      // 音量按钮高度限制
      btnMaxHeight: 81,
      btnTop: 0,
      // 设置垂直方向拖拽
      direction: 'vertical',
      autogetRect: false,
      visible: false,
    };
  },

  watch: {
    async visible(val) {
      if (val && !this.isGetRect) {
        this.isGetRect = true;
        await this.$nextTick();
        this.getBoundingClientRect();
      }
    },
  },

  methods: {
    handleClick(e) {
      const percent = this.getVerticalPercent(e);
      this.percent = percent * 100;
      this.btnTop = (1 - percent) * this.btnMaxHeight;

      this.$emit('volume', percent);
    },
  },
};
</script>
<style lang="less">
.vol-pop {
  .ant-popover-inner-content {
    padding: 0;
  }

  &.ant-popover-placement-top > .ant-popover-content > .ant-popover-arrow {
    border-color: transparent;
  }
}
</style>
<style lang="less" scoped>
.vol-btn {
  background: url(https://s2.music.126.net/style/web2/img/frame/playbar.png?cfe8bcbc552989bb8ccb3cea082c6d09)
    no-repeat 0 9999px;
  width: 25px;
  height: 25px;
  background-position: -2px -248px;
  cursor: pointer;

  &:hover {
    background-position: -31px -248px;
  }

  &.vol-no {
    background-position: -104px -69px;

    &:hover {
      background-position: -126px -69px;
    }
  }
}

.vol-bar {
  width: 32px;
  height: 113px;
  position: relative;
}

.barbg {
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: 113px;

  background: url(https://s2.music.126.net/style/web2/img/frame/playbar.png?cfe8bcbc552989bb8ccb3cea082c6d09)
    no-repeat 0 9999px;
  background-position: 0 -503px;
}

.bar-wrap {
  padding: 4px 0;
  top: 8px;
  position: absolute;
  left: 14px;
  width: 4px;
  height: 93px;
}

.current-bar {
  position: absolute;
  top: auto;
  width: 4px;
  bottom: -4px;
  left: 0;
  overflow: hidden;

  background: url(https://s2.music.126.net/style/web2/img/frame/playbar.png?cfe8bcbc552989bb8ccb3cea082c6d09)
    no-repeat;
  background-position: -40px bottom;
}

.bar-btn {
  position: absolute;
  left: -7px;
  display: block;
  width: 18px;
  height: 20px;

  cursor: pointer;

  background: url(https://s2.music.126.net/style/web2/img/iconall.png?3e746411716a04735638b6660887d68b)
    no-repeat;
  background-position: -40px -250px;
  &:hover {
    background-position: -40px -280px;
  }
}
</style>
