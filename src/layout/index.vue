<template>
  <div>
    <el-container>
      <el-aside style="height: 100vh; background-color: #545c64" class="">
        <el-menu
          router="true"
          default-active="2"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <sub-menu :modules="modules"/>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main style="flex: fit-content; background-color: #3b91b6">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SubMenu from '@/layout/components/SubMenu.vue'

export default {
  name: 'LayoutView',
  data () {
    return {}
  },
  created () {
    this.$store.dispatch('user/getModules')
      .then(() => {
        console.log()
      })
      .catch((e) => {
        console.log(e)
      })
  },
  components: {
    SubMenu
  },
  computed: {
    ...mapState({
      modules: state => state.user.modules
    })
  },
  methods: {}
}
</script>

<style lang="scss" scoped>

.el-container {
  display: flex;
}

.el-main {
  display: flex;
}

body > .el-container {
  margin-bottom: 0px;
}

.el-container,
.el-aside,
.el-menu,
.el-menu-item,
.el-submenu {
  border: none !important;
}
</style>
