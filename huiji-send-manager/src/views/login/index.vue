<template>
  <div id="app">
      <div class="content">
          <div class="login_model">
                <el-form label-position="top"
                    label-width="20px"
                    :model="loginForm"
                    :rules="rules"
                    ref="loginForm"
                    :hide-required-asterisk="true">
                    <div class="form_title">
                        后台登录
                    </div>
                    <el-form-item label="帐号" prop="userName">
                        <el-input v-model="loginForm.userName"
                          placeholder="请填写帐号"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="passWord">
                        <el-input v-model="loginForm.passWord"
                          show-password
                          placeholder="请填写密码"></el-input>
                    </el-form-item>
                    <div class="footer_btn">
                        <el-button type="primary"
                            round
                            :loading="isLoading"
                            @click="submitForm('loginForm')"
                            >{{isLoading ? '登录中' : '登录'}}</el-button>
                    </div>
                </el-form>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isLoading: false,
      loginForm: {
        userName: '',
        passWord: ''
      },
      //   表单校验
      rules: {
        userName: [{ required: true, message: '请输入帐号', trigger: 'blur' }],
        passWord: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    //   校验并登录
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isLoading = true
          this.login()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 登录
    login () {
      const params = {
        name: this.loginForm.userName,
        password: this.loginForm.passWord
      }
      this.$api.systemLogin(params).then(res => {
        if (res.data.code === 0) {
          sessionStorage.setItem('resToken', res.data.result)
          this.$notify({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          this.$router.push({
            path: '/manager/notice/add'
          })
          this.$emit('changeLoginStatus', '0')

          this.isLoading = false
        } else {
          this.$notify({
            title: '登录失败',
            message: res.data.message,
            type: 'warning'
          })
          this.isLoading = false
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@theme-color: #409EFF;
.content{
    display: flex;
    justify-content: center;
    align-items: center;
    .login_model{
        width: 400px;
        background: white;
        border-radius: 20px;
        box-shadow: 0px 12px 16px 0px rgb(75 121 171 / 14%);
        padding: 30px 30px;
        display: flex;
        flex-direction: column;
        .form_title{
            font-family: PingFangSC-Medium, sans-serif;
            font-weight: bold;
            font-size: 26px;
            margin-bottom: 28px;
            color: @theme-color;
        }
        .footer_btn{
            display: flex;
            width: 100%;
            justify-content: flex-end;
            margin-top: 120px;
            /deep/ .el-button{
                width: 140px;
                height: 40px;
                font-size: 15px;
            }
        }
    }
}
</style>
