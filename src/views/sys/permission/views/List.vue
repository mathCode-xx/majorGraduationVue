<template>
  <div class="sys-permission-list">
    <div class="listTop">
      <el-button @click="toAddView">新增</el-button>
      <el-button @click="openRoleSelector">授权</el-button>
    </div>
    <div class="sys-permission-table">
      <el-table
        height="100%"
        ref="sysPermissionTable"
        :data="modules"
        row-key="moduleId"
        border
        min-height="0"
        highlight-current-row
        @select="handleSelectOneRow"
        @select-all="handleSelectAll"
        @selection-change="handleSelectionChange"
        :tree-props="{children: 'children'}">
        <el-table-column
          type="selection"
          width="55">
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
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope" v-if="!scope.row.children">
            <el-button @click="handleDeleteOne(scope.row.moduleId)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer
      title="系统角色"
      :visible.sync="drawer"
      size="30%">
      <div>
        <el-button @click="flushRoles">
          flush
        </el-button>
        <el-button @click="saveRolePermission">
          save
        </el-button>
      </div>
      <div class="roles-table">
        <el-table
          ref="multipleTable"
          :data="roles"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleRoleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="角色名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注">
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getAllRoles } from '@/api/sys'
import { saveRoleModule, deleteModule, getModules } from '@/api/module'
import { Message } from 'element-ui'
import { dealModules } from '@/utils/module'

export default {
  name: 'SysPermissionListView',
  data () {
    return {
      modules: [],
      drawer: false,
      roles: [
        {}
      ],
      currentSelectedPermissions: [],
      selectAll: false,
      currentSelectedRoles: []
    }
  },
  computed: {
    sumModuleCount () {
      let ans = 0
      this.modules.forEach(module => {
        ans++
        if (module.children) {
          ans += module.children.length
        }
      })
      return ans
    }
  },
  created () {
    this.flushAllModule()
  },
  methods: {
    _toggleRowSelection (module, selected) {
      this.$refs.sysPermissionTable.toggleRowSelection(module, selected)
      this.currentSelectedPermissions = this.currentSelectedPermissions.filter(permission => {
        return module.moduleId !== permission.moduleId
      })
      if (selected) {
        this.currentSelectedPermissions = [...this.currentSelectedPermissions, module]
      }
    },
    handleSelectionChange () {
    },
    handleSelectOneRow (selections, row) {
      let sign = false
      selections.forEach(selection => {
        if (selection.moduleId === row.moduleId) {
          sign = true
        }
      })
      this._toggleRowSelection(row, sign)
      if (row.children) {
        if (sign) {
          row.children.forEach(module => {
            this._toggleRowSelection(module, true)
          })
        } else {
          row.children.forEach(module => {
            this._toggleRowSelection(module, false)
          })
        }
      } else {
        let subSign = false
        let upperModule
        selections.forEach(selection => {
          if (selection.upperModuleId === row.upperModuleId) {
            subSign = true
          }
          if (selection.moduleId === row.upperModuleId) {
            upperModule = selection
          }
        })
        if (sign && !upperModule) {
          this.modules.forEach(module => {
            if (module.moduleId === row.upperModuleId) {
              upperModule = module
            }
          })
        }
        this._toggleRowSelection(upperModule, subSign)
      }
    },
    handleSelectAll () {
      const sign = this.currentSelectedPermissions.length !== this.sumModuleCount
      this.currentSelectedPermissions = sign ? this.modules : []
      this.modules.forEach(module => {
        this._toggleRowSelection(module, sign)
        if (module.children) {
          module.children.forEach(childrenModule => {
            this._toggleRowSelection(childrenModule, sign)
          })
        }
      })
    },
    toAddView () {
      this.$emit('setAddViewStatus', true)
    },
    openRoleSelector () {
      console.log(this.currentSelectedPermissions)
      if (!this.currentSelectedPermissions || this.currentSelectedPermissions.length === 0) {
        this.$confirm('请选择你要授权的模块', '提示', {
          confirmButtonText: '确定',
          type: 'info',
          showCancelButton: false
        }).then(() => {
        })
          .catch(() => {
          })
        return
      }
      this.drawer = true
      this.flushRoles()
    },
    flushRoles () {
      getAllRoles()
        .then(response => {
          const { data } = response
          console.log(data)
          this.roles = data
        })
        .catch()
    },
    saveRolePermission () {
      const roleIds = this.currentSelectedRoles.map(role => role.roleId)
      console.log(roleIds)
      const moduleIds = this.currentSelectedPermissions.map(module => module.moduleId)
      console.log(moduleIds)
      saveRoleModule({
        roleIds,
        moduleIds
      }).then(() => {
        Message.success('操作成功！')
        // 更新列表
        this.$store.dispatch('user/getModules').then().catch()
        this.drawer = false
      }).catch()
    },
    handleRoleSelectionChange (selections) {
      this.currentSelectedRoles = selections
    },
    handleDeleteOne (moduleId) {
      deleteModule(moduleId).then(() => {
        Message.success('操作成功！')
        this.flushAllModule()
        this.$store.dispatch('user/getModules').then().catch()
      })
    },
    flushAllModule () {
      getModules().then(response => {
        // console.log(response)
        this.modules = dealModules(response.data)
      })
    }
  }
}
</script>

<style lang="less" scoped>

.sys-permission-list {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: rgba(239, 239, 239, 0.85);

  .listTop {
    width: 100%;
    height: 50px;
    margin-bottom: 10px;
  }

  .sys-permission-table {
    width: calc(100vw - 250px);
    height: calc(100vh - 150px);
  }

  .roles-table {
    padding: 20px;
  }
}

</style>
