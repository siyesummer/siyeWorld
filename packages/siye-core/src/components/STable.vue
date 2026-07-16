<template>
  <table class="s-table">
    <colgroup v-if="hasWidthColumn">
      <col
        v-for="(item, index) in columns"
        :key="index"
        :style="getColStyle(item)"
      />
    </colgroup>

    <thead v-if="showHeader" class="s-table__head" :class="{ 's-table__head--fixed': fixedHeader }">
      <tr>
        <th
          v-for="(item, index) in columns"
          :key="index"
          class="s-table__head-cell"
          :class="[`align-${item.align || 'left'}`, item.headerClass]"
        >
          <slot
            v-if="item.slots && item.slots.header"
            :name="item.slots.header"
            v-bind="{ column: item, index }"
          />
          <span v-else>{{ item.title }}</span>
        </th>
      </tr>
    </thead>

    <tbody class="s-table__body">
      <tr
        v-for="(item, index) in tableData"
        :key="item[rowKey] || index"
        class="s-table__row"
        @click="$emit('rowClick', { item, index })"
      >
        <td
          v-for="(col, idx) in columns"
          :key="`${col.key || col.field || idx}-${index}`"
          class="s-table__body-cell"
          :class="[
            `align-${col.align || 'left'}`,
            col.cellClass,
            { 's-table__body-cell--ellipsis': col.ellipsis !== false },
          ]"
          @click.stop="$emit('cellClick', { item, column: col, index })"
        >
          <slot
            v-if="col.slots && col.slots.default"
            :name="col.slots.default"
            v-bind="{ row: item, index, column: col, value: fieldValue({ row: item, fieldPath: col.field || col.key }) }"
          />
          <span v-else>{{ fieldValue({ row: item, fieldPath: col.field || col.key }) }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { get } from '../utils';

export default {
  name: 'STable',
  props: {
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
    rowKey: {
      type: String,
      default: 'id',
    },
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    fixedHeader: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasWidthColumn() {
      return this.columns.some(item => item.width);
    },
  },
  methods: {
    fieldValue({ row = {}, fieldPath }) {
      return get(row, fieldPath, '');
    },
    getColStyle(column = {}) {
      if (!column.width) {
        return null;
      }
      return {
        width: column.width,
        minWidth: column.width,
      };
    },
  },
};
</script>

<style lang="less" scoped>
@import '../styles/theme';

.s-table {
  table-layout: fixed;
  width: 100%;
  position: relative;
  border-collapse: collapse;

  &__head {
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

    &--fixed {
      position: sticky;
      top: 0;
      background-color: #fff;
      z-index: 1;
    }
  }

  &__head-cell {
    height: 38px;
    background-color: @table-bg-color;
    background-position: 0 0;
    background-repeat: repeat-x;
    vertical-align: top;
    text-align: left;
    font-weight: normal;
    color: #666;
    background: url('https://s2.music.126.net/style/web2/img/table.png?c4e0c285b4622c09f63a90435b5b38f1') no-repeat 0 9999px;
    white-space: nowrap;
    line-height: 18px;
    padding: 8px 10px;
    background-position: 0 -56px;

    &:first-child {
      background: none;
      background-color: @table-bg-color;
    }
  }

  &__row {
    cursor: pointer;
    height: 30px;

    &:hover {
      background-color: @table-row-hover-bg;
    }

    &:nth-child(odd) {
      background-color: @table-bg-color;
    }
  }

  &__body-cell {
    padding: 6px 10px;
    line-height: 18px;
    text-align: left;
    position: relative;
    color: #333;
    font-size: 12px;
    height: 30px;
    vertical-align: top;

    &--ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.align-left {
  text-align: left;
}

.align-center {
  text-align: center;
}

.align-right {
  text-align: right;
}
</style>