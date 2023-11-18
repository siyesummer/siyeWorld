<!-- 歌单 -->
<template>
  <div>
    <PaginationWrapper size="small" :meta="meta" @paging="onPaging">
      <div style="text-align:center">
        <InputSearch
          enterButton
          v-model="searchValue"
          @pressEnter="search(true)"
          class="search-input"
        />
        <LoginModal class="avatar"></LoginModal>
      </div>
      <div class="music-wrapper">
        <AudioTable
          :columns="columns"
          :tableData="audioList"
          @rowClick="({ index }) => changeAudio(index)"
        >
          <!-- 序列号 -->
          <template #number="{index, row}">
            {{ number(index) }}
            <span
              :class="[
                'play-icon',
                { current: curAudio && curAudio.id === row.id },
              ]"
            ></span>
          </template>
          <!-- 歌手 -->
          <template #singer="{row}">
            <span :title="singer(row)">{{ singer(row) }}</span>
          </template>
          <!-- 专辑 -->
          <template #album="{row}">
            <span :title="row.al ? row.al.name : row.album.name">
              {{ row.al ? row.al.name : row.album.name }}
            </span>
          </template>
        </AudioTable>
      </div>
    </PaginationWrapper>
  </div>
</template>

<script>
import { Input } from 'ant-design-vue';
import { fetchSearchInfo } from '../../api';
import { PaginationWrapper, AudioTable } from '../../components';
import events from '../../modules/constants/events';
import columns from './columns';
import { LoginModal } from './components';

export default {
  name: 'AudioList',
  components: {
    InputSearch: Input.Search,
    PaginationWrapper,
    AudioTable,
    LoginModal,
  },
  props: {},
  data() {
    return {
      searchType: '1', // 搜索类型
      audioType: 'music', // 音频类型
      isPlay: false, // 是否播放
      curAudio: undefined, // 当前音频信息
      curIndex: undefined, // 当前音频index
      searchValue: undefined, // 搜索值
      defaultSearchValue: '单依纯', // 默认搜索值
      src: undefined, // 音频src
      columns,
    };
  },

  computed: {
    title() {
      return this.isPlay ? '暂停' : '播放';
    },

    // 音频列表
    audioList() {
      return this.$store.state.siyeMusic.audioList;
    },

    // 分页参数
    meta() {
      return this.$store.state.siyeMusic.meta;
    },
  },

  dependencies: ['EventBus'],

  created() {
    this.fetchSearchInfo(this.defaultSearchValue);
  },

  mounted() {
    this.EventBus.on(events.nextAudio, this.handlernextAudio);
  },

  beforeDestroy() {
    this.EventBus.off(events.nextAudio, this.handlernextAudio);
  },

  methods: {
    handlernextAudio(step) {
      this.toPlay(step);
    },
    /**
     * 上一曲/下一曲
     * @param {Number} step: [-1, 1]
     */
    toPlay(step) {
      const { curIndex, audioList } = this;
      if (typeof curIndex === 'undefined') return;
      let playIndex = curIndex;

      if (step === 1) {
        playIndex = playIndex >= audioList.length - 1 ? 0 : playIndex + 1;
      } else {
        playIndex = playIndex <= 0 ? audioList.length - 1 : playIndex - 1;
      }

      this.changeAudio(playIndex);
    },
    singer(data) {
      return (data.artists || data.ar).map(i => i.name).join('、');
    },
    number(index) {
      const { meta } = this;
      const { page, limit } = meta;
      const number = page * limit + index + 1;
      return number < 10 ? `0${number}` : number;
    },
    // 切换音乐
    changeAudio(index) {
      const { audioList } = this;
      this.curAudio = audioList[index];
      this.curIndex = index;
      this.EventBus.emit(events.changeAudio, { id: this.curAudio.id });

      // 更新当前播放音频
      this.$store.commit('siyeMusic/updateCurrentAudio', this.curAudio);
    },

    // 页码改变
    onPaging(meta) {
      // 更新分页参数
      this.$store.commit('siyeMusic/updateMeta', meta);
      this.search();
    },

    // 查询
    search(refresh = false) {
      this.fetchSearchInfo('', refresh);
    },

    /**
     * 歌曲关键字搜索
     * @param {string} value 搜索关键字
     * @param {boolean} refresh 刷新分页树木
     */
    async fetchSearchInfo(value, refresh = false) {
      const { searchValue, meta, defaultSearchValue } = this;
      const { page, limit } = meta;

      const pageValue = refresh ? 0 : page;

      const pageLimit = limit === 999 ? 15 : limit;

      const params = {
        keywords: value || searchValue || defaultSearchValue,
        offset: pageValue * limit,
        limit: pageLimit,
      };

      const { result } = await fetchSearchInfo(params);
      const { songs, songCount } = result;
      // 更新播放列表
      this.$store.commit('siyeMusic/setAudioList', songs);

      // 更新分页参数
      this.$store.commit('siyeMusic/updateMeta', {
        page: pageValue,
        total: songCount,
        limit: pageLimit,
      });
    },
  },
};
</script>
<style lang="less" scoped>
@import '../../styles/siye-music';
.active {
  background-color: #e0e0e0 !important;
}

.search-input {
  width: 300px;
}
.play {
  text-align: left;
  margin-top: 10px;
}
.avatar {
  float: right;
  margin-right: 15px;
}

.play-icon {
  display: inline-block;
  width: 17px;
  height: 17px;
  background: url(https://s2.music.126.net/style/web2/img/table.png?713daee074c87bfa94522e26d6859401)
    no-repeat 0 9999px;
  background-position: 0 -103px;
  vertical-align: -4px;
  margin-left: 10px;

  &.current {
    background-position: -20px -128px;
  }

  &:hover {
    background-position: 0px -128px;
  }
}

.music-wrapper {
  height: 492px;
  overflow: auto;
  margin-top: 5px;
  &::-webkit-scrollbar {
    display: none;
  }

  table.musci-table {
    table-layout: fixed;
    width: 100%;
    thead {
      tr {
        th {
          height: 38px;
          background-color: @table-bg-color;
          background-position: 0 0;
          background-repeat: repeat-x;
          vertical-align: top;
          text-align: left;
          font-weight: normal;
          color: #666;
          background: url('https://s2.music.126.net/style/web2/img/table.png?c4e0c285b4622c09f63a90435b5b38f1')
            no-repeat 0 9999px;
          white-space: nowrap;
          border-top: 3px solid @primary-border-color;
          &:first-child {
            background: none;
          }
          &:nth-child(n + 1) {
            line-height: 18px;
            padding: 8px 10px;
            background-position: 0 -56px;
          }
        }
      }
    }
    tbody {
      tr {
        cursor: pointer;
        height: 30px;
        &:hover {
          background-color: @table-row-hover-bg;
        }
        &:nth-child(odd) {
          background-color: @table-bg-color;
        }
        td {
          padding: 6px 10px;
          line-height: 18px;
          text-align: left;
          position: relative;
          color: #333;
          font-size: 12px;
          height: 30px;
          .text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
