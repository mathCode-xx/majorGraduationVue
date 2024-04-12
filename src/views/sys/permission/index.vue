<template>
  <div>
    <SysPermissionListView v-if="!openAddView" @setAddViewStatus="setAddViewStatus"></SysPermissionListView>
    <SysPermissionAddView v-else @setAddViewStatus="setAddViewStatus"></SysPermissionAddView>
  </div>
</template>

<script>
import SysPermissionListView from '@/views/sys/permission/views/List.vue'
import SysPermissionAddView from '@/views/sys/permission/views/Add.vue'

export default {
  name: 'PermissionView',
  data () {
    return {
      openAddView: false
    }
  },
  components: {
    SysPermissionAddView,
    SysPermissionListView
  },
  methods: {
    setAddViewStatus (open) {
      this.openAddView = open
    }
  }
}
</script>

<style lang="less" scoped>

</style>
