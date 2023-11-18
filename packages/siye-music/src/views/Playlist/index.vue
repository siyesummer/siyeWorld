<template>
  <div v-if="cookie" class="playlist">
    <div
      v-for="item in playlist"
      :key="item.id"
      class="playlist-item"
      :class="{ active: currentId === item.id }"
      @click="handleClick(item)"
    >
      <img :src="item.coverImgUrl" class="img" />

      <div class="text">{{ item.name }}({{ item.trackCount }})</div>
    </div>
  </div>
</template>

<script>
import {
  userPlaylist,
  playlistDetail,
  playlistTrackAll,
} from '../../api/playlist';

// 歌单
export default {
  name: 'Playlist',

  data() {
    return {
      playlist: [],
      currentId: null,
    };
  },

  computed: {
    cookie() {
      return this.$store.state.siyeMusic.cookie;
    },

    account() {
      return this.$store.state.siyeMusic.account;
    },
  },

  watch: {
    cookie() {
      this.fetchPlaylist();
    },
  },

  created() {
    this.fetchPlaylist();
  },

  methods: {
    async handleClick(item) {
      playlistDetail({ id: item.id });
      this.currentId = item.id;
      const { songs } = await playlistTrackAll({ id: item.id });

      // 更新播放列表
      this.$store.commit('siyeMusic/setAudioList', songs);

      // 更新分页参数
      this.$store.commit('siyeMusic/updateMeta', {
        page: 0,
        total: songs.length,
        limit: 999,
      });
    },

    async fetchPlaylist() {
      if (this.cookie) {
        const { playlist } = await userPlaylist({ id: this.account.id });

        this.playlist = playlist || [];
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import '../../styles/siye-music';
@box-width: 100px;
.playlist {
  width: @box-width;
  max-height: 580px;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.playlist-item {
  width: 100px;

  border-radius: 3px;
  position: relative;
  cursor: pointer;

  &.active {
    .text {
      color: @link-color;
    }
  }

  .img {
    position: block;
    width: 100%;
    height: 100px;
  }

  .text {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-style: 12px;
    padding: 3px 0;
  }
}
</style>
