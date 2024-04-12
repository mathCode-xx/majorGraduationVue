<template>
  <div class="sys-permission">
    <div class="listTop">
      <el-button @click="toAddView">新增</el-button>
    </div>
    <div class="sys-permission-table">
      <el-table
        :data="modules"
        row-key="moduleId"
        border
        highlight-current-row
        @current-change="handleCurrentChange"
        :tree-props="{children: 'children'}">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="模块名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="code"
          label="编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="url"
          label="url">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SysPermissionListView',
  data () {
    return {
      currentRow: {}
    }
  },
  computed: {
    ...mapState({
      modules: state => state.user.modules
    })
  },
  methods: {
    handleCurrentChange (val) {
      console.log(val)
      this.currentRow = val
    },
    toAddView () {
      this.$emit('setAddViewStatus', true)
    }
  }
}
</script>

<style lang="less" scoped>

.sys-permission {
  width: 100%;
  height: 100%;
  background-color: rgba(239, 239, 239, 0.85);

  .sys-permission-table {
    width: 100%;
    height: 100%;
    padding-right: 20px;
  }
}

.listTop {
  width: 100%;
  height: 50px;
  margin-bottom: 10px;
}

</style>
