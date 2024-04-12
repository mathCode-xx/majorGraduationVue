<template>
  <div class="navbar">
    <!--    @open="handleOpen"-->
    <!--    @close="handleClose"-->
    <el-menu
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :unique-opened="true"
      :router="true"
      :default-active="$route.path"
    >
      <el-menu-item class="item" index="/home">首页</el-menu-item>
      <SubmenuComponent :modules="modules"></SubmenuComponent>
    </el-menu>
  </div>
</template>

<script>
import SubmenuComponent from '@/views/layout/components/Submenu.vue'
import { mapState } from 'vuex'

export default {
  name: 'NavBarComponent',
  components: { SubmenuComponent },
  props: {
    modules: Array
  },
  created () {
    this.$store.dispatch('user/getModules')
      .then(() => {
      })
      .catch((e) => {
        console.log(e)
      })
  },
  computed: {
    ...mapState({
      modules: state => state.user.modules
    })
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.navbar {
  background-color: #545c64;
  width: 220px;
  height: 100%;
  box-shadow: 5px 0 5px #ccc;
  position: relative;

  .el-menu {
    border: none;
  }
}
</style>
