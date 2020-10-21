<template>
  <div class="audio-play-wrapper">
    <div class="list-wrapper">
      <div class="audio-list">
        <AudioList />
      </div>
      <div class="audio-lyric"></div>
    </div>
    <div class="audio-play">
      <AudioPlay />
    </div>
  </div>
</template>

<script>
import AudioList from './AudioList/Index';
import AudioPlay from './AudioPlay/Index';

export default {
  name: 'SiyeMusic',
  props: {
    value: String,
  },
  components: {
    AudioList,
    AudioPlay,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less" scoped>
.audio-play-wrapper {
  width: 895px;
  margin: 0 auto;
  border: 1px solid #d3d3d3;
  .list-wrapper {
    min-height: 500px;
    .audio-list {
      width: 646px;
      border-right: 1px solid #d3d3d3;
      box-sizing: border-box;
    }
    .audio-lyric {
      width: 250px;
      min-width: 240px;
      max-width: 260px;
    }
  }
  .audio-play {
    width: 100%;
    height: 50px;
  }
}
</style>
