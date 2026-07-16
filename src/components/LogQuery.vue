<template>
  <div class="log-query-page">
    <section class="hero-card">
      <div>
        <p class="hero-card__eyebrow">Log Center</p>
        <h1>music-api / socket / easy-chat-history 查询</h1>
      </div>
      <div class="hero-card__meta">
        <span>共 {{ summary.total }} 条</span>
        <span>{{ summary.truncated ? '后续还有更多页' : '当前已到最后一页' }}</span>
      </div>
    </section>

    <section class="query-card">
      <div class="query-grid">
        <label class="field">
          <span>关键字</span>
          <input
            v-model.trim="form.keyword"
            type="text"
            placeholder="支持按异常关键字、用户 ID、昵称、消息内容筛选"
            @keyup.enter="submitQuery"
          />
        </label>

        <label class="field">
          <span>服务</span>
          <select v-model="form.service">
            <option value="all">全部</option>
            <option value="music-api">music-api</option>
            <option value="socket">socket</option>
            <option value="chat-history">easy-chat-history</option>
          </select>
        </label>

        <label class="field">
          <span>级别</span>
          <select v-model="form.level">
            <option value="">全部</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
          </select>
        </label>
      </div>

      <div class="query-actions">
        <button class="primary-btn" :disabled="loading" @click="submitQuery">
          {{ loading ? '查询中...' : '查询日志' }}
        </button>
        <button class="ghost-btn" :disabled="loading" @click="resetQuery">重置</button>
      </div>
    </section>

    <section class="summary-grid">
      <article class="summary-card">
        <span class="summary-card__label">服务范围</span>
        <strong>{{ displayService }}</strong>
      </article>
      <article class="summary-card">
        <span class="summary-card__label">生成时间</span>
        <strong>{{ summary.generatedAt || '--' }}</strong>
      </article>
      <article class="summary-card">
        <span class="summary-card__label">分页状态</span>
        <strong>第 {{ pagination.current }} / {{ totalPages }} 页</strong>
      </article>
    </section>

    <section class="result-card">
      <div class="result-card__header">
        <div>
          <h2>日志明细</h2>
          <p>使用共享 STable 查看日志和 easy-chat 历史消息，并在底部进行服务端分页浏览。</p>
        </div>
        <button
          v-if="records.length"
          class="ghost-btn"
          :disabled="loading"
          @click="copyLogs"
        >
          复制结果
        </button>
      </div>

      <p v-if="errorMessage" class="feedback feedback--error">{{ errorMessage }}</p>
      <p v-else-if="loading" class="feedback">正在读取服务端日志...</p>
      <SEmpty v-else-if="!records.length" description="暂无日志数据，先执行一次查询。" />

      <div v-else class="table-section">
        <div class="table-shell">
          <STable :columns="tableColumns" :table-data="records" :fixed-header="false">
            <template #levelCell="{ value }">
              <span class="table-level" :class="`table-level--${String(value).toLowerCase()}`">
                {{ value }}
              </span>
            </template>
            <template #contentCell="{ value }">
              <pre class="table-content">{{ value }}</pre>
            </template>
          </STable>
        </div>

        <div class="table-footer">
          <span class="table-footer__summary">
            第 {{ pagination.current }} / {{ totalPages }} 页，共 {{ summary.total }} 条，每页 {{ pagination.pageSize }} 条
          </span>
          <SPagination
            :current="pagination.current"
            :total="summary.total"
            :page-size="pagination.pageSize"
            :size="'small'"
            :show-quick-jumper="true"
            :show-size-changer="true"
            @change="handlePageChange"
            @showSizeChange="handlePageSizeChange"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { SEmpty, SPagination, STable } from 'siye-core/src/components';
import message from 'siye-core/src/components/message';
import { fetchLogs, normalizeLogResponse } from '../api/logs';

function createInitialForm() {
  return {
    service: 'all',
    level: '',
    keyword: '',
  };
}

function createInitialSummary() {
  return {
    total: 0,
    truncated: false,
    generatedAt: '',
    service: '',
  };
}

function createInitialPagination() {
  return {
    current: 1,
    pageSize: 10,
  };
}

export default {
  name: 'LogQuery',
  components: {
    SEmpty,
    SPagination,
    STable,
  },
  data() {
    return {
      loading: false,
      errorMessage: '',
      form: createInitialForm(),
      records: [],
      summary: createInitialSummary(),
      pagination: createInitialPagination(),
      tableColumns: [
        { key: 'time', field: 'time', title: '时间', width: '180px' },
        { key: 'source', field: 'source', title: '来源', width: '220px' },
        { key: 'level', field: 'level', title: '级别', width: '100px', slots: { default: 'levelCell' } },
        { key: 'lineNo', field: 'lineNo', title: '行号', width: '90px', align: 'center' },
        { key: 'content', field: 'content', title: '日志内容', ellipsis: false, slots: { default: 'contentCell' } },
      ],
    };
  },
  computed: {
    displayService() {
      return this.summary.service || this.form.service || 'all';
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.summary.total / this.pagination.pageSize));
    },
  },
  methods: {
    buildQueryParams() {
      const params = {
        service: this.form.service,
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
      };

      if (this.form.level) {
        params.level = this.form.level;
      }

      if (this.form.keyword) {
        params.keyword = this.form.keyword;
      }

      return params;
    },
    resetPagination() {
      this.pagination = createInitialPagination();
    },
    async loadLogs() {
      this.loading = true;
      this.errorMessage = '';

      try {
        const payload = await fetchLogs(this.buildQueryParams());
        const result = normalizeLogResponse(payload);

        this.records = result.records;
        this.summary = {
          total: result.total,
          truncated: result.truncated,
          generatedAt: result.generatedAt,
          service: result.service,
        };
        this.pagination = {
          current: result.page || this.pagination.current,
          pageSize: result.pageSize || this.pagination.pageSize,
        };

        if (!result.records.length) {
          message.info('查询完成，但当前条件下没有日志结果。');
        }
      } catch (error) {
        this.records = [];
        this.summary = createInitialSummary();
        this.errorMessage = (error && error.response && error.response.data && error.response.data.message)
          || error.message
          || '日志查询失败，请检查 Linux 日志服务状态或跨域配置。';
        message.error(this.errorMessage);
      } finally {
        this.loading = false;
      }
    },
    submitQuery() {
      this.pagination.current = 1;
      this.loadLogs();
    },
    resetQuery() {
      this.form = createInitialForm();
      this.errorMessage = '';
      this.resetPagination();
      this.loadLogs();
    },
    handlePageChange(page, pageSize) {
      this.pagination = {
        current: page,
        pageSize,
      };
      this.loadLogs();
    },
    handlePageSizeChange(page, pageSize) {
      this.pagination = {
        current: page,
        pageSize,
      };
      this.loadLogs();
    },
    async copyLogs() {
      const text = this.records.map(item => (
        `[${item.level}] [${item.source}] ${item.time} line:${item.lineNo}\n${item.content}`
      )).join('\n\n');

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        message.success('日志内容已复制。');
      } catch (error) {
        message.error('复制失败，请手动选择内容复制。');
      }
    },
  },
};
</script>

<style lang="less" scoped>
.log-query-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1280px;
  margin: 0 auto;
}

.hero-card,
.query-card,
.summary-card,
.result-card {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
}

.hero-card {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 28px 32px;

  h1 {
    margin-bottom: 12px;
    color: #0f172a;
    font-size: 32px;
  }

  code {
    padding: 2px 8px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.06);
  }

  &__eyebrow {
    margin-bottom: 10px;
    color: #c20c0c;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  &__desc {
    max-width: 760px;
    color: rgba(15, 23, 42, 0.74);
    font-size: 14px;
    line-height: 1.75;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    min-width: 180px;
    color: #475569;
    font-size: 14px;
  }
}

.query-card,
.result-card {
  padding: 24px;
}

.query-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;

  span {
    color: #334155;
    font-size: 13px;
    font-weight: 600;
  }

  input,
  select {
    height: 42px;
    padding: 0 14px;
    border: 1px solid #d7dce5;
    border-radius: 14px;
    outline: none;
    font-size: 14px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus {
      border-color: #c20c0c;
      box-shadow: 0 0 0 4px rgba(194, 12, 12, 0.1);
    }
  }
}

.query-actions,
.result-card__header {
  display: flex;
  align-items: center;
}

.query-actions {
  gap: 12px;
  margin-top: 20px;
}

.primary-btn,
.ghost-btn {
  height: 42px;
  padding: 0 18px;
  border-radius: 14px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-btn {
  border: none;
  color: #fff;
  background: linear-gradient(135deg, #111827 0%, #c20c0c 100%);
  box-shadow: 0 12px 24px rgba(194, 12, 12, 0.2);
}

.ghost-btn {
  border: 1px solid #d7dce5;
  color: #334155;
  background: #fff;
}

.primary-btn:disabled,
.ghost-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.summary-card {
  padding: 20px 24px;

  strong {
    display: block;
    color: #0f172a;
    font-size: 18px;
  }

  &__label {
    display: inline-block;
    margin-bottom: 10px;
    color: #64748b;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
}

.result-card__header {
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;

  h2 {
    margin-bottom: 8px;
    color: #0f172a;
    font-size: 22px;
  }

  p {
    color: #64748b;
    font-size: 13px;
  }
}

.feedback {
  padding: 16px 18px;
  border-radius: 16px;
  background: #f8fafc;
  color: #475569;

  &--error {
    background: rgba(239, 68, 68, 0.08);
    color: #b91c1c;
  }
}

.table-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-shell {
  overflow-x: auto;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
}

.table-level {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 12px;
  background: rgba(59, 130, 246, 0.16);
  color: #1d4ed8;

  &--warn {
    background: rgba(245, 158, 11, 0.16);
    color: #b45309;
  }

  &--error {
    background: rgba(239, 68, 68, 0.16);
    color: #b91c1c;
  }
}

.table-content {
  margin: 0;
  color: #0f172a;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  &__summary {
    color: #64748b;
    font-size: 13px;
  }
}

@media (max-width: 960px) {
  .hero-card,
  .result-card__header,
  .table-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-card__meta {
    align-items: flex-start;
  }

  .query-grid,
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
