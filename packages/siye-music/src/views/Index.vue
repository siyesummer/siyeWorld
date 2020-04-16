<template>
  <div class="audio-play-wrapper">
    <div class="list-wrapper">
      <div class="audio-list">
        <AudioList ref="AudioList" @onPlay="onPlay" />
      </div>
      <div class="audio-lyric"></div>
    </div>
    <div class="audio-play">
      <AudioPlay :songId="songId" @toPlan="toPlan" />
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
    return {
      songId: undefined, // 歌曲id
    };
  },
  methods: {
    onPlay(songId) {
      this.songId = songId;
    },
    /**
     * 上一曲/下一曲
     * @param {Number} step: [-1, 1]
     */
    toPlan(step = 1) {
      this.$refs.AudioList.toPlay(step);
    },
  },
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
