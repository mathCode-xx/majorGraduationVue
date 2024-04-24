<template>
  <div class="person-info-main">
    <el-form ref="personForm" :model="personInfo" label-width="80px">
      <el-form-item label="用户姓名">
        <el-input :disabled="true" v-model="personInfo.userName"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input :disabled="!updating" v-model="personInfo.phoneNumber"></el-input>
      </el-form-item>
      <el-form-item label="身份证">
        <el-input :disabled="true" v-model="personInfo.idCard"></el-input>
      </el-form-item>
      <el-form-item label="微信号">
        <el-input :disabled="!updating" v-model="personInfo.wechatId"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input :disabled="!updating" v-model="personInfo.email"></el-input>
      </el-form-item>
    </el-form>
    <el-button
      v-show="!updating"
      style="margin-left: 20px"
      type="primary"
      icon="el-icon-edit"
      circle
      @click="changeToUpdate">
    </el-button>
    <el-button
      v-show="updating"
      style="margin-left: 20px"
      type="primary"
      icon="el-icon-check"
      @click="handleUpdateInfo"
      circle>
    </el-button>
  </div>
</template>

<script>
import { getCurrentInfo } from '@/api/user'

export default {
  name: 'PersonCenterView',
  created () {
    this.flushPersonInfo()
  },
  data () {
    return {
      personInfo: {
        userId: 0,
        userName: 'super man',
        phoneNumber: '18172984231',
        idCard: '1',
        email: '',
        wechatId: ''
      },
      updating: false
    }
  },
  methods: {
    flushPersonInfo () {
      getCurrentInfo().then(resp => {
        console.log(resp)
        this.personInfo = resp.data
      })
    },
    changeToUpdate () {
      this.updating = true
    },
    handleUpdateInfo () {
      console.log()
      this.updating = false
    }
  }
}
</script>

<style lang="less" scoped>

.person-info-main {
  display: flex;
  align-content: center;
  align-items: center;
  align-self: center;
}

</style>
