<template>
  <Tooltip>
    <template slot="title">
      {{ modeTitle[mode] }}
    </template>
    <div class="play-mode" :class="[mode]" @click="changeMode"></div>
  </Tooltip>
</template>

<script>
import { Tooltip } from 'ant-design-vue';

// 播放模式
export default {
  name: 'PlayMode',

  props: {
    value: {
      type: String,
      default: 'loop',
      validator: val => ['loop', 'shuffle', 'one'].includes(val),
    },
  },

  components: {
    Tooltip,
  },

  data() {
    return {
      mode: 'loop',
      modeTitle: {
        loop: '循环',
        shuffle: '随机',
        one: '单曲循环',
      },
    };
  },

  watch: {
    value: {
      handler(val) {
        this.mode = val;
      },
      immediate: true,
    },
  },

  methods: {
    changeMode() {
      const modeMap = {
        loop: 'shuffle',
        shuffle: 'one',
        one: 'loop',
      };

      this.mode = modeMap[this.mode];
      this.$emit('input', this.mode);
      this.$emit('change', this.mode);
    },
  },
};
</script>

<style lang="less" scoped>
.play-mode {
  display: inline-block;
  margin: 15px 0 0 10px;
  width: 25px;
  height: 25px;
  cursor: pointer;

  background: url(https://s2.music.126.net/style/web2/img/frame/playbar.png?cfe8bcbc552989bb8ccb3cea082c6d09)
    no-repeat 0 9999px;

  &.loop {
    background-position: -3px -344px;
    &:hover {
      background-position: -33px -344px;
    }
  }

  &.shuffle {
    background-position: -66px -248px;
    &:hover {
      background-position: -93px -248px;
    }
  }

  &.one {
    background-position: -66px -344px;
    &:hover {
      background-position: -93px -344px;
    }
  }
}
</style>
