<template>
  <div class="head">
    header
    <el-button type="info" icon="el-icon-message" circle @click="handleLoginOut"></el-button>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui'
export default {
  name: 'HeaderComponent',
  methods: {
    handleLoginOut () {
      MessageBox.confirm('是否退出此账号', '', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'info'
      }).then(() => {
        this.$router.replace('/login')
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>

.head {
  width: 100%;
  height: 100%;
}

</style>
