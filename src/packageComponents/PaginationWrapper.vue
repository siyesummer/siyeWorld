<!--
  分页封装
  slot 参数: pagination
  @fires paging 分页参数变动时触发

  slot:
    default: 列表内容区域
    pager: 分页区域

  scoped slots:
    default - 参数 {pagination}
-->

<template>
  <fragment>
    <slot name="default" :pagination="pagination">
      <Skeleton active />
    </slot>
    <div class="align-right">
      <slot name="pager">
        <Pagination
          v-if="showPager"
          v-bind="pagination"
          @change="onPageChange"
          @showSizeChange="onPageChange"
        />
      </slot>
    </div>
  </fragment>
</template>

<script>
import { Skeleton, Pagination } from 'ant-design-vue';

export const DEFAULT_META = Object.freeze({
  page: 0, // 当前页码
  total: 0, // 数据总数
  limit: 20, // 每页数据量
});

export default {
  // 向外部提供默认 meta 值
  defaultMeta: { ...DEFAULT_META },

  props: {
    // 是否展示分页器
    showPager: { type: Boolean, default: true },
    meta: {
      type: Object,
      default() {
        return {
          ...DEFAULT_META,
        };
      },
    },
    simple: {
      type: Boolean,
      default() {
        return false;
      },
    },
    size: {
      type: String,
      default() {
        return '';
      },
    },
    showSizeChanger: {
      type: Boolean,
      default() {
        return false;
      },
    },
    showQuickJumper: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },

  components: {
    Skeleton,
    Pagination,
  },

  data() {
    const { meta } = this;

    return {
      pageMeta: { ...meta },
    };
  },

  watch: {
    meta(newValue) {
      this.pageMeta = { ...newValue };
    },
  },

  computed: {
    /**
     * pagination: {
     *   current: number,
     *   hideOnSinglePage: boolean,
     *   pageSizeOptions: number[],
     *   showQuickJumper: boolean,
     *   showSizeChanger: boolean,
     *   total: number,
     * }
     */
    pagination: {
      get() {
        const { pageMeta, showSizeChanger, showQuickJumper, simple, size } = this;

        if (!pageMeta) {
          return false;
        }

        return {
          current: (pageMeta.page || 0) + 1,
          total: pageMeta.total,
          pageSize: pageMeta.limit || 20,
          showQuickJumper,
          showSizeChanger,
          pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
          // showTotal: total => `共 ${total} 条记录`,
          simple,
          size,
        };
      },

      set(value) {
        const pageMeta = {
          ...this.pageMeta,
          page: value.current - 1,
          total: value.total,
          limit: value.pageSize,
        };
        this.pageMeta = { ...pageMeta };

        this.$emit('input', pageMeta);
        this.$emit('paging', pageMeta);
      },
    },
  },

  methods: {
    onPageChange(page, pageSize) {
      this.pagination = {
        ...this.pagination,
        current: page,
        pageSize,
      };
    },
  },
};
</script>
<style lang="less" scoped>
.align-right {
  text-align: right;
}
</style>
