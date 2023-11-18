<template>
  <div class="">
    <Popover
      v-model="visible"
      trigger="click"
      placement="topRight"
      style="z-index:100000"
    >
      <template slot="content">
        <div ref="comment" class="comment-content" @scroll="scrollDebounce">
          <template v-if="currentAudio && comments.length > 0">
            <!-- 热门评论 -->
            <div v-if="hotComments.length" class="comment-wrap">
              <h3 class="title">热门评论</h3>

              <div
                v-for="item in hotComments"
                :key="item.id"
                class="comment-item"
              >
                <img :src="item.user.avatarUrl" class="img" />
                <div class="right">
                  <div class="top">
                    <span class="name">{{ item.user.nickname }}</span> :
                    <span>{{ item.content }}</span>
                  </div>

                  <div class="bottom">
                    <span class="date">{{ item.timeStr }}</span>
                    <span>{{ item.ipLocation.location }}</span>

                    <span class="like">
                      <Icon
                        type="like"
                        :class="['icon', { liked: item.liked }]"
                      />
                      ({{ item.likedCount }})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 最新评论 -->
            <div class="comment-wrap">
              <h3 class="title">最新评论</h3>

              <div v-for="item in comments" :key="item.id" class="comment-item">
                <img :src="item.user.avatarUrl" class="img" />
                <div class="right">
                  <div class="top">
                    <span class="name">{{ item.user.nickname }}</span> :
                    <span>{{ item.content }}</span>
                  </div>

                  <div class="bottom">
                    <span class="date">{{ item.timeStr }}</span>
                    <span>{{ item.ipLocation.location }}</span>

                    <span class="like">
                      <Icon
                        type="like"
                        :class="['icon', { liked: item.liked }]"
                      />
                      <span v-if="item.likedCount"
                        >({{ item.likedCount }})</span
                      >
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <Empty v-else description="">
            暂无评论
          </Empty>
        </div>
      </template>
      <div class="comment-btn">
        评论 <span v-if="total">({{ total }})</span>
      </div>
    </Popover>
  </div>
</template>

<script>
import { Popover, Empty, Icon } from 'ant-design-vue';
import { debounce } from 'siye-core/src/utils';
import { commentMusic } from '../../../api/comment';

export default {
  name: 'CommentPopup',

  components: {
    Popover,
    Empty,
    Icon,
  },

  data() {
    return {
      visible: false,
      hotComments: [],
      comments: [],
      // 使用防抖函数，防止滚动到底部多次触发
      scrollDebounce: debounce(this.handleScroll, 50),
      total: 0,
    };
  },

  computed: {
    currentAudio() {
      return this.$store.state.siyeMusic.currentAudio;
    },
  },

  watch: {
    currentAudio() {
      if (this.visible) {
        this.fetchComment();
      } else {
        this.total = 0;
      }
    },

    visible(val) {
      if (val && this.currentAudio && this.currentAudio.id !== this.idCache) {
        this.fetchComment();
      }
    },
  },

  methods: {
    handleScroll(e) {
      const { scrollTop, clientHeight, scrollHeight } = e.target;
      const isTouchBottom = scrollTop + clientHeight + 10 >= scrollHeight;
      // 滚动到底部时加载更多评论
      if (isTouchBottom) this.fetchComment(true);
    },

    async fetchComment(fetchMore = false) {
      if (fetchMore && !this.more) return;

      const params = {
        id: this.currentAudio.id,
        limit: 20,
      };

      if (fetchMore) {
        this.page += 1;
        this.params.offset = this.params.limit * this.page;
      } else {
        params.offset = 0;
        this.params = params;
        this.page = 0;
        this.idCache = this.currentAudio.id;
      }

      const { comments, hotComments, more, total } = await commentMusic(
        this.params
      );

      if (fetchMore) {
        this.comments = this.comments.concat(comments);
      } else {
        this.hotComments = hotComments;
        this.comments = comments;
        await this.$nextTick();
        this.$refs.comment.scrollTop = 0;
        this.total = total;
      }

      this.more = more;
    },
  },
};
</script>

<style lang="less" scoped>
.comment-btn {
  color: #fff;
  padding: 10px;
  cursor: pointer;
}

.comment-content {
  width: 300px;
  min-height: 200px;
  max-height: 450px;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.comment-wrap {
  h3 {
    font-weight: bold;
  }
  .title {
    position: relative;
    border-bottom: 1px solid #cfcfcf;
    color: #333;
    padding-bottom: 5px;
  }
}

.comment-item {
  display: flex;
  padding: 15px 0;
  font-size: 12px;
  color: #333;
  .img {
    min-width: 50px;
    height: 50px;
  }

  .right {
    flex-grow: 1;
    padding-left: 10px;
    word-break: break-all;

    .top {
      min-height: 30px;
      .name {
        color: #0c73c2;
        text-decoration: underline;
      }
    }

    .bottom {
      color: #999999;
      .date {
        margin-right: 10px;
      }

      .like {
        float: right;

        .liked {
          color: #0c73c2;
        }
      }
    }
  }
}
</style>

<style>
.ant-popover {
  z-index: 100000;
}
</style>
