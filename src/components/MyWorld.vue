<template>
  <div>
    <SiyeMusic />
  </div>
</template>

<script>
import SiyeMusic from '@siye-music/views/Index';

export default {
  name: 'MyWorld',
  props: {
    value: String,
  },
  components: {
    SiyeMusic,
  },
};
</script>
