<template>
  <div class="sys-user">
    <div class="sys-user-header">
      <div v-if="!addViewShow">
        <el-button @click="addViewShow = !addViewShow">新增</el-button>
      </div>
      <div v-else>
        <el-button @click="addViewShow = !addViewShow">返回</el-button>
      </div>
    </div>
    <div class="sys-user-bottom">
      <div v-if="!addViewShow" class="sys-user-bottom-table" style="min-height:0;">
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
      <div v-if="!addViewShow" class="sys-user-bottom-page">
        <el-pagination
          small
          layout="prev, pager, next"
          :hide-on-single-page="(sum / pageSize) <= 1"
          :total="sum">
        </el-pagination>
      </div>
      <div v-else class="sys-user-bottom-form">
        form
      </div>
    </div>
  </div>
</template>

<script>
import { getAllUsers } from '@/api/sys'
import { deleteUser, updateUserInfo } from '@/api/user'
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'SysUserView',
  data () {
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
      pageSize: 100,
      pageNum: 1,
      sum: 20
    }
  },
  created () {
    this.flushData()
  },
  methods: {
    flushData () {
      getAllUsers({
        current: this.pageNum,
        size: this.pageSize
      }).then(response => {
        console.log(response.data)
        this.users = response.data.records
      })
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
      }).catch(() => {})
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
      }).catch(() => {})
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
    width: 100%;
    flex: 1;
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
  }
}

</style>
