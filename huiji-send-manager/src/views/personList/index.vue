<template>
<div id="personList">
    <div class="list_content">
        <div class="list_header">
            人员管理
        </div>
        <div class="operating_btn">
            <el-button type="primary" @click="toAdd('1')">人员录入</el-button>
              <el-input placeholder="搜索姓名或手机号后4位"
                      v-model="searchConfig.text"
                      class="input-with-select"
                      style="margin-left: 10px;width:300px"
                      @change="searchChange">
                      <el-button slot="append" icon="el-icon-search" @click="searchByText"></el-button>
                  </el-input>
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
                    prop="phone"
                    label="手机号码"
                    width="180"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名"
                    width="180"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center">
                    <template slot-scope="scope">
                        <span class="tooltip_font"
                            style="margin-right: 10px"
                            @click="toAdd('2',scope.row.id)"
                            v-if="scope.row.role !== 0">信息编辑</span>
                        <el-popconfirm
                            confirm-button-text='好的'
                            cancel-button-text='不用了'
                            icon="el-icon-info"
                            icon-color="red"
                            title="确定删除该人员？"
                            @confirm="toDelete(scope.row.id)"
                            v-if="scope.row.role !== 0"
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
        <!-- 人员录入 -->
    <el-dialog :title="dialogStatus == 1 ?'人员录入' : '人员编辑'" :visible.sync="dialogFormVisible">
        <!-- 新增表单 -->
        <el-form :model="dynamicValidateForm"
            ref="dynamicValidateForm"
            label-width="100px"
            class="demo-dynamic"
            v-if="dialogStatus == 1">
            <el-form-item
                v-for="(item, index) in dynamicValidateForm.persons"
                :label="'人员(' + index + ')'"
                :key="item.key"
                :prop="'persons.' + index + '.value'"
                :rules="[
                {validator: checkInfo,trigger: 'blur'}
                ]"
            >
                <el-input v-model="item.value" style="width: 246px;margin-right: 20px;"></el-input><el-button @click.prevent="removeItem(item)">删除</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="addItem">新增人员</el-button>
                <span class="tips">Tips: 请按照“ 姓名-手机号（例：李华-13011111111）”的格式进行录入</span>
            </el-form-item>
        </el-form>
        <!-- 编辑表单 -->
        <el-form :model="editForm" ref="editForm" label-width="80px" v-else>
            <el-form-item label="姓名："
                prop="name"
                :rules="[
                {required: true,message:'请输入姓名',trigger: 'blur'}
                ]"
            >
                <el-input v-model="editForm.name" style="width: 246px"></el-input>
            </el-form-item>
            <el-form-item label="手机号："
                prop="mobile"
                :rules="[
                {required: true,message:'请输入手机号',trigger: 'blur'},
                {pattern:/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message:'手机号格式不正确！',trigger: 'blur'},
                ]"
            >
                <el-input v-model="editForm.mobile" style="width: 246px"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogStatus == 1 ? submitForm('dynamicValidateForm') : submitEdit('editForm')">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      dialogFormVisible: false, // 模态框
      dialogStatus: '1', // 1新增,2编辑
      dialogId: '',
      editForm: {
        name: '',
        mobile: ''
      },
      searchConfig: {
        text: ''
      },
      dynamicValidateForm: {
        persons: [{
          value: ''
        }]
      },
      loading: false,
      tableConfig: {
        total: 20,
        sizes: [5, 10, 20],
        size: 5,
        curPage: 1
      },
      tableData: []
    }
  },
  methods: {
    // 搜索
    searchByText () {
      this.tableConfig.curPage = 1
      this.init()
    },
    // 文字搜索框变更
    searchChange () {
      if (this.searchConfig.text === '') {
        this.tableConfig.curPage = 1
        this.init()
      }
    },
    // 人员信息校验
    checkInfo (rule, value, callback) {
      const mobileRep = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (!value) {
        return callback(new Error('请填写人员信息'))
      }
      if (/-/.test(value)) {
        const phone = value.split('-')[1]
        if (mobileRep.test(phone)) {
          callback()
        } else {
          callback(new Error('该人员手机号信息不正确！'))
        }
      } else {
        callback(new Error('信息格式不正确！'))
      }
    },
    //   新增-表单校验
    submitForm (formName) {
      const persons = []
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.dynamicValidateForm)
          this.dynamicValidateForm.persons.forEach(item => {
            const obj = {
              name: item.value.split('-')[0],
              phone: item.value.split('-')[1]
            }
            persons.push(obj)
          })
          const params = persons.distinctArrayObj('phone')
          console.log(params)
          this.$api.addPersons(params).then(res => {
            console.log(res)
            if (res.data.code === 0) {
              this.$notify({
                title: '成功',
                message: res.data.message,
                type: 'success'
              })
            } else {
              this.$notify({
                title: '失败',
                message: res.data.message,
                type: 'error'
              })
            }
            this.init()
          }).catch(err => {
            console.log(err)
          })
          this.dialogFormVisible = false
          this.dynamicValidateForm = {
            persons: [{
              value: ''
            }]
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑-校验
    submitEdit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.editForm.id,
            name: this.editForm.name,
            phone: this.editForm.mobile
          }
          this.$api.updatePerson(params).then(res => {
            if (res.data.code === 0) {
              this.$notify({
                title: '成功',
                message: res.data.message,
                type: 'success'
              })
              this.editForm = {
                name: '',
                mobile: ''
              }
              this.dialogFormVisible = false
              this.init()
            } else {
              console.log(res)
              this.init()
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //   新增/编辑
    toAdd (status, id) {
      this.dialogStatus = status
      if (id) {
        const params = {
          id
        }
        this.$api.getPersonInfo(params).then(res => {
          if (res.data.code === 0) {
            const obj = res.data.result
            this.editForm = {
              id: obj.id,
              name: obj.name,
              mobile: obj.phone
            }
          }
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      }
      this.dialogFormVisible = true
    },
    // 删除
    toDelete (id) {
      const params = {
        id
      }
      this.$api.deletePerson(params).then(res => {
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
    // 删除行
    removeItem (item) {
      var index = this.dynamicValidateForm.persons.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.persons.splice(index, 1)
      }
    },
    // 新增行
    addItem () {
      this.dynamicValidateForm.persons.push({
        value: '',
        key: Date.now()
      })
    },
    // 初始化列表
    init () {
      this.loading = true
      const params = {
        pageSize: this.tableConfig.size,
        pageNum: this.tableConfig.curPage,
        personParam: this.searchConfig.text ? this.searchConfig.text : undefined
      }
      this.$api.getPersonList(params).then(res => {
        if (res.data.total && res.data.total > 0) {
          this.tableConfig.total = res.data.total
          this.tableData = res.data.pageData
          this.loading = false
        } else {
          this.tableData = []
          console.log(res)
          this.loading = false
        }
        console.log(res)
      }).catch(err => {
        console.log(err)
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
#personList{
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
            display: flex;
            justify-content: space-between;
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
    .tips{
        font-family: PingFangSC-Medium, sans-serif;
        margin-left: 13px;
    }
}
</style>
