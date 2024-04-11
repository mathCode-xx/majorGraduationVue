<template>
  <div class="app-wrapper">
    <el-menu
      router="true"
      class="el-menu-vertical-demo"
      default-active="2"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <sub-menu :modules="modules"/>
    </el-menu>
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

.app-wrapper {
  height: 100%;
  width: 15%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
