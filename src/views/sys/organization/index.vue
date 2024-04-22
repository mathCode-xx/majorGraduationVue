<template>
  <div class="sys-organization-list">
    <div class="listTop">
      <div v-if="!searchComponentVisible">
        <el-button @click="openAddDialog">新增</el-button>
        <el-button @click="openSearchComponent" icon="el-icon-search" circle></el-button>
      </div>
      <el-form v-else :inline="true" :model="searchForm">
        <el-button style="margin-right: 15px" @click="closeSearchComponent">关闭搜索栏</el-button>
        <el-form-item label="机构名">
          <el-input v-model.trim="searchForm.name" clearable placeholder="请输入机构名"></el-input>
        </el-form-item>
        <el-form-item label="机构编码">
          <el-input v-model.trim="searchForm.code" clearable placeholder="请输入机构编码"></el-input>
        </el-form-item>
        <el-form-item label="管理员">
          <el-input v-model.trim="searchForm.managerName" clearable placeholder="请输入管理员名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="filterData" icon="el-icon-search" circle></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="sys-organization-table">
      <el-table
        height="100%"
        ref="sysOrganizationTable"
        :data="organizations"
        row-key="id"
        border
        v-loading="dataLoading"
        default-expand-all
        min-height="0"
        highlight-current-row
        :tree-props="{children: 'children'}">
        <!--        <el-table-column-->
        <!--          type="selection"-->
        <!--          width="55">-->
        <!--        </el-table-column>-->
        <el-table-column
          prop="name"
          label="机构名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="code"
          label="机构编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="manager.userName"
          label="管理员"
          width="180">
          <template slot-scope="scope">
            <el-button v-if="scope.row.manager" type="text">{{ scope.row.manager.userName }}</el-button>
            <el-button v-else type="text" disabled>暂未分配管理员账号</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="180">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleUpdateOne(scope.row)" type="text" size="small">修改</el-button>
            <el-button
              v-if="!scope.row.children"
              @click="handleDeleteOne(scope.row.id)"
              type="text"
              size="small"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="新增机构"
      :visible.sync="addDialogVisible"
      width="30%"
      :before-close="handleClose">
      <div>
        <el-form
          :model="addForm"
          :rules="addRules"
          ref="addForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="机构名称" prop="name">
            <el-input v-model.trim="addForm.name" placeholder="请输入机构名称"></el-input>
          </el-form-item>
          <el-form-item label="机构编码" prop="code">
            <el-input v-model.trim="addForm.code" :disabled="addFormDisable" placeholder="请输入机构编码"></el-input>
          </el-form-item>
          <el-form-item label="上级机构" prop="upper">
            <!--下拉框-->
            <el-select v-model="addForm.upperId" :disabled="addFormDisable" filterable clearable
                       placeholder="请选择上级机构">
              <el-option label="顶级机构" :value="0">
              </el-option>
              <el-option
                v-for="item in organizations"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="管理员" prop="manager">
            <!--下拉框-->
            <el-select
              v-model="addForm.managerId"
              filterable
              clearable
              :filter-method="getFilterUser"
              placeholder="请选择管理员">
              <el-option
                v-for="item in managers"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId">
                <span style="float: left">{{ item.userName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.phoneNumber }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model.trim="addForm.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">
          取 消
        </el-button>
        <el-button type="primary" @click="handleSaveOrUpdateOrganization">
          提 交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrganization, saveOrganization, deleteOrganization, updateOrganization } from '@/api/organization'
import { Message } from 'element-ui'
import { dealOrganizations } from '@/utils/organization'
import { getAllUsers } from '@/api/sys'

export default {
  name: 'OrganizationView',
  data () {
    return {
      organizations: [{
        id: 0,
        upperId: 1,
        name: '',
        code: '',
        managerId: 0,
        manager: {},
        remark: '',
        children: []
      }],
      addDialogVisible: false,
      addRules: {
        name: [
          {
            required: true,
            message: '请输入机构名称',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            managers: '请输入机构编码',
            trigger: 'blur'
          }
        ]
      },
      addForm: {
        name: '',
        code: '',
        managerId: '',
        upperId: '',
        remark: ''
      },
      managers: [],
      searchComponentVisible: false,
      searchForm: {
        name: '',
        code: '',
        managerName: ''
      },
      dataLoading: false,
      addFormDisable: false
    }
  },
  created () {
    this.flushData()
  },
  methods: {
    flushDataWithParams (params) {
      this.dataLoading = true
      getOrganization(params).then(response => {
        console.log(response.data)
        this.organizations = dealOrganizations(response.data)
        new Promise(resolve => {
          setTimeout(() => {
            resolve() // 在 1 毫秒后解决（完成） Promise
          }, 300) // 设置延迟时间为 1 毫秒
        }).then(() => {
          this.dataLoading = false
        })
      }).catch(e => {
        Message.error(e)
      })
    },
    flushData () {
      this.flushDataWithParams()
    },
    flushManagerData (params) {
      if (!params) {
        params = {}
      }
      params.current = 1
      params.size = 1024 * 1024
      getAllUsers(params).then(resp => {
        this.managers = resp.data.records
        console.log(this.managers)
      }).catch(e => {
        Message.error(e)
      })
    },
    handleClose (done) {
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      done()
      //   })
      //   .catch(_ => {
      //   })
    },
    openAddDialog () {
      this.addFormDisable = false
      this.addDialogVisible = true
      this.addForm = {}
      this.flushManagerData()
    },
    getFilterUser (userName) {
      // console.log(userName)
      this.flushManagerData({ userName })
    },
    handleSaveOrUpdateOrganization () {
      // console.log(this.addForm)
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (this.addForm.id) {
            // 如果表单中包括id，说明是修改表单
            updateOrganization(this.addForm).then(() => {
              Message.success('修改成功！')
            }).catch(() => {
            })
          } else if (this.addForm.managerId === '') {
            this.$confirm('未分配管理员，请之后及时分配管理员，否则机构将无法正常运行')
              .then(_ => {
                saveOrganization(this.addForm).then(() => {
                  Message.success('操作成功！')
                  this.addDialogVisible = false
                  this.flushData()
                  this.addForm = {}
                  return true
                }).catch(() => {
                  return false
                })
              })
              .catch(_ => {
              })
          } else {
            saveOrganization(this.addForm).then(() => {
              Message.success('操作成功！')
              this.addDialogVisible = false
              this.flushData()
              this.addForm = {}
              return true
            }).catch(() => {
              return false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleDeleteOne (organizationId) {
      this.$confirm('删除后将无法复原，确定删除吗？')
        .then(_ => {
          deleteOrganization({ organizationId }).then(() => {
            Message.success('删除成功！')
            this.flushData()
          }).catch(e => {
            Message.error(e)
          })
        })
        .catch(_ => {
        })
    },
    openSearchComponent () {
      this.searchComponentVisible = true
    },
    closeSearchComponent () {
      this.searchComponentVisible = false
      this.flushData()
    },
    filterData () {
      console.log()
      this.flushDataWithParams(this.searchForm)
    },
    handleUpdateOne (data) {
      console.log(data)
      this.openAddDialog()
      this.addForm = data
      if (!data.manager) {
        this.addForm.managerId = ''
      } else {
        this.addForm.managerId = data.manager.name
      }
      this.addFormDisable = true
    }
  }
}
</script>

<style lang="less" scoped>

.sys-organization-list {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: rgba(239, 239, 239, 0.85);

  .listTop {
    width: 100%;
    height: 50px;
    margin-bottom: 10px;
    display: flex;
    align-content: center;
    flex-wrap: wrap;

    form {
      margin-top: 23px;
    }
  }

  .sys-organization-table {
    width: calc(100vw - 250px);
    height: calc(100vh - 150px);
  }
}

</style>
