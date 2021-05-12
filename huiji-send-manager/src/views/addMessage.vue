<template>
    <div id="addMessage">
        <div class="message_Cotent">
            <div class="left_form">
                <div class="form_header">
                    新增通知
                </div>
                <el-form :model="messageForm" ref="messageForm"
                    :rules="rules"
                    label-width="120px"
                    :inline="false"
                    class="form_style"
                    >
                    <el-form-item label="通知标题：" prop="title">
                        <el-input v-model="messageForm.title"
                            clearable
                            placeholder="请输入通知的标题"
                            maxlength="50"
                            show-word-limit
                            style="width:50%"></el-input>
                    </el-form-item>
                    <el-form-item label="通知内容：" prop="content">
                        <el-input v-model="messageForm.content"
                            type="textarea"
                            clearable
                            :autosize="{ minRows: 4, maxRows: 6}"
                            maxlength="500"
                            show-word-limit
                            placeholder="请输入通知的内容"
                            style="width:70%"></el-input>
                    </el-form-item>
                </el-form>
                <div class="form_footer">
                    <el-button type="primary" @click="submit('messageForm')">立即发布</el-button>
                    <el-button @click="goBack" v-if="curPageStatus">取消</el-button>
                </div>
            </div>
            <div class="center_line"></div>
            <div class="right_show">
                <div class="show_bg">
                  <div class="show_content">
                    <div class="notice_time">{{curTime}}</div>
                    <div class="notice_title">{{messageForm.title}}</div>
                    <div class="notice_text">{{messageForm.content}}</div>
                  </div>
                </div>
                <div class="title">实时效果预览</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'AddMessage',
  data () {
    return {
      messageForm: {
        id: '',
        title: '',
        content: ''
      },
      rules: {
        title: [{ required: true, message: '请输入要发布的通知标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入要发布的通知内容', trigger: 'blur' }]
      },
      curTime: '',
      curPageStatus: this.$route.query.STATUS ? this.$route.query.STATUS : ''
    }
  },
  methods: {
    // 提交
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.$route.query.id) {
            this.updateNotice()
          } else {
            this.addNotice()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 新增通知
    addNotice () {
      const params = {
        title: this.messageForm.title,
        content: this.messageForm.content
      }
      console.log(params)
      this.$api.addNotice(params).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          this.$notify({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          this.$router.push({
            path: '/manager/notice/list'
          })
        } else {
          console.log(res)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 修改通知
    updateNotice () {
      const params = {
        id: this.messageForm.id,
        title: this.messageForm.title,
        content: this.messageForm.content
      }
      console.log(params)
      this.$api.updateNotice(params).then(res => {
        if (res.data.code === 0) {
          this.$notify({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          this.$router.push({
            path: '/manager/notice/list'
          })
        }
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    // 数据初始化
    init () {
      setInterval(() => {
        const time = new Date().format('yyyy/MM/dd HH:mm')
        this.curTime = time
      }, 1000)
      // 编辑回显
      if (this.$route.query.id) {
        const params = {
          id: this.$route.query.id
        }
        this.$api.getNoticeDetail(params).then(res => {
          if (res.data.code === 0) {
            const obj = res.data.result
            this.messageForm = {
              id: obj.id,
              title: obj.title,
              content: obj.content
            }
          }
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      }
    },
    // 返回上一级
    goBack () {
      this.$router.go(-1)
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
#addMessage{
    background: white;
    height: 100%;
    .message_Cotent{
        display: flex;
        height: 100%;
        align-items: center;
        .left_form{
            flex: 1;
            padding: 0 30px;
            height: 100%;
            display: flex;
            flex-direction: column;
            min-width: 700px;
            .form_header{
                font-family: PingFangSC-Medium, sans-serif;
                font-weight: bold;
                font-size: 25px;
                border-bottom: 1px gray solid;
                width: 95%;
                padding: 20px 10px;
            }
            .form_style{
                flex: 1;
                padding-top: 85px;
            }
            .form_footer{
                display: flex;
                align-items: center;
                justify-content: center;
                height: 110px;
            }
        }
        .center_line{
            border-right: 2px rgb(196, 196, 196) solid;
            height: 50%;
        }
        .right_show{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            padding: 0 70px;
            .title{
                font-family: PingFangSC-Medium, sans-serif;
                font-weight: bold;
                font-size: 18px;
            }
        }
    }
  .show_bg{
    height: 640px;
    width: 340px;
    background: url(../assets/iphone_bg.jpg) no-repeat;
    background-size: 340px 640px;
    margin-bottom: 60px;
    .show_content{
      padding: 35px;
      .notice_time{
        text-align: center;
        margin-top: 141px;
        width: 100%;
      }
      .notice_title{
        font-family: PingFangSC-Medium, sans-serif;
        font-weight: bold;
        word-wrap: break-word;
        padding: 8px 0;
        width: 100%;
        font-size: 20px;
        border-bottom: 2px gray solid;
        text-align: center;
      }
      .notice_text{
        font-family: PingFangSC-Medium, sans-serif;
        word-wrap: break-word;
        width: 100%;
        margin-top: 8px;
        overflow: auto;
        height: 200px;
        /*滚动条样式*/
      }
      .notice_text::-webkit-scrollbar {
          width: 4px;
          /*height: 4px;*/
      }
      .notice_text::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: rgba(0,0,0,0.2);
      }
      .notice_text::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 0;
        background: rgba(0,0,0,0.1);
      }
    }
  }
}
</style>
