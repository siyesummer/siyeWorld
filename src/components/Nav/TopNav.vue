<template>
  <fragment>
    <div class="topbar">
      <div class="wrapper">
        <h1 class="logo" @click="toHomePage">
          <img :src="navLogo" class="img" />四叶世界
        </h1>
        <ul class="nav">
          <li
            v-for="(item,index) in routeMap"
            :class="curIndex === index ? 'active' : ''"
            :key="index"
            @click="curIndex = index"
          >
            <router-link class="menu-item-text" :to="{name: item.name}">{{item.meta.label}}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </fragment>
</template>

<script>
import routeMap from '../../route';

export default {
  name: 'TopNav',
  components: {},
  props: {
    value: String,
  },
  data() {
    return {
      navLogo: 'images/logo.jpg',
      routeMap,
      curIndex: 0,
    };
  },
  computed: {},
  methods: {
    toHomePage() {
      this.$router.push({ name: 'myWrold' });
    },
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
@topbar-bg: #001529;
@topbar-hover-bg: #000;
@hover-border-bg: #c20c0c;

.topbar {
  background-color: @topbar-bg;
  width: 100%;
  position: fixed;
  height: 70px;
  line-height: 70px;
  .wrapper {
    width: 1180px;
    margin: 0 auto;
    display: flex;
    .logo {
      display: inline-block;
      color: white;
      margin-bottom: 0px;
      cursor: pointer;
      .img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        transition: transform 1s;
        transform-origin: center bottom;
        perspective: 500px;
        margin-right: 5px;
        margin-bottom: 0px;
      }
    }
    ul.nav {
      flex-grow: 1;
      list-style: none;
      margin-bottom: 0px;
      li {
        float: left;
        height: 70px;
        font-size: 14px;
        padding: 0 20px;
        cursor: pointer;
        a {
          color: #fff;
          text-decoration: none;
          display: inline-block;
        }
        &:hover {
          background-color: @topbar-hover-bg;
          border-bottom: 3px solid @hover-border-bg;
        }
      }
      li.active {
        background-color: @topbar-hover-bg;
        border-bottom: 3px solid @hover-border-bg;
      }
    }
  }
}
</style>
