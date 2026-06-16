<!--
  SPagination 分页器
  还原 ant-design-vue Pagination
  props:
    current / total / pageSize
    size: '' | 'small'
    simple: 简洁模式
    showQuickJumper: 快速跳页
    showSizeChanger: 每页条数切换
    pageSizeOptions: string[]
  events:
    change(page, pageSize)
    showSizeChange(current, size)
-->
<template>
  <ul
    class="s-pagination"
    :class="{ 's-pagination-small': size === 'small', 's-pagination-simple': simple }"
  >
    <!-- 上一页 -->
    <li
      class="s-pagination-prev"
      :class="{ 's-pagination-disabled': current <= 1 }"
      @click="changePage(current - 1)"
    >
      <button type="button" class="s-pagination-item-link">
        <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
          <path
            d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"
          />
        </svg>
      </button>
    </li>

    <!-- 简洁模式 -->
    <template v-if="simple">
      <li class="s-pagination-simple-pager">
        <input
          class="s-pagination-simple-input"
          :value="current"
          @keydown.enter="onSimpleInput"
          @blur="onSimpleInput"
        />
        <span class="s-pagination-slash">/</span>
        {{ totalPages }}
      </li>
    </template>

    <!-- 标准页码 -->
    <template v-else>
      <li
        v-for="item in pagers"
        :key="item.key"
        class="s-pagination-item"
        :class="{
          's-pagination-item-active': item.page === current,
          's-pagination-jump': item.type !== 'page',
        }"
        @click="onPagerClick(item)"
      >
        <a v-if="item.type === 'page'">{{ item.page }}</a>
        <span v-else class="s-pagination-jump-icon">•••</span>
      </li>
    </template>

    <!-- 下一页 -->
    <li
      class="s-pagination-next"
      :class="{ 's-pagination-disabled': current >= totalPages }"
      @click="changePage(current + 1)"
    >
      <button type="button" class="s-pagination-item-link">
        <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
          <path
            d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"
          />
        </svg>
      </button>
    </li>

    <!-- 每页条数 -->
    <li v-if="showSizeChanger" class="s-pagination-options">
      <select class="s-pagination-options-select" :value="pageSize" @change="onSizeChange">
        <option v-for="opt in pageSizeOptions" :key="opt" :value="Number(opt)">
          {{ opt }} 条/页
        </option>
      </select>
    </li>

    <!-- 快速跳页 -->
    <li v-if="showQuickJumper" class="s-pagination-jumper">
      跳至
      <input class="s-pagination-jumper-input" @keydown.enter="onJump" />
      页
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SPagination',

  props: {
    current: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    size: {
      type: String,
      default: '',
    },
    simple: {
      type: Boolean,
      default: false,
    },
    showQuickJumper: {
      type: Boolean,
      default: false,
    },
    showSizeChanger: {
      type: Boolean,
      default: false,
    },
    pageSizeOptions: {
      type: Array,
      default: () => ['10', '20', '30', '40', '50', '100'],
    },
  },

  computed: {
    totalPages() {
      return Math.max(1, Math.ceil(this.total / this.pageSize));
    },

    /**
     * 还原 antd 页码生成逻辑：
     * 始终显示首页/末页，当前页前后各 2 个 buffer，
     * 超出范围用 jump-prev / jump-next 省略号占位
     */
    pagers() {
      const { current, totalPages } = this;
      const buffer = 2;
      const list = [];

      if (totalPages <= 5 + buffer * 2 - 2) {
        for (let i = 1; i <= totalPages; i += 1) {
          list.push({ type: 'page', page: i, key: i });
        }
        return list;
      }

      let left = Math.max(2, current - buffer);
      let right = Math.min(totalPages - 1, current + buffer);

      if (current - 1 <= buffer) {
        right = 1 + buffer * 2;
      }
      if (totalPages - current <= buffer) {
        left = totalPages - buffer * 2;
      }

      list.push({ type: 'page', page: 1, key: 1 });

      if (left > 2) {
        list.push({ type: 'jump-prev', page: Math.max(1, current - 5), key: 'jump-prev' });
      }

      for (let i = left; i <= right; i += 1) {
        list.push({ type: 'page', page: i, key: i });
      }

      if (right < totalPages - 1) {
        list.push({
          type: 'jump-next',
          page: Math.min(totalPages, current + 5),
          key: 'jump-next',
        });
      }

      list.push({ type: 'page', page: totalPages, key: totalPages });

      return list;
    },
  },

  methods: {
    changePage(page) {
      if (page < 1 || page > this.totalPages || page === this.current) return;
      this.$emit('change', page, this.pageSize);
    },

    onPagerClick(item) {
      this.changePage(item.page);
    },

    onSizeChange(e) {
      const size = Number(e.target.value);
      this.$emit('showSizeChange', this.current, size);
    },

    onJump(e) {
      const page = Number(e.target.value);
      e.target.value = '';
      if (!Number.isNaN(page)) this.changePage(page);
    },

    onSimpleInput(e) {
      const page = Number(e.target.value);
      if (Number.isNaN(page)) {
        e.target.value = this.current;
        return;
      }
      this.changePage(page);
    },
  },
};
</script>

<style lang="less" scoped>
@import '../styles/theme';

.s-pagination {
  display: inline-flex;
  align-items: center;
  padding: 0;
  margin: 0;
  font-size: @font-size-base;

  li {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    list-style: none;
  }

  .s-pagination-item,
  .s-pagination-prev,
  .s-pagination-next {
    box-sizing: border-box;
    min-width: 32px;
    height: 32px;
    margin-right: 8px;
    line-height: 30px;
    text-align: center;
    background-color: #fff;
    border: 1px solid @border-color-base;
    border-radius: @border-radius-base;
    cursor: pointer;
    transition: all 0.3s;

    a {
      display: block;
      padding: 0 6px;
      color: @text-color;
      transition: none;
    }

    &:hover {
      border-color: @primary-color;
      a {
        color: @primary-color;
      }
    }
  }

  // 还原原 pagination.less：选中态主题色
  .s-pagination-item-active {
    font-weight: 500;
    border-color: @primary-color;

    a {
      color: @primary-color;
    }

    &:hover,
    &:focus {
      border-color: @primary-color;
      a {
        color: @primary-color;
      }
    }
  }

  .s-pagination-prev,
  .s-pagination-next {
    .s-pagination-item-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 0;
      color: @text-color;
      background: transparent;
      border: none;
      border-radius: @border-radius-base;
      cursor: pointer;
      outline: none;
    }
  }

  .s-pagination-jump {
    border-color: transparent;

    .s-pagination-jump-icon {
      color: rgba(0, 0, 0, 0.25);
      letter-spacing: -1px;
      font-size: 12px;
    }

    &:hover {
      border-color: transparent;
      .s-pagination-jump-icon {
        color: @primary-color;
      }
    }
  }

  .s-pagination-disabled {
    cursor: not-allowed;

    .s-pagination-item-link {
      color: rgba(0, 0, 0, 0.25);
      cursor: not-allowed;
    }

    &:hover {
      border-color: @border-color-base;
    }
  }

  // 每页条数
  .s-pagination-options {
    margin-left: 8px;

    .s-pagination-options-select {
      height: 32px;
      padding: 0 8px;
      color: @text-color;
      background-color: #fff;
      border: 1px solid @border-color-base;
      border-radius: @border-radius-base;
      outline: none;
      cursor: pointer;
    }
  }

  // 快速跳页
  .s-pagination-jumper {
    margin-left: 8px;
    color: @text-color;

    .s-pagination-jumper-input {
      box-sizing: border-box;
      width: 50px;
      height: 32px;
      margin: 0 8px;
      padding: 4px 8px;
      text-align: center;
      border: 1px solid @border-color-base;
      border-radius: @border-radius-base;
      outline: none;

      &:focus {
        border-color: @primary-color;
      }
    }
  }

  // 简洁模式
  &.s-pagination-simple {
    .s-pagination-simple-pager {
      margin-right: 8px;

      .s-pagination-simple-input {
        box-sizing: border-box;
        width: 30px;
        height: 24px;
        margin-right: 8px;
        padding: 0 6px;
        text-align: center;
        border: 1px solid @border-color-base;
        border-radius: @border-radius-base;
        outline: none;

        &:focus {
          border-color: @primary-color;
        }
      }

      .s-pagination-slash {
        margin: 0 10px 0 5px;
      }
    }
  }

  // 小尺寸
  &.s-pagination-small {
    .s-pagination-item,
    .s-pagination-prev,
    .s-pagination-next {
      min-width: 24px;
      height: 24px;
      margin-right: 4px;
      line-height: 22px;
    }

    .s-pagination-options .s-pagination-options-select,
    .s-pagination-jumper .s-pagination-jumper-input {
      height: 24px;
    }
  }
}
</style>
