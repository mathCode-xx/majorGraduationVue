<template>
  <div class="add">
    <div class="add-top">
      <el-button @click="back">返回</el-button>
      <el-button @click="save">保存</el-button>
    </div>
    <div class="add-form">
      <el-form ref="form" :model="toSaveModule" label-width="80px">
        <el-form-item label="模块名">
          <el-input v-model="toSaveModule.name"></el-input>
        </el-form-item>
        <el-form-item label="上级模块">
          <el-select v-model="toSaveModule.upperModuleId" placeholder="请选择上级模块">
            <el-option label="顶级模块" value="0"></el-option>
            <el-option
              v-for="(item) in upperModules"
              :key="item.moduleId"
              :label="item.name"
              :value="item.moduleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="url">
          <el-input v-model="toSaveModule.url"></el-input>
        </el-form-item>
        <el-form-item label="模块编号">
          <el-input v-model="toSaveModule.code" type="number"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getModules, saveModule } from '@/api/module'
import { Message } from 'element-ui'

export default {
  name: 'SysPermissionAddView',
  data () {
    return {
      upperModules: [],
      toSaveModule: {
        name: '',
        upperModuleId: '',
        url: '',
        code: 0
      }
    }
  },
  created () {
    getModules({
      upperModuleId: 0
    }).then(response => {
      console.log(response.data)
      this.upperModules = response.data
    })
  },
  methods: {
    back () {
      this.$emit('setAddViewStatus', false)
    },
    save () {
      console.log(this.toSaveModule)
      saveModule(this.toSaveModule).then(() => {
        Message.success('操作成功')
        this.back()
        this.$store.dispatch('user/getModules').then().catch()
      }).catch(error => {
        Message.error(error)
      })
    }
  }
}
</script>

<style lang="less" scoped>

.add {
  width: 100%;
  height: 50px;
  margin-bottom: 10px;
  .add-top {
    padding: 10px;
  };
  .add-form {
    width: 50%;
  }
}

</style>
