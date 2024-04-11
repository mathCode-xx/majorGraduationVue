<template>
  <div>
    <div v-for="(item) in modules" :key="item.id">
      <el-menu-item v-if="item.end" :index="item.link">{{ item.name }}</el-menu-item>
      <el-submenu v-else :index="item.id.toString()">
        <template slot="title">
          {{ item.name }}
        </template>
        <sub-menu :modules="item.subModules"/>
      </el-submenu>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubMenu',
  props: {
    modules: Array
  },
  methods: {}
}
</script>

<style scoped>

</style>
