<template>
  <div>
    <div v-for="(item) in modules" :key="item.id">
      <el-menu-item class="item" v-if="!item.children" :index="item.url">{{ item.name }}</el-menu-item>
      <el-submenu v-else :index="item.moduleId.toString()">
        <template slot="title">
          {{ item.name }}
        </template>
        <sub-menu :modules="item.children"/>
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
