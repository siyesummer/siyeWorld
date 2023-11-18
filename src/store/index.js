import Vue from 'vue';
import Vuex from 'vuex';
// eslint-disable-next-line import/no-extraneous-dependencies
import siyeMusic from 'siye-music/src/store/index';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    siyeMusic
  }
});

export default store;
