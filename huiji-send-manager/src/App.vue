<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <header-bar :isLogin="isLogined" @changeLoginStatus="changeLoginStatus"/>
    <div class="content">
      <!-- 左边导航栏 -->
      <div class="left_bar" v-if="isLogined">
        <nav-bar/>
      </div>
      <!-- 右侧内容栏 -->
      <div class="right_content">
        <router-view @changeLoginStatus="changeLoginStatus"/>
      </div>
    </div>
  </div>
</template>

<script>
import headerBar from '@/components/header-bar.vue'
import navBar from '@/components/nav-bar.vue'
export default {
  data () {
    return {
      isLogined: false
    }
  },
  methods: {
    changeLoginStatus (status) {
      // 0 登录 1登出
      if (status === '0') {
        this.isLogined = true
      } else if (status === '1') {
        this.isLogined = false
      }
    }
  },
  components: { headerBar, navBar },
  destroyed () {
    sessionStorage.removeItem('resToken')
  },
  mounted () {
    if (sessionStorage.getItem('resToken')) {
      this.isLogined = true
    }
  }
}
</script>

<style lang="less">
body,html{
  padding: 0;
  margin: 0;
  background: rgb(250,250,250);
  height: 100%;
}
#app{
  height: 100%;
  display: flex;
  flex-direction: column;
  .content{
    display: flex;
    flex: 1;
    .right_content{
      // background: white;
      margin: 30px 37px 30px 15px;
      flex: 1;
    }
  }
}
</style>
