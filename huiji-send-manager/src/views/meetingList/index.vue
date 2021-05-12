<template>
    <div id="meetingList">
        <div class="list_content">
            <div class="list_header">
                会议列表管理
            </div>
            <div class="operating_btn">
                <el-button type="primary" @click="toAdd('1')">新增会议</el-button>
            </div>
            <el-row class="list_table">
                <el-table
                    :data="tableData"
                    style="width: 100%"
                    :row-class-name="tableRowClassName"
                    v-loading="loading"
                    element-loading-text="拼命加载中">
                    <el-table-column
                        label="序号"
                        width="70">
                        <template slot-scope="scope">
                          <span>{{(tableConfig.curPage - 1) * tableConfig.size + scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="title"
                        label="会议标题"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        label="会议时间"
                        width="300"
                        align="center">
                        <template slot-scope="scope">
                            {{scope.row.startTime + ' ~ ' + scope.row.endTime}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="未反馈人数"
                        align="center">
                        <template slot-scope="scope">
                            <span style="color: gray">{{scope.row.number}}</span> / <span style="font-weight:bold">{{scope.row.total}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="已签到人数"
                        align="center">
                        <template slot-scope="scope">
                            <span style="color: #409EFF">{{scope.row.signInNumber}}</span> / <span style="font-weight:bold">{{scope.row.total}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="请假人数"
                        align="center">
                        <template slot-scope="scope">
                            <span style="color: red">{{scope.row.leaveNumber}}</span> / <span style="font-weight:bold">{{scope.row.total}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        align="center">
                        <template slot-scope="scope">
                            {{scope.row.status | matchStatus}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center">
                        <!-- <template slot-scope="row"> -->
                        <template slot-scope="scope">
                            <span class="tooltip_font"
                                style="margin-right: 10px"
                                @click="toAdd('0',scope.row.meetingId)">详情</span>
                            <el-popover
                                placement="bottom"
                                trigger="hover"
                                :visible-arrow="false"
                                popper-class="tooltip_content"
                                v-if="scope.row.status != 2">
                                    <div class="tooltip_btn"
                                        style="border-bottom: 1px rgb(250,250,250) solid;"
                                        @click="toAdd('2',scope.row.meetingId)"
                                        v-if="scope.row.status == 0 || scope.row.status == 1">编辑</div>
                                    <div class="tooltip_btn" @click="toDelete(scope.row.id)" v-if="scope.row.status == 0">删除</div>
                                <span slot="reference" class="tooltip_font">更多</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="tableConfig.curPage"
                :page-sizes="tableConfig.sizes"
                :page-size="tableConfig.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableConfig.total"
                style="text-align: right;">
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
  name: 'MeetingList',
  data () {
    return {
      tableConfig: {
        total: 20,
        sizes: [5, 10, 20],
        size: 5,
        curPage: 1
      },
      tableData: [],
      loading: false
    }
  },
  filters: {
    matchStatus (status) {
      const STATUS_CONFIG = [
        {
          id: 0,
          name: '待进行'
        },
        {
          id: 1,
          name: '进行中'
        },
        {
          id: 2,
          name: '已结束'
        }
      ]
      let statusName = ''
      STATUS_CONFIG.forEach(obj => {
        if (obj.id == status) { //eslint-disable-line
          console.log(obj.name)
          statusName = obj.name
        }
      })
      return statusName
    }
  },
  methods: {
    // 删除
    toDelete (id) {
      this.$confirm('将删除该条会议, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id
        }
        this.$api.deleteMeeting(params).then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: res.data.message,
              type: 'success'
            })
            this.initTable()
          } else {
            this.$notify({
              title: '失败',
              message: res.data.message,
              type: 'warning'
            })
          }
        }).catch(err => {
          console.log(err)
        })
      })
    },
    // 新增/编辑跳转
    toAdd (status, meetingId) {
      const query = {
        STATUS: status,
        meetingId: meetingId
      }
      this.$router.push({
        name: 'addMeeting',
        query
      })
    },
    //   表格行区分
    tableRowClassName ({ row, rowIndex }) {
      if (this.tableData[rowIndex].status === 0) {
        return 'beforeStart-row'
      } else if (this.tableData[rowIndex].status === 1) {
        return 'starting-row'
      } else {
        return ''
      }
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.tableConfig.size = val
      this.initTable()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.tableConfig.curPage = val
      this.initTable()
    },
    // 初始化列表数据
    initTable () {
      this.loading = true
      const params = {
        pageSize: this.tableConfig.size,
        pageNum: this.tableConfig.curPage
      }
      this.$api.getMeetingList(params).then(res => {
        console.log(res)
        if (res.data.pageData.length > 0) {
          this.tableData = res.data.pageData
          this.tableData.forEach(item => {
            item.total = item.number + item.signInNumber + item.leaveNumber
            item.startTime = item.startTime.split('.')[0].replace('T', '  ')
            item.endTime = item.endTime.split('.')[0].replace('T', '  ')
          })
          this.tableConfig.total = res.data.total
          this.loading = false
        } else {
          console.log(res)
          this.tableData = []
          this.loading = false
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.initTable()
  }
}
</script>

<style lang='less' scoped>
@theme-color: #409EFF;
#meetingList{
    background: white;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    height: 100%;
    .list_content{
        flex: 1;
        padding: 21px;
        .list_header{
            font-family: PingFangSC-Medium, sans-serif;
            font-weight: bold;
            font-size: 30px;
            border-bottom: 1px gray solid;
            padding-bottom: 21px;
            padding-left: 10px;
        }
        .operating_btn{
            margin-top: 40px;
            padding-left: 10px;
        }
        .list_table{
            border: 1px rgb(235,238,248) solid;
            margin: 25px 0;
        }
        .tooltip_font{
            cursor: pointer;
            color: @theme-color
        }
    }
}
</style>
