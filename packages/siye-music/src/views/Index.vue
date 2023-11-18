<template>
  <div class="play-body">
    <Playlist />
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
  </div>
</template>

<script>
import AudioList from './AudioList/Index';
import AudioPlay from './AudioPlay/Index';
import Playlist from './Playlist';

export default {
  name: 'SiyeMusic',
  props: {
    value: String,
  },
  components: {
    AudioList,
    AudioPlay,
    Playlist,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less" scoped>
@import '../styles/siye-music';

.play-body {
  min-width: calc(@app-width + 300px);
  display: flex;
  justify-content: center;
}
.audio-play-wrapper {
  width: @app-width;
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
