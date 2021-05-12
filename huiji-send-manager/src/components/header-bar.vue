<template>
  <div id="headerBar">
      <div class="header_style">
          <div class="title">
              会即Send-管理后台
          </div>
          <div class="person_info" v-if="isLogin">
            <el-dropdown   @command="handleCommand">
                <span class="el-dropdown-link info_style">
                    {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item disabled command="a">修改密码</el-dropdown-item>
                    <el-dropdown-item command="b">登出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderBar',
  props: {
    isLogin: {
      type: Boolean
    }
  },
  data () {
    return {
      userName: '系统管理员'
    }
  },
  methods: {
    // 登出
    loginOut () {
      this.$notify({
        title: '成功',
        message: '登出成功！',
        type: 'warning'
      })
      setTimeout(() => {
        this.$emit('changeLoginStatus', '1')
        sessionStorage.removeItem('resToken')
        this.$router.push({
          path: '/Login'
        })
      }, 2000)
    },
    handleCommand (command) {
      if (command === 'b') this.loginOut()
    }
  }
}
</script>

<style lang="less" scoped>
@row-height: 60px;
@theme-color: #409EFF;
#headerBar{
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    .header_style{
        height: @row-height;
        border-bottom: 1px #e6e6e6 solid;
        display: flex;
        justify-content: space-between;
        padding: 0 35px;

        .title{
            line-height: 60px;
            font-family: PingFangSC-Medium, sans-serif;
            font-weight: bold;
            font-size: 22px;
        }
        .person_info{
            line-height: @row-height;
        }
        .info_style{
            cursor: pointer;
            color: @theme-color;
            font-family: PingFangSC-Medium, sans-serif;
            font-size: 15px;
        }
    }
}
</style>
