<template>
  <div class="my-world">
    <SiyeMusic />
    <EasyChat />
    <div class="record-number">{{ recordNumber }}</div>
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
      recordNumber: '\u95fdICP\u590717032186\u53f7-2',
    };
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
  color: #999;
  font-size: 12px;
  text-align: center;
}
</style>
