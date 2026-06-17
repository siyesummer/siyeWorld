<!-- 歌词 -->
<template>
  <div class="lyric-container">
    <!-- 加载中 -->
    <div v-if="loading" class="lyric-status">
      <span>加载中...</span>
    </div>

    <!-- 错误 -->
    <div v-else-if="error" class="lyric-status lyric-error">
      <span>{{ error }}</span>
      <button class="retry-btn" @click="fetchLyric(songId)">重试</button>
    </div>

    <!-- 无歌词 / 纯音乐 -->
    <div v-else-if="!lyricLines.length" class="lyric-status">
      <span>纯音乐，暂无歌词</span>
    </div>

    <!-- 歌词列表 -->
    <div v-else ref="scrollArea" class="lyric-scroll">
      <div
        v-for="(line, lineIndex) in lyricLines"
        :key="lineIndex"
        class="lyric-line"
        :class="{
          active: lineIndex === activeLineIndex,
          'lyric-meta': line.meta,
        }"
      >
        <!-- 元信息行（作词/作曲等） -->
        <span v-if="line.meta" class="line-text">{{ line.text }}</span>
        <!-- 有逐词数据 -->
        <span v-else-if="line.words && line.words.length" class="line-text">
          <span
            v-for="(word, wordIndex) in line.words"
            :key="wordIndex"
            class="lyric-word"
            :class="{ active: lineIndex === activeLineIndex && wordIndex === activeWordIndex }"
            :style="getWordStyle(lineIndex, wordIndex, word)"
          >{{ word.text }}</span>
        </span>
        <!-- 纯文本行 -->
        <span v-else class="line-text">{{ line.text }}</span>
      </div>
      <!-- 底部留白，确保末行能滚到居中 -->
      <div class="lyric-spacer"></div>
    </div>
  </div>
</template>

<script>
import { fetchLyric } from '../../api/lyric';
import { parseLyric } from '../../utils/lyric-parser';

export default {
  name: 'AudioLyric',

  props: {
    songId: {
      type: [Number, String],
      default: undefined,
    },
    currentTime: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      lyricLines: [],
      loading: false,
      error: null,
      activeLineIndex: -1,
      activeWordIndex: -1,
      wordProgress: 0,
      _lastScrollTime: 0,
    };
  },

  watch: {
    songId: {
      immediate: true,
      handler(newId) {
        this.fetchLyric(newId);
      },
    },
    currentTime(time) {
      if (time === undefined || time === null || !this.lyricLines.length) return;
      this.updateActivePosition(time);
    },
  },

  methods: {
    async fetchLyric(id) {
      if (!id) {
        this.lyricLines = [];
        this.resetActive();
        return;
      }

      this.loading = true;
      this.error = null;
      const requestId = id;

      try {
        const res = await fetchLyric(id);
        // 竞态：丢弃过期响应
        if (this.songId !== requestId) return;

        const yrcText = (res && res.yrc && res.yrc.lyric) || '';
        const lrcText = (res && res.lrc && res.lrc.lyric) || '';

        const lines = parseLyric(yrcText, lrcText);
        if (!lines) {
          this.lyricLines = [];
        } else {
          this.lyricLines = lines;
        }
        this.resetActive();
        this.$nextTick(() => {
          const el = this.$refs.scrollArea;
          if (el) el.scrollTop = 0;
        });
      } catch (err) {
        if (this.songId !== requestId) return;
        this.error = '歌词加载失败';
        this.lyricLines = [];
      } finally {
        if (this.songId === requestId) {
          this.loading = false;
        }
      }
    },

    resetActive() {
      this.activeLineIndex = -1;
      this.activeWordIndex = -1;
      this.wordProgress = 0;
    },

    updateActivePosition(timeSec) {
      const { lyricLines } = this;
      if (!lyricLines.length) return;

      const currentMs = timeSec * 1000;

      // 查找当前行（最后 line.time <= currentMs 的行）
      let lineIndex = -1;
      for (let i = lyricLines.length - 1; i >= 0; i -= 1) {
        if (lyricLines[i].time <= currentMs) {
          lineIndex = i;
          break;
        }
      }

      if (lineIndex === -1) {
        this.activeLineIndex = -1;
        this.activeWordIndex = -1;
        this.wordProgress = 0;
        return;
      }

      this.activeLineIndex = lineIndex;
      const line = lyricLines[lineIndex];

      // 逐词定位（YRC 词时间是绝对毫秒）
      if (line.words && line.words.length) {
        let wordIndex = -1;
        let progress = 0;

        for (let w = 0; w < line.words.length; w += 1) {
          const word = line.words[w];
          if (currentMs >= word.start && currentMs < word.end) {
            wordIndex = w;
            const dur = word.end - word.start;
            progress = dur > 0 ? (currentMs - word.start) / dur : 0;
            break;
          }
        }

        // 过了最后一个词
        if (wordIndex === -1 && line.words.length > 0) {
          const lastWord = line.words[line.words.length - 1];
          if (currentMs >= lastWord.end) {
            wordIndex = line.words.length;
            progress = 1;
          }
        }

        this.activeWordIndex = wordIndex;
        this.wordProgress = Math.min(1, Math.max(0, progress));
      } else {
        this.activeWordIndex = -1;
        this.wordProgress = 0;
      }

      this.scrollToActiveLine();
    },

    getWordStyle(lineIndex, wordIndex, word) {
      const isActiveLine = lineIndex === this.activeLineIndex;

      if (!isActiveLine) return {};

      // 已唱完的字 → 保持主题色
      if (wordIndex < this.activeWordIndex) {
        return { color: '#c20c0c' };
      }

      // 正在唱的字 → 渐变填充效果
      if (wordIndex === this.activeWordIndex) {
        const pct = Math.round(this.wordProgress * 100);
        return {
          // 底色 #333 作为未唱部分的文本色
          backgroundColor: '#333',
          // 左侧唱过的部分用主题色覆盖
          backgroundImage: `linear-gradient(to right, #c20c0c ${pct}%, transparent ${pct}%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        };
      }

      // 还没唱到的字 → 当前行文本色
      return { color: '#333' };
    },

    scrollToActiveLine() {
      const now = Date.now();
      if (now - this._lastScrollTime < 500) return;
      this._lastScrollTime = now;

      const container = this.$refs.scrollArea;
      if (!container) return;

      const activeEl = container.querySelector('.lyric-line.active');
      if (!activeEl) return;

      const containerH = container.clientHeight;
      const lineTop = activeEl.offsetTop;
      const lineH = activeEl.offsetHeight;
      // 目标：当前行居中，但不超过开头
      const target = lineTop - containerH / 2 + lineH / 2;
      const maxScroll = container.scrollHeight - containerH;

      container.scrollTo({
        top: Math.min(maxScroll, Math.max(0, target)),
        behavior: 'smooth',
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import '../../styles/siye-music';

.lyric-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.lyric-status {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 13px;

  .retry-btn {
    margin-top: 12px;
    padding: 4px 16px;
    border: 1px solid #d3d3d3;
    border-radius: @border-radius-base;
    background: #fff;
    color: #666;
    cursor: pointer;

    &:hover {
      border-color: @primary-border-color;
      color: @primary-border-color;
    }
  }
}

.lyric-error {
  color: @error-color;
}

.lyric-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 30px 0;
  // 上下边缘渐隐效果
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);

  &::-webkit-scrollbar {
    display: none;
  }
}

.lyric-line {
  padding: 6px 0;
  line-height: 1.8;
  text-align: center;
  transition: all 0.3s ease;

  &.lyric-meta {
    padding: 2px 0;
    .line-text {
      font-size: 11px;
      color: #bbb;
    }
  }

  .line-text {
    font-size: 13px;
    color: #999;
    transition: color 0.3s ease, font-size 0.3s ease;
  }

  &.active .line-text {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
}

.lyric-word {
  transition: background-size 0.1s linear;
}

.lyric-spacer {
  height: 200px;
}
</style>
