<template>
  <div class="crumb">
    <el-breadcrumb separator="/">
<!--      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
<!--      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>-->
<!--      <el-breadcrumb-item>活动列表</el-breadcrumb-item>-->
      <el-breadcrumb-item v-for="(item, index) in titles" :key="index">{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'CrumbComponent',
  data () {
    return {
      titles: []
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler (val, oldVal) {
        // console.log(this.$route.meta.titles)
        this.titles = this.$route.meta.titles
      }
    }
  }
}
</script>

<style scoped>

.crumb .el-breadcrumb {
  line-height: 50px;
  font-size: 15px;
}

</style>
