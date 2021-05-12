<template>
  <div id="noticeList">
      <div class="list_content">
            <div class="list_header">
                通知列表管理
            </div>
            <div class="operating_btn">
                <el-button type="primary" @click="toAdd('1')">新增通知</el-button>
            </div>
            <el-row class="list_table">
                <el-table
                    :data="tableData"
                    style="width: 100%"
                    stripe
                    v-loading="loading"
                    element-loading-text="拼命加载中">
                    <el-table-column
                        label="序号"
                        width="70"
                        align="center">
                        <template slot-scope="scope">
                          <span>{{(tableConfig.curPage - 1) * tableConfig.size + scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="title"
                        label="通知标题"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="time"
                        label="发布时间"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="content"
                        label="通知内容">
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center">
                        <template slot-scope="scope">
                            <span class="tooltip_font"
                                style="margin-right: 10px"
                                @click="toAdd('2',scope.row.id)">编辑</span>
                            <el-popconfirm
                                confirm-button-text='好的'
                                cancel-button-text='不用了'
                                icon="el-icon-info"
                                icon-color="red"
                                title="确定删除该通知？"
                                @confirm="toDelete(scope.row.id)"
                                >
                                <span slot="reference" class="tooltip_font">删除</span>
                            </el-popconfirm>
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
  data () {
    return {
      loading: false,
      tableConfig: {
        total: 0,
        sizes: [5, 10, 20],
        size: 5,
        curPage: 1
      },
      tableData: []
    }
  },
  methods: {
    //   删除通知
    toDelete (id) {
      const params = {
        id
      }
      this.$api.deleteNotice(params).then(res => {
        if (res.data.code === 0) {
          this.$notify({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          this.init()
        } else {
          console.log(res)
          this.init()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 新增/编辑
    toAdd (status, noticeId) {
      const query = {
        id: noticeId,
        STATUS: status
      }
      this.$router.push({
        name: 'addMessage',
        query
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.tableConfig.size = val
      this.init()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.tableConfig.curPage = val
      this.init()
    },
    // 页面数据初始化
    init () {
      this.loading = true
      const params = {
        pageSize: this.tableConfig.size,
        pageNum: this.tableConfig.curPage
      }
      this.$api.getNoticeList(params).then(res => {
        if (res.data.total && res.data.total > 0) {
          const arr = res.data.pageData
          arr.forEach(item => {
            item.time = item.time.split('.')[0].replace('T', '  ')
          })
          this.tableConfig.total = res.data.total
          this.tableData = arr
          this.loading = false
        } else {
          this.tableData = []
          console.log(res)
          this.loading = false
        }
        console.log(res)
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
@theme-color: #409EFF;
#noticeList{
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
