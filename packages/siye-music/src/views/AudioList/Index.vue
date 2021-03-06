<!-- 歌单 -->
<template>
  <div>
    <PaginationWrapper size="small" :meta="meta" @paging="onPaging">
      <div style="text-align:center">
        <InputSearch enterButton v-model="searchValue" @pressEnter="search" class="search-input" />
      </div>
      <div class="music-wrapper">
        <AudioTable
          :columns="columns"
          :tableData="audioList"
          @rowClick="({index}) => changeAudio(index)"
        >
          <!-- 序列号 -->
          <template #number="{index}">{{number(index)}}</template>
          <!-- 歌手 -->
          <template #singer="{row}">
            <span :title="singer(row)">{{singer(row)}}</span>
          </template>
          <!-- 专辑 -->
          <template #album="{row}">
            <span :title="row.album.name">{{row.album.name}}</span>
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

export default {
  name: 'AudioList',
  components: {
    InputSearch: Input.Search,
    PaginationWrapper,
    AudioTable,
  },
  props: {},
  data() {
    return {
      audioList: [], // 音乐列表
      searchType: '1', // 搜索类型
      audioType: 'music', // 音频类型
      isPlay: false, // 是否播放
      curAudio: undefined, // 当前音频信息
      curIndex: undefined, // 当前音频index
      searchValue: undefined, // 搜索值
      defaultSearchValue: '匿名的好友', // 默认搜索值
      src: undefined, // 音频src
      // 分页参数
      meta: {
        ...PaginationWrapper.defaultMeta,
        limit: 15,
      },
      columns,
    };
  },
  computed: {
    title() {
      return this.isPlay ? '暂停' : '播放';
    },
  },
  dependencies: ['EventBus'],
  watch: {},
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
      return data.artists.map(i => i.name).join('、');
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
    },
    // 页码改变
    onPaging(meta) {
      this.meta = meta;
      this.search();
    },
    // 查询
    search() {
      this.fetchSearchInfo();
    },
    // 歌曲关键字搜索
    async fetchSearchInfo(value) {
      const { searchValue, meta, defaultSearchValue } = this;
      const { page, limit } = meta;

      const { result } = await fetchSearchInfo({
        keywords: value || searchValue || defaultSearchValue,
        offset: page * limit,
        limit,
      });
      const { songs, songCount } = result;
      this.audioList = songs;
      this.meta = {
        ...meta,
        total: songCount,
      };
    },
  },
  created() {
    this.fetchSearchInfo(this.defaultSearchValue);
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
.music-wrapper {
  min-height: 490px;
  margin-top: 5px;
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
