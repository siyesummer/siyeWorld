<template>
  <table class="audio-table">
    <colgroup>
      <col
        v-for="(item,index) in columns"
        :key="index"
        :style="`width: ${item.width}; min-width: ${item.width}`"
      />
    </colgroup>
    <!-- 表头thead -->
    <thead class="audio-thead" :class="{'fixed-header': fixedHeader}" v-if="showHeader">
      <tr>
        <th
          v-for="(item,index) in columns"
          :key="index"
          class="header-th"
          :class="[
            'align-' + (item.align || 'left'),
          ]"
        >
          <slot
            v-if="item.slots && item.slots.header"
            :name="item.slots.header"
            v-bind="{column: item, index}"
          />
          <span v-else>{{item.title}}</span>
        </th>
      </tr>
    </thead>
    <!-- tbody -->
    <tbody class="audio-tbody">
      <tr
        v-for="(item,index) in tableData"
        :key="item[rowKey] || index"
        @click="$emit('rowClick', {item, index})"
      >
        <td
          v-for="(col,idx) in columns"
          :key="col[rowKey] || idx"
          class="body-td"
          :class="[
            'align-' + (col.align || 'left'),
          ]"
          @click="$emit('cellClick', {item, column: col,index})"
        >
          <slot
            v-bind="{row: item, index}"
            v-if="col.slots && col.slots.default"
            :name="col.slots.default"
          />
          <span v-else>{{fieldValue({row: item, fieldPath: col.field})}}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { get } from 'lodash';

export default {
  name: 'STable',
  props: {
    /**
     * 列配置
     * {
     *    title: String 标题,
     *    field: String 数据 path 支持深层次(如a.b.c)形式,
     *    width: String 配置列宽度 ['2em' | '100px' | '15%'],
     *    align: String 对齐方式 ['left' | 'center' | 'right'],
     *    slots: {
     *      default: String, // td对应插槽名称
     *      header: String, // 表头th对应插槽名
     *    }
     *    events: {
     *      rowClick({row, index}) => {} , // 行点击
     *      cellClick({item, column, index}) => {} , // 单元格点击
     *    }
     * }
     */
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
    // rowkey对应字段
    rowKey: {
      type: String,
      default: 'id',
    },
    // 表格数据
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
    // 显示表头
    showHeader: {
      type: Boolean,
      default: true,
    },
    // 表头吸顶
    fixedHeader: {
      type: Boolean,
      default: true,
    }
  },
  methods: {
    fieldValue({ row = {}, fieldPath }) {
      return get(row, fieldPath);
    },
  },
};
</script>
<style lang="less" scoped>
@import '../styles/siye-music';
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

.audio-table {
  table-layout: fixed;
  width: 100%;
  position: relative;
  thead.audio-thead {
    position: relative;

    &::before {
      content: '';
      display: block;
      width: 100%;
      height: 3px;
      background-color: @primary-border-color;
      position: absolute;
      z-index: 2;
    }

    &.fixed-header {
      position: sticky;
      top: 0px;
      background-color: #fff;
      z-index: 1;
    }
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
        &:first-child {
          background: none;
        }
        &:nth-child(n + 1) {
          line-height: 18px;
          padding: 8px 10px;
          background-position: 0 -56px;
        }
        &.align- {
          &left {
            text-align: left;
          }
          &center {
            text-align: center;
          }
          &right {
            text-align: right;
          }
        }
      }
    }
  }
  tbody.audio-tbody {
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

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &.align- {
          &left {
            text-align: left;
          }
          &center {
            text-align: center;
          }
          &right {
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
