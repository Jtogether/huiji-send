<template>
  <div id="addMeeting">
      <div class="page_content">
          <div class="content_left">
              <el-form :model="meetingInfo"
                ref="meetingInfo"
                :rules="rules"
                label-width="120px"
                label-position="right"
                :hide-required-asterisk="curPageStatus==0 ? true : false">
                  <div class="form_title">{{pageTitle}}</div>
                  <el-form-item label="会议主题：" prop="title">
                      <div class="detail_item" v-if="curPageStatus == 0">{{meetingInfo.title}}</div>
                      <el-input v-model="meetingInfo.title"
                        maxlength="50"
                        clearable
                        show-word-limit
                        style="width:50%"
                        v-else
                        ></el-input>
                  </el-form-item>
                  <el-form-item label="会议地点：" prop="address">
                      <div class="detail_item" v-if="curPageStatus == 0">{{meetingInfo.address}}</div>
                      <el-input v-model="meetingInfo.address"
                        maxlength="50"
                        clearable
                        show-word-limit
                        style="width:50%"
                        v-else
                        ></el-input>
                  </el-form-item>
                  <el-form-item label="会议时间段：" prop="time">
                      <div class="detail_item" v-if="curPageStatus == 0">{{meetingInfo.time[0]}} ~ {{meetingInfo.time[1]}}</div>
                      <el-date-picker
                        v-model="meetingInfo.time"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-else>
                        </el-date-picker>
                  </el-form-item>
                  <el-form-item label="会议内容：" prop="content">
                      <div class="detail_item" v-if="curPageStatus == 0">{{meetingInfo.content}}</div>
                      <el-input v-model="meetingInfo.content"
                        maxlength="500"
                        type="textarea"
                        clearable
                        show-word-limit
                        style="width:70%"
                        :autosize="{ minRows: 6, maxRows: 6}"
                        v-else
                        ></el-input>
                  </el-form-item>
              </el-form>
              <div class="footer_btn" v-if="curPageStatus == 0">
                    <el-button @click="goBack" style="width: 150px;">返回</el-button>
              </div>
              <div class="footer_btn" v-else>
                    <el-button type="primary" @click="onSubmit('meetingInfo')">立即创建</el-button>
                    <el-button @click="goBack">取消</el-button>
              </div>
          </div>
          <!-- 详情控件栏 -->
          <div class="content_right" v-if="curPageStatus == 0">
            <div class="chart_box">
              <div class="box_title">
                签到情况
              </div>
              <div id="myChart" style="width: 100%;height:400px;"></div>
              <div class="chart_font">
                <div><span style="color:rgb(84,112,198)">●</span>未签到人数：{{personCount.number0}}</div>
                <div><span style="color:rgb(145,205,117)">●</span>已签到人数：{{personCount.number1}}</div>
                <div><span style="color:rgb(250,200,88)">●</span>请假人数：{{personCount.number2}}</div>
              </div>
              <div class="box_title" style="margin-top: 50px;margin-bottom: 20px">
                请假列表
              </div>
              <div class="leave_list">
                <div class="list_item" v-for="(item,index) in leavaList" :key="index">
                  <span>{{item.name}}({{item.phone}})：</span><span style="flex: 1">{{item.reason}}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 新增控件栏 -->
          <div class="content_right"
            v-else
            v-loading="isloading"
            element-loading-text="拼命加载中">
            <div class="person_list">
              <div class="list_header">
                <div class="header_title">选择通知对象</div>
                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
              </div>
              <div class="list_content">
                <el-checkbox-group v-model="checkedList" @change="handleCheckedChange">
                  <el-checkbox v-for="item in personList" :label="item.phone" :key="item.phone" border="">{{item.name}}（{{item.phone}}）</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data () {
    return {
      isloading: false,
      pageTitle: '新建会议',
      isDetail: true, // 切换详情及编辑控件
      curPageStatus: 0,
      curMeetingInfo: {},
      meetingInfo: {
        title: '',
        address: '',
        time: [],
        content: ''
      },
      rules: {
        title: [{ required: true, message: '请输入会议主题', trigger: 'blur' }],
        address: [{ required: true, message: '请输入会议地点', trigger: 'blur' }],
        time: [{ required: true, message: '请选择完整的时间', trigger: 'change' }],
        content: [{ required: true, message: '请输入会议内容', trigger: 'blur' }]
      },
      checkAll: false, // 全选
      isIndeterminate: false,
      checkedList: [], // 已选择人员列表
      personList: [],
      leavaList: [],
      chartConfig: [
        { value: 20, name: '未签到' },
        { value: 10, name: '已签到' },
        { value: 1, name: '请假' }
      ],
      personCount: {
        number0: 0,
        number1: 0,
        number2: 0
      }
    }
  },
  methods: {
    //   数据初始化
    init () {
      const curStatus = this.$route.query.STATUS
      console.log(typeof curStatus)
      this.curPageStatus = curStatus
      if (curStatus) {
        switch (curStatus) {
          case '0':
            this.pageTitle = '会议详情'
            break
          case '1':
            this.pageTitle = '新增会议'
            break
          case '2':
            this.pageTitle = '编辑会议'
            break
        }
      }
    },
    //  图表初始化
    initChart () {
      console.log('图表初始化开始')
      const myChart = echarts.init(document.getElementById('myChart'))
      myChart.setOption({
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            data: this.chartConfig
          }
        ]
      })
    },
    // 提交
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.$route.query.meetingId) {
            this.updateMeeting()
          } else {
            this.newMeeting()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 更新会议信息
    updateMeeting () {
      const chosenList = [] //
      this.checkedList.forEach(item => {
        this.personList.forEach(i => {
          if (item === i.phone) {
            chosenList.push(i)
          }
        })
      })
      if (chosenList.length <= 0) {
        return this.$notify({
          title: '注意',
          message: '请选择通知对象！！',
          type: 'error'
        })
      }
      const params = {
        id: this.curMeetingInfo.id,
        meetingId: this.curMeetingInfo.meetingId,
        title: this.meetingInfo.title,
        meetingContent: this.meetingInfo.content,
        address: this.meetingInfo.address,
        startTime: this.meetingInfo.time[0],
        endTime: this.meetingInfo.time[1],
        status: 0,
        personList: chosenList
      }
      this.$api.updateMeeting(params).then(res => {
        if (res.data.code === 0) {
          this.$notify({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          setTimeout(() => {
            this.$router.push({
              path: '/manager/meeting/list'
            })
          }, 1000)
        } else {
          console.log(res)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 新建会议
    newMeeting () {
      const chosenList = [] //
      this.checkedList.forEach(item => {
        this.personList.forEach(i => {
          if (item === i.phone) {
            chosenList.push(i)
          }
        })
      })
      const params = {
        title: this.meetingInfo.title,
        meetingContent: this.meetingInfo.content,
        address: this.meetingInfo.address,
        startTime: this.meetingInfo.time[0],
        endTime: this.meetingInfo.time[1],
        personList: chosenList
      }
      if (params.personList.length <= 0) {
        return this.$notify({
          title: '注意',
          message: '请选择通知对象！！',
          type: 'error'
        })
      }
      console.log(params)
      this.$api.addMeeting(params).then(res => {
        if (res.data.code === 0) {
          this.$notify({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          setTimeout(() => {
            this.$router.push({
              path: '/manager/meeting/list'
            })
          }, 1000)
        } else {
          console.log(res)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 全选
    handleCheckAllChange (val) {
      const mobileList = []
      this.personList.forEach(item => {
        mobileList.push(item.phone)
      })
      this.checkedList = val ? mobileList : []
      this.isIndeterminate = false
    },
    handleCheckedChange (value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.personList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.personList.length
    },
    // 返回上一级
    goBack () {
      this.$router.go(-1)
    },
    // 初始化人员列表
    initPersonList () {
      this.isloading = true
      const params = {
        pageSize: 100,
        pageNum: 1
      }
      this.$api.getPersonList(params).then(res => {
        console.log(res)
        if (res.data.pageData.length > 0) {
          const list = res.data.pageData
          list.forEach(item => {
            if (item.role === 1) {
              const role = {
                name: item.name,
                phone: item.phone
              }
              this.personList.push(role)
            }
          })
          this.isloading = false
        } else {
          console.log('err => ', res)
          this.isloading = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 初始化页面数据
    initPage () {
      const meetingId = this.$route.query.meetingId
      if (meetingId) {
        const params = {
          meetingId
        }
        this.$api.getMeetingDetails(params).then(res => {
          console.log(res)
          if (res.data.code === 0) {
            const obj = res.data.result
            this.curMeetingInfo = obj
            console.log(this.curMeetingInfo)
            // 页面数据
            this.meetingInfo = {
              title: obj.title,
              address: obj.address,
              time: [obj.startTime, obj.endTime],
              content: obj.meetingContent
            }
            // 图表可视化数据初始化
            let number0 = 0 // 未签到
            let number1 = 0 // 已签到
            let number2 = 0 // 请假
            obj.personList.forEach(item => {
              // 选人列表回显
              this.checkedList.push(item.phone)
              this.isIndeterminate = true
              // 图表
              switch (item.isSign) {
                case 0:
                  number0++
                  break
                case 1:
                  number1++
                  break
                case 2:
                  number2++
                  this.leavaList.push({
                    name: item.name,
                    phone: item.phone,
                    reason: item.reseaon
                  })
                  break
              }
            })
            this.personCount = {
              number0,
              number1,
              number2
            }
            console.log(this.leavaList)
            this.chartConfig.forEach(item => {
              console.log(item)
              if (item.name === '未签到') {
                item.value = number0
              } else if (item.name === '已签到') {
                item.value = number1
              } else if (item.name === '请假') {
                item.value = number2
              }
            })
            if (this.curPageStatus === '0') this.initChart()
            console.log('数据处理完成')
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  },
  created () {
    this.init()
    if (this.curPageStatus === '1' || this.curPageStatus === '2') this.initPersonList()
    if (this.curPageStatus === '0' || this.curPageStatus === '2') this.initPage()
  },
  mounted () {
    // this.checkedList = ['13013511651', '13013511654', '13013511655']
    // this.isIndeterminate = true
  }
}
</script>

<style lang="less" scoped>
#addMeeting{
    height: 100%;
    .page_content{
        display: flex;
        height: 100%;
        .content_left{
            flex: 1;
            background: white;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            padding: 30px;
            min-width: 710px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .form_title{
                font-family: PingFangSC-Medium, sans-serif;
                font-weight: bold;
                font-size: 35px;
                margin-bottom: 43px;
            }
            .footer_btn{
                text-align: center;
                padding: 35px 0;
            }
        }
        .content_right{
          margin-left: 70px;
          height: 100%;
          width: 460px;
          background: white;
          box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
          display: flex;
          // 选择参会人列表
          .person_list{
            border: 1px rgb(238, 238,238) solid;
            height: 610px;
            border-radius: 4px;
            margin: 35px;
            display: flex;
            flex-direction: column;
            .list_header{
              height: 50px;
              border-bottom: 1px #eeeeee solid;
              background: #f5f7fa;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0 19px;
              .header_title{
                font-family: PingFangSC-Medium, sans-serif;
                font-weight: bold;
                font-size: 23px;
              }
            }
            .list_content{
              height: 100%;
              padding: 5px 20px;
              overflow: auto;
              /deep/ .el-checkbox.is-bordered+{
                margin-left: 0;
                margin-top: 10px;
              }
            }
            .list_content::-webkit-scrollbar {
                width: 4px;
                /*height: 4px;*/
            }
            .list_content::-webkit-scrollbar-thumb{
              border-radius: 10px;
              -webkit-box-shadow: inset 0 0 5px rgb(245,247,250);
              background: rgba(0,0,0,0.4);
            }
            // .list_content::-webkit-scrollbar-track{
            //   -webkit-box-shadow: inset 0 0 5px rgb(245,247,250);
            //   border-radius: 0;
            //   background: rgba(0,0,0,0.1);
            // }
          }
          // 图表
          .chart_box{
            flex: 1;
            padding: 35px;
            .box_title{
              font-family: PingFangSC-Medium, sans-serif;
              font-weight: bold;
              font-size: 23px;
            }
            .chart_font{
              font-size: 14px;
              display: flex;
              justify-content: space-between;
            }
            .leave_list{
              width: 100%;
              border-bottom: 2px rgb(238, 238,238) solid;
              height: 165px;
              overflow: auto;
              .list_item{
                font-family: PingFangSC-Medium, sans-serif;
                width: 100%;
                margin-bottom: 6px;
                display: flex;
              }
            }
            .leave_list::-webkit-scrollbar {
                width: 4px;
                /*height: 4px;*/
            }
            .leave_list::-webkit-scrollbar-thumb{
              border-radius: 10px;
              -webkit-box-shadow: inset 0 0 5px rgb(245,247,250);
              background: rgba(0,0,0,0.4);
            }
          }
        }
    }
}
</style>
