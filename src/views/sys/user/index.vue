<template>
  <div class="sys-user">
    <div class="sys-user-header">
      <div>
        <el-button @click="addViewShow = !addViewShow">新增</el-button>
      </div>
    </div>
    <div class="sys-user-bottom">
      <div class="sys-user-bottom-table" style="min-height:0;">
        <el-table
          height="100%"
          :data="users"
          row-key="userId"
          border
          min-height="0"
          highlight-current-row
          @selection-change="handleSelectionChange">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="用户名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="phoneNumber"
            label="手机号"
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
            prop="loginTime"
            label="最近登陆时间"
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <!-- 超级管理员不能删 -->
              <div v-if="scope.row.userId !== 0">
                <el-button @click="handleDeleteOne(scope.row.userId)" type="danger" size="mini">删除</el-button>
                <el-button
                  v-if="scope.row.status === 0"
                  @click="handleUpdateStatusOne(scope.row.userId, 1)"
                  type="danger"
                  size="mini"
                >
                  禁用
                </el-button>
                <el-button
                  v-else
                  @click="handleUpdateStatusOne(scope.row.userId, 0)"
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
      <div class="sys-user-bottom-page">
        <el-pagination
          small
          layout="sizes, prev, pager, next"
          :page-sizes="[20, 30, 40, 50]"
          :page-size="pageSize"
          :current-page="pageNum"
          @size-change="handlePageSizeChange"
          @current-change="handlePageNumChange"
          :total="sum">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="新增用户"
      :visible.sync="addViewShow"
      width="30%">
      <div>
        <el-form ref="userForm" :rules="userFormRules" :model="toSaveUser" label-width="80px">
          <el-form-item label="角色名" prop="userName">
            <el-input v-model="toSaveUser.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phoneNumber">
            <el-input v-model="toSaveUser.phoneNumber" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="toSaveUser.idCard" placeholder="请输入身份证号"></el-input>
          </el-form-item>
          <el-form-item label="个人邮箱" prop="email">
            <el-input v-model="toSaveUser.email" placeholder="请输入个人邮箱"></el-input>
          </el-form-item>
          <el-form-item label="个人微信" prop="wechatId">
            <el-input v-model="toSaveUser.wechatId" placeholder="请输入个人微信"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="toSaveUser.password" placeholder="请输入密码，默认‘110’"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="ensurePassword">
            <el-input type="password" v-model="toSaveUser.ensurePassword" placeholder="请再次输入密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addViewShow = false">
          取 消
        </el-button>
        <el-button type="primary" @click="handleSave">
          提 交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllUsers } from '@/api/sys'
import { checkIdCardExist, checkPhoneExist, deleteUser, saveUser, updateUserInfo } from '@/api/user'
import { Message, MessageBox } from 'element-ui'
import { validPhoneNumber, validIdCard } from '@/utils/validate'

export default {
  name: 'SysUserView',
  data () {
    const _checkPhoneNumber = (rule, value, callback) => {
      if (!validPhoneNumber(value)) {
        callback(new Error('手机号格式错误'))
        return
      }
      setTimeout(() => {
        checkPhoneExist(value).then((response) => {
          console.log(response)
          if (response.data && response.data === true) {
            callback(new Error('手机号已注册'))
          } else {
            callback()
          }
        }).catch(() => {
          callback(new Error('网络错误'))
        })
      }, 1000)
    }
    const _checkEnsurePassword = (rule, value, callback) => {
      if (value !== this.toSaveUser.password) {
        callback(new Error('确认密码与密码不同'))
      }
      callback()
    }
    const _checkIdCard = (rule, value, callback) => {
      if (!validIdCard(value)) {
        callback(new Error('身份证格式不正确'))
        return
      }
      setTimeout(() => {
        checkIdCardExist(value).then((response) => {
          console.log(response)
          if (response.data && response.data === true) {
            callback(new Error('该身份证已注册'))
          } else {
            callback()
          }
        }).catch(() => {
          callback(new Error('网络错误'))
        })
      }, 1000)
    }
    return {
      addViewShow: false,
      users: [
        {
          userId: 0,
          userName: '',
          phoneNumber: '',
          loginTime: '',
          status: 0
        }
      ],
      pageSize: 20,
      pageNum: 1,
      sum: 20,
      userFormRules: {
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        phoneNumber: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: _checkPhoneNumber,
            trigger: 'blur'
          }
        ],
        ensurePassword: [
          {
            validator: _checkEnsurePassword,
            trigger: 'blur'
          }
        ],
        idCard: [
          {
            required: true,
            message: '请输入身份证号',
            trigger: 'blur'
          },
          {
            validator: _checkIdCard,
            trigger: 'blur'
          }
        ]
      },
      toSaveUser: {
        userName: '',
        phoneNumber: '',
        password: '',
        ensurePassword: '',
        idCard: '',
        email: '',
        wechatId: ''
      }
    }
  },
  created () {
    this.flushData()
  },
  methods: {
    flushData () {
      console.log('current: ' + this.pageNum)
      console.log('pageSize: ' + this.pageSize)
      getAllUsers({
        current: this.pageNum,
        size: this.pageSize
      }).then(response => {
        // console.log(response.data)
        const data = response.data
        this.users = data.records
        this.pageSize = data.size
        this.pageNum = data.current
        this.sum = data.total
      })
    },
    clearData () {
      this.toSaveUser = {}
    },
    handleSelectionChange () {
      console.log('sys-user-handleSelectionChange')
    },
    handleUpdateStatusOne (userId, newStatus) {
      updateUserInfo({
        userId,
        status: newStatus
      }).then(() => {
        Message.success('操作成功！')
        this.flushData()
      }).catch(() => {
      })
    },
    handleDeleteOne (userId) {
      MessageBox.confirm('此操作将永久删除该该用户信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({
          userId
        }).then(() => {
          Message.success('操作成功！')
          this.flushData()
        })
      }).catch(() => {
      })
    },
    handleSave () {
      this.$refs.userForm.validate((valid) => {
        console.log(this)
        if (valid) {
          saveUser({
            userName: this.toSaveUser.userName,
            password: this.toSaveUser.password === '' ? '110' : this.toSaveUser.password,
            phoneNumber: this.toSaveUser.phoneNumber,
            idCard: this.toSaveUser.idCard,
            email: this.toSaveUser.email,
            wechatId: this.toSaveUser.wechatId
          }).then(() => {
            Message.success('操作成功！')
            // this.flushData()
            this.addViewShow = !this.addViewShow
            this.clearData()
            this.$forceUpdate()
            this.flushData()
          }).catch(() => {
          })
        } else {
          return false
        }
      })
    },
    handlePageSizeChange (val) {
      this.pageSize = val
      this.flushData()
    },
    handlePageNumChange (val) {
      this.pageNum = val
      this.flushData()
    }
  }
}
</script>

<style lang="less" scoped>

.sys-user {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .sys-user-header {
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    //justify-content: center;
  }

  .sys-user-bottom {
    width: calc(100vw - 250px);
    height: calc(100vh - 150px);
    padding-top: 10px;
    padding-right: 10px;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .sys-user-bottom-table {
      flex: 1 1 auto
    }

    .sys-user-bottom-page {
      flex: none
    }

    .sys-user-bottom-form {
      width: 50%;
    }
  }
}

</style>
