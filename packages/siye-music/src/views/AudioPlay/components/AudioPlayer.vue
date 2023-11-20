<template>
  <audio
    preload="auto"
    ref="audio"
    loop
    :src="src"
    @canplay="handleEvent"
    @timeupdate="handleEvent"
    @progress="handleEvent"
  />
</template>

<script>
// 音频播放器
export default {
  name: 'AudioPlayer',

  props: {
    src: {
      type: String,
      default: '',
    },
    loop: {
      type: Boolean,
      default: true,
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
  },

  watch: {
    src() {
      this.played = false;
    },
  },

  methods: {
    handleEvent(e) {
      if (e.type === 'canplay') {
        // 自动播放
        if (this.autoPlay && !this.played) {
          this.played = true;
          this.$emit('autoplayed');
          this.play();
        }
      } else if (e.type === 'timeupdate') {
        this.$emit('timeupdate', this.$refs.audio.currentTime);
      } else if (e.type === 'progress') {
        const buffered = e.target.buffered;
        // 缓存
        this.$emit('progress', buffered.end(0));
      }
    },

    // 设置播放进度
    setCurrentTime(time = 0) {
      if (!this.src) return;

      this.$refs.audio.currentTime = time;
    },

    // 设置音量
    setVolume(volume = 1) {
      this.$refs.audio.volume = volume;
    },

    play() {
      this.$refs.audio.play();
    },

    pause() {
      this.$refs.audio.pause();
    },
  },
};
</script>
