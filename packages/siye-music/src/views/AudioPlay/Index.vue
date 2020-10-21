<!-- 播放 -->
<template>
  <div class="playbar-wapper">
    <div class="play-btn">
      <span title="上一首" class="prv" @click="toPlan(-1)"></span>
      <span title="播放/暂停" :class="isPlay ? 'pause' : ''" class="play" @click="togglePlay"></span>
      <span title="下一首" class="nxt" @click="toPlan(1)"></span>
    </div>
    <div class="img">
      <img :src="imgSrc" alt />
    </div>
    <div class="play">
      <div class="title" v-if="audioDetail">
        <span class="song-name">{{songName}}</span>
        <span class="singer">{{singer}}</span>
      </div>
    </div>
    <div>
      <audio preload="auto" ref="Audio" loop :src="src" />
    </div>
  </div>
</template>

<script>
import { fetchSongDetail, fetchSongInfo } from '../../api';
import events from '../../modules/constants/events';

export default {
  name: 'AudioPlay',
  components: {},
  props: {},
  data() {
    return {
      isPlay: false, // 是否播放
      audioDetail: undefined, // 歌曲详情
      isHasAudio: false, // 是否有音频
      audioUrlInfo: undefined, // 音频url信息
      curAudio: undefined, // 当前音频信息
      songId: undefined, // 歌曲id
    };
  },
  dependencies: ['EventBus'],
  computed: {
    src() {
      return this.audioUrlInfo ? this.audioUrlInfo.url : '';
    },
    imgSrc() {
      return this.audioDetail ? this.audioDetail.al.picUrl : '';
    },
    title() {
      return this.isPlay ? '暂停' : '播放';
    },
    songName() {
      return this.audioDetail ? this.audioDetail.name : '';
    },
    singer() {
      const { audioDetail } = this;
      if (!audioDetail) return;
      return audioDetail.ar[0] ? audioDetail.ar[0].name : '';
    },
  },
  watch: {
    songId() {
      this.fetchSongInfo();
      this.autoPlay();
    },
  },
  mounted() {
    this.EventBus.on(events.changeAudio, this.handlerChange);
  },
  beforeDestroy() {
    this.EventBus.off(events.changeAudio, this.handlerChange);
  },
  methods: {
    toPlan(step) {
      this.EventBus.emit(events.nextAudio, step);
    },
    handlerChange({ id }) {
      this.songId = id;
    },
    autoPlay() {
      this.fetchSongDetail().then(() => {
        this.isPlay = true;
        this.isHasAudio = true;
        this.play();
      });
    },
    // 播放音乐
    play() {
      if (!this.isHasAudio) return;
      const that = this;
      if (this.$refs.Audio.readyState === 4) {
        setTimeout(() => {
          that.$refs.Audio.play();
        }, 50);
        return;
      }

      setTimeout(() => {
        that.play();
      }, 50);
    },
    // 暂停音乐
    pause() {
      this.$refs.Audio.pause();
    },
    togglePlay() {
      this.isPlay = !this.isPlay;
      if (this.isPlay) {
        this.play();
        return;
      }
      this.pause();
    },
    async fetchSongDetail() {
      const { songId } = this;
      if (!songId) return;
      const { songs } = await fetchSongDetail(songId);
      [this.audioDetail] = songs;
    },
    /**
     * 获取音乐信息
     * @param {String} songId: 歌曲d
     */
    async fetchSongInfo() {
      const { songId } = this;
      if (!songId) return;
      const { data } = await fetchSongInfo(songId);
      [this.audioUrlInfo] = data;
    },
  },
};
</script>
<style lang="less" scoped>
.playbar-wapper {
  width: 100%;
  height: 100%;
  background-color: #333;
  display: flex;
  position: relative;
  padding: 0px 5px;
  .play-btn {
    width: 137px;
    padding: 5px 0 0 0;
    & > span {
      display: block;
      cursor: pointer;
      float: left;
      width: 28px;
      height: 28px;
      margin-right: 8px;
      margin-top: 5px;
      text-indent: -9999px;
      background: url('https://s2.music.126.net/style/web2/img/frame/playbar.png?117d9b4ea6239874d52aadb46a12e8df')
        no-repeat 0 9999px;
    }
    .prv {
      background-position: 0 -130px;
    }
    .play {
      width: 36px;
      height: 36px;
      margin-top: 0;
      background-position: 0 -204px;
      &:hover {
        background-position: -40px -204px;
      }
    }
    .pause {
      background-position: 0 -165px;
      &:hover {
        background-position: -40px -165px;
      }
    }
    .nxt {
      background-position: -80px -130px;
    }
  }
  .img {
    width: 34px;
    height: 34px;
    float: left;
    margin: 6px 15px 0 0;
    cursor: pointer;
    img {
      width: 34px;
      height: 34px;
    }
  }
  .play {
    position: relative;
    *zoom: 1;
    width: 608px;
    float: left;
    .title {
      height: 28px;
      overflow: hidden;
      color: #e8e8e8;
      text-shadow: 0 1px 0 #171717;
      line-height: 28px;
      cursor: pointer;
      .song-name {
        max-width: 300px;
        margin-right: 15px;
        color: #e8e8e8;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
        &:hover {
          text-decoration: underline;
        }
      }
      .singer {
        color: #9b9b9b;
      }
    }
  }
}
</style>
