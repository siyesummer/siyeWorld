<template>
  <div class="my-world">
    <SiyeMusic />
    <EasyChat />
    <div v-if="recordNumber" class="record-number">
      <a
        :href="recordUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ recordNumber }}
      </a>
    </div>
  </div>
</template>

<script>
import SiyeMusic from '@siye-music/views/Index';
import EasyChat from '@easy-chat/views/Room';

export default {
  name: 'MyWorld',
  props: {
    value: String,
  },
  data() {
    return {
      recordUrl: 'https://beian.miit.gov.cn/',
    };
  },
  computed: {
    recordNumber() {
      const host = window.location.hostname;

      if (['siyefun.top', 'www.siyefun.top'].includes(host)) {
        return '\u95fdICP\u590717032186\u53f7-2';
      }

      return '';
    },
  },
  components: {
    SiyeMusic,
    EasyChat,
  },
};
</script>

<style scoped>
.my-world {
  position: relative;
}

.record-number {
  padding: 16px 0 24px;
  font-size: 12px;
  text-align: center;
}

.record-number a,
.record-number a:link,
.record-number a:visited {
  color: rgba(55, 53, 47, 0.58) !important;
  text-decoration: none;
  transition: color 0.2s ease;
}

.record-number a:hover,
.record-number a:active {
  color: #9f2a2a !important;
}
</style>
