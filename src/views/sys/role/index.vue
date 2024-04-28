<template>
  <div class="sys-role">
    <div class="sys-role-header">
      <div>
        <el-button @click="changeAddViewShow">
          新增
        </el-button>
      </div>
    </div>
    <div class="sys-role-bottom">
      <div class="sys-role-bottom-table">
        <el-table
          height="100%"
          :data="roles"
          row-key="roleId"
          border
          highlight-current-row
          @selection-change="handleSelectionChange">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="角色名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="180">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status === 0 ? 'primary' : 'danger'"
                disable-transitions
              >
                {{ scope.row.status === 0 ? '有效' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <!-- 超级管理员不能删 -->
              <div v-if="scope.row.roleId !== 0">
                <el-button @click="handleDeleteOne(scope.row.roleId)" type="danger" size="mini">删除</el-button>
                <el-button
                  v-if="scope.row.status === 0"
                  @click="handleUpdateStatusOne(scope.row.roleId, 1)"
                  type="danger"
                  size="mini"
                >
                  禁用
                </el-button>
                <el-button
                  v-else
                  @click="handleUpdateStatusOne(scope.row.roleId, 0)"
                  type="primary"
                  size="mini"
                >
                  启用
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="addDialogVisible"
      width="30%">
      <div>
        <el-form
          :model="toSaveRole"
          :rules="roleAddRules"
          ref="addForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="toSaveRole.roleName" placeholder="请输入角色名"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="toSaveRole.remark" placeholder="请输入备注"></el-input>
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
import { getRoles, deleteRole, updateRole, saveRole, checkRoleName } from '@/api/role'
import { Message } from 'element-ui'

export default {
  name: 'SysRoleView',
  data () {
    const _checkRoleName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('角色名不能为空'))
      }
      setTimeout(() => {
        checkRoleName({
          roleName: value
        }).then((response) => {
          console.log(response)
          if (response.data && response.data === true) {
            callback(new Error('角色名已占用'))
          } else {
            callback()
          }
        }).catch(() => {
          callback(new Error('角色名已占用'))
        })
      }, 1000)
    }
    return {
      roles: [
        {
          roleId: 0,
          roleName: '',
          remark: '',
          status: 0
        }
      ],
      toSaveRole: {
        roleName: '',
        remark: ''
      },
      roleAddRules: {
        roleName: [
          {
            validator: _checkRoleName,
            trigger: 'blur'
          }
        ]
      },
      dialogTitle: '新增角色',
      addDialogVisible: false
    }
  },
  created () {
    this.flushData()
  },
  methods: {
    flushData () {
      getRoles().then((response) => {
        console.log(response.data)
        this.roles = response.data
      })
    },
    handleSelectionChange (selections) {
    },
    handleDeleteOne (roleId) {
      deleteRole({
        roleId: roleId
      }).then(() => {
        Message.success('操作成功！')
        this.flushData()
      }).catch(e => {
        Message.error(e)
      })
    },
    handleUpdateStatusOne (roleId, nextStatus) {
      updateRole({
        roleId,
        status: nextStatus
      }).then(() => {
        Message.success('操作成功！')
        this.flushData()
      }).catch(e => {
        Message.error(e)
      })
    },
    changeAddViewShow () {
      this.addDialogVisible = !this.addDialogVisible
    },
    handleSaveOrUpdateOrganization () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          saveRole(this.toSaveRole).then(() => {
            Message.success('操作成功！')
            this.flushData()
            this.changeAddViewShow()
            this.clearData()
          })
        } else {
          return false
        }
      })
    },
    clearData () {
      this.toSaveRole = {
        roleName: '',
        remark: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>

.sys-role {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .sys-role-header {
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .sys-role-bottom {
    width: 100%;
    height: 100%;
    padding-top: 10px;
    padding-right: 10px;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .sys-role-bottom-table {
      width: calc(100vw - 250px);
      height: calc(100vh - 150px);
      flex: 1 1 auto
    }
  }

  .sys-role-add-form {
    width: 50%;
  }
}

</style>
