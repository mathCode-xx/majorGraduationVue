<template>
  <div>
    <div v-for="(item) in modules" :key="item.id">
      <el-menu-item
        class="item"
        v-if="!item.children || item.children.length === 0"
        :index="item.url"
      >
        {{ item.name }}
      </el-menu-item>
      <el-submenu v-else :index="item.moduleId.toString()">
        <template slot="title">
          {{ item.name }}
        </template>
        <SubmenuComponent :modules="item.children"/>
      </el-submenu>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubmenuComponent',
  props: {
    modules: Array
  },
  created () {
  },
  methods: {
    test (modules) {
      console.log(modules)
    }
  }
}
</script>

<style scoped>

</style>
