<template>
  <div class="addTop">
    <el-button @click="back">返回</el-button>
    <div>
      新增
    </div>
  </div>
</template>

<script>
export default {
  name: 'SysPermissionAddView',
  methods: {
    back () {
      this.$emit('setAddViewStatus', false)
    }
  }
}
</script>

<style lang="less" scoped>

.addTop {
  width: 100%;
  height: 50px;
  margin-bottom: 10px;
}

</style>
