<template>
  <div id="navBar">
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      @select="handleSelect"
      :collapse="isCollapse">
      <el-menu-item index="1">
        <i class="el-icon-s-promotion"></i>
        <span slot="title">快速通知</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-s-platform"></i>
          <span>会议管理</span>
        </template>
        <el-menu-item index="2-1">会议列表</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-s-comment"></i>
          <span>通知管理</span>
        </template>
        <el-menu-item index="3-1">通知列表</el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-user-solid"></i>
          <span>人员管理</span>
        </template>
        <el-menu-item index="4-1">人员列表</el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="collapse_btn" @click="changeCollapse">
        <i class="el-icon-caret-left" v-if="!isCollapse"></i>
        <i class="el-icon-caret-right" v-else></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  data () {
    return {
      isCollapse: false,
      activeIndex: '1'
    }
  },
  methods: {
    // 折叠/展开侧边栏
    changeCollapse () {
      if (this.isCollapse) {
        this.isCollapse = false
      } else {
        this.isCollapse = true
      }
    },
    // 选中导航项
    handleSelect (key, keyPath) {
      console.log(key + ' -------- ' + keyPath)
      switch (key) {
        case '1':
          this.$router.push({
            path: '/manager/notice/add'
          })
          break
        case '2-1':
          this.$router.push({
            path: '/manager/meeting/list'
          })
          break
        case '3-1':
          this.$router.push({
            path: '/manager/notice/list'
          })
          break
        case '4-1':
          this.$router.push({
            path: '/manager/person/list'
          })
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
#navBar{
    height: 100%;
    display: flex;
    /deep/ .el-menu-vertical-demo{
        height: 100%;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 300px;
        min-height: 400px;
    }
    .collapse_btn{
        cursor: pointer;
        background: white;
        height: 50px;
        line-height: 50px;
        text-align: center;
        width: 22px;
        position: relative;
        top: 50%;
    }
}
</style>
