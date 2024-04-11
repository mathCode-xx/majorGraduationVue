<template>
  <div>
    <el-container>
      <el-aside style="height: 100vh; background-color: #545c64" class="">
        <el-menu
          router="true"
          :default-active="currentActive"
          background-color="#545c64"
          text-color="#fff"
          @select="handleMenuSelect"
          active-text-color="#ffd04b">
          <sub-menu :modules="modules"/>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <HeaderComponent/>
        </el-header>
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
import HeaderComponent from '@/layout/components/Header.vue'

export default {
  name: 'LayoutView',
  data () {
    return {
      currentActive: '' // 当前激活的菜单项
    }
  },
  created () {
    this.$store.dispatch('user/getModules')
      .then(() => {
      })
      .catch((e) => {
        console.log(e)
      })
    // 监听路由变化，更新当前激活的菜单项
    this.$router.afterEach((to, from) => {
      this.currentActive = to.path
    })
  },
  components: {
    SubMenu, HeaderComponent
  },
  computed: {
    ...mapState({
      modules: state => state.user.modules
    })
  },
  methods: {
    handleMenuSelect (index) {
      // 处理菜单项选择事件
      this.currentActive = index
    }
  }
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
