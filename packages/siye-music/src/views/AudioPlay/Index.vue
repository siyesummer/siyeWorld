<!-- 播放 -->
<template>
  <div class="playbar-wapper">
    <div class="play-btn">
      <span title="上一首" class="prv" @click="toPlan(-1)"></span>
      <span
        title="播放/暂停"
        :class="isPlay ? 'pause' : ''"
        class="play"
        @click="togglePlay"
      ></span>
      <span title="下一首" class="nxt" @click="toPlan(1)"></span>
    </div>
    <div class="img">
      <img :src="imgSrc" alt />
    </div>
    <div class="play">
      <div class="title">
        <span class="song-name">{{ songName }}</span>
        <span class="singer">{{ singer }}</span>
      </div>

      <div class="bar-wrap">
        <!-- 进度 -->
        <ProgressBar
          ref="progress"
          :readyPercent="readyPercent"
          @seek="handleSeek"
          @beforemove="handleBeforemove"
          @aftermove="handleAftermove"
        />
        <!-- 时间 -->
        <span class="time">
          <span class="cur"> {{ currentFormat }}</span> / {{ totalTime }}
        </span>
      </div>
    </div>

    <!-- 音量 -->
    <VolBar class="vol" @volume="handleVolume" @verticalMove="handleVolume" />

    <!-- 音频播放器 -->
    <AudioPlayer
      ref="Audio"
      :src="src"
      :autoPlay="autoPlay"
      @autoplayed="isPlay = true"
      @timeupdate="handleTimeupdate"
      @progress="handleProgress"
    />

    <!-- 评论框 -->
    <CommentPopup class="comment" />
  </div>
</template>

<script>
import { fetchSongDetail, fetchSongInfo } from '../../api';
import events from '../../modules/constants/events';
import { CommentPopup, ProgressBar, AudioPlayer, VolBar } from './components';

export default {
  name: 'AudioPlay',
  components: {
    CommentPopup,
    ProgressBar,
    AudioPlayer,
    VolBar,
  },
  props: {},
  data() {
    return {
      isPlay: false, // 是否播放
      audioDetail: undefined, // 歌曲详情
      isHasAudio: false, // 是否有音频
      audioUrlInfo: undefined, // 音频url信息
      songId: undefined, // 歌曲id
      percent: 0,
      autoPlay: true,
      currentTime: 0,
      // 缓存进度
      readyPercent: 0,
    };
  },

  dependencies: ['EventBus'],

  computed: {
    src() {
      return this.audioUrlInfo?.url ?? '';
    },

    imgSrc() {
      // eslint-disable-next-line operator-linebreak
      const defaultSrc =
        'http://s4.music.126.net/style/web2/img/default/default_album.jpg';
      return this.audioDetail?.al?.picUrl ?? defaultSrc;
    },

    title() {
      return this.isPlay ? '暂停' : '播放';
    },

    songName() {
      return this.audioDetail?.name ?? '';
    },

    singer() {
      const { audioDetail } = this;
      if (!audioDetail) return;
      return audioDetail.ar[0]?.name ?? '';
    },

    currentAudio() {
      return this.$store.state.siyeMusic.currentAudio;
    },

    currentFormat() {
      if (!this.currentTime) return '00:00';

      const min = Math.floor(this.currentTime / 60);
      const second = this.currentTime % 60;

      return `${min < 10 ? `0${min}` : min}:${
        second < 10 ? `0${second}` : second
      }`;
    },

    totalTime() {
      if (!this.currentAudio) return '00:00';
      const duration = this.currentAudio.dt || this.currentAudio.duration;
      const time = Math.floor(duration / 1000);
      const min = Math.floor(time / 60);
      const second = time % 60;

      return `${min < 10 ? `0${min}` : min}:${
        second < 10 ? `0${second}` : second
      }`;
    },
  },

  watch: {
    songId() {
      this.fetchSongInfo();

      this.fetchSongDetail();

      if (this.autoPlay) this.isPlay = true;

      // 进度重置
      this.$refs.progress.setPercent(0);
      // 缓存进度重置
      this.readyPercent = 0;
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

    handleVolume(volume) {
      this.$refs.Audio.setVolume(volume);
    },

    // 进度按钮拖拽标记
    handleBeforemove() {
      this.isMoving = true;
    },

    //  进度按钮拖拽结束后
    handleAftermove(percent) {
      this.isMoving = false;
      // 拖拽结束后，音频播放时间重新设置
      this.handleSeek(percent);
    },

    handleTimeupdate(currentTime) {
      if (!this.currentAudio) return;
      const duration = this.currentAudio.dt || this.currentAudio.duration;

      const percent = (currentTime * 1000 * 100) / duration;

      this.currentTime = Number(currentTime).toFixed(0);

      // 拖动时，当前实际播放时间暂停实时更新进度条
      if (!this.isMoving) this.$refs.progress.setPercent(percent);
    },

    // 音频缓存
    handleProgress(currentTime) {
      if (!this.currentAudio) return 0;

      const duration = this.currentAudio.dt || this.currentAudio.duration;

      const percent = (currentTime * 1000 * 100) / duration;

      this.readyPercent = percent > 100 ? 100 : percent;
    },

    // 设置进度跳转
    handleSeek(percent) {
      if (!this.currentAudio) return;
      const duration = this.currentAudio.dt || this.currentAudio.duration;
      const time = (duration * percent) / 1000;

      this.$refs.Audio.setCurrentTime(time);
    },

    // 播放音乐
    play() {
      this.$refs.Audio.play();
    },
    // 暂停音乐
    pause() {
      this.$refs.Audio.pause();
    },

    togglePlay() {
      this.isPlay = !this.isPlay;
      if (this.isPlay) this.play();
      else this.pause();
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
    width: 125px;
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

  .vol {
    margin: 15px 0 0 10px;
  }
}
.bar-wrap {
  position: relative;

  .time {
    color: #797979;
    text-shadow: 0 1px 0 #121212;
    margin-left: 15px;
    display: inline-block;
    vertical-align: 1px;

    .cur {
      color: #a1a1a1;
    }
  }
}

.comment {
  margin-top: 8px;
}
</style>
