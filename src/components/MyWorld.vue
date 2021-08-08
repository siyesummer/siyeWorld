<template>
  <div>
    <SiyeMusic />
    <EasyChat />
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
  components: {
    SiyeMusic,
    EasyChat,
  },
};
</script>
