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
      <div v-if="!addViewShow" class="sys-user-bottom-table">
        data
        <el-pagination
          small
          class="sys-user-bottom-page"
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
export default {
  name: 'SysUserView',
  data () {
    return {
      addViewShow: false,
      user: [],
      pageSize: 10,
      pageNum: 1,
      sum: 20
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
  align-items: center;

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
    display: flex;
    align-items: flex-end;
    .sys-user-bottom-page {

    }
  }
}

</style>
