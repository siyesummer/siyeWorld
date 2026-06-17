<template>
  <div class="play-body">
    <Playlist />
    <div class="audio-play-wrapper">
      <div class="list-wrapper">
        <div class="audio-list">
          <AudioList />
        </div>
        <div class="audio-lyric">
          <AudioLyric :songId="currentSongId" :currentTime="lyricTime" @seek="onLyricSeek" />
        </div>
      </div>
      <div class="audio-play">
        <AudioPlay ref="audioPlay" @lyric-timeupdate="lyricTime = $event" />
      </div>
    </div>
  </div>
</template>

<script>
import AudioList from './AudioList/Index';
import AudioPlay from './AudioPlay/Index';
import AudioLyric from './AudioLyric/Index';
import Playlist from './Playlist';

export default {
  name: 'SiyeMusic',
  props: {
    value: String,
  },
  components: {
    AudioList,
    AudioPlay,
    AudioLyric,
    Playlist,
  },
  data() {
    return {
      lyricTime: 0,
    };
  },
  computed: {
    currentSongId() {
      return this.$store.state.siyeMusic.currentAudio?.id;
    },
  },
  methods: {
    onLyricSeek(timeSec) {
      if (this.$refs.audioPlay) {
        this.$refs.audioPlay.$refs.Audio.setCurrentTime(timeSec);
        this.$refs.audioPlay.play();
      }
    },
  },
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
    display: flex;
    .audio-list {
      width: 646px;
      border-right: 1px solid #d3d3d3;
      box-sizing: border-box;
    }
    .audio-lyric {
      width: 100%;
      height: 560px;
      overflow: hidden;
    }
  }
  .audio-play {
    width: 100%;
    height: 50px;
  }
}
</style>
