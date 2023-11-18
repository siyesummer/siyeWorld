import Cookies from 'js-cookie';
import { logout } from '../api/login';
import { PaginationWrapper } from '../components';

const store = {
  namespaced: true,

  state: {
    profile: Cookies.get('profile') ? JSON.parse(Cookies.get('profile')) : {},
    account: Cookies.get('account') ? JSON.parse(Cookies.get('account')) : {},
    cookie: localStorage.getItem('cookie') || '',
    // 音频列表
    audioList: [],
    currentAudio: null,
    // 音频列表分页参数
    meta: { ...PaginationWrapper.defaultMeta, limit: 15 },
  },

  mutations: {
    setProfile(state, payload) {
      Cookies.set('profile', JSON.stringify(payload || {}));
      state.profile = payload;
    },

    setAccount(state, payload) {
      Cookies.set('account', JSON.stringify(payload || {}));
      state.account = payload;
    },

    setCookie(state, payload) {
      // cookie存储上限为4k
      // Cookies.set('cookie', payload || '');
      localStorage.setItem('cookie', payload);
      state.cookie = payload;
    },

    setAudioList(state, payload) {
      state.audioList = payload || [];
    },

    updateMeta(state, payload) {
      const update = typeof payload === 'object' ? payload : { total: payload };
      state.meta = {
        ...state.meta,
        ...update,
      };
    },

    updateCurrentAudio(state, payload) {
      state.currentAudio = payload;
    },
  },

  actions: {
    // 退出登录
    async logout({ commit }) {
      const { code } = await logout();
      if (code !== 200) return;

      // 清除缓存数据
      commit('setProfile');
      commit('setAccount');
      commit('setCookie');
    },
  },
};

export default store;
