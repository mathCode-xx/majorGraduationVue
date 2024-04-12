<template>
  <div class="layout">
    <NavBarComponent></NavBarComponent>
    <div class="layout-right">
      <HeaderComponent></HeaderComponent>
      <MainComponent></MainComponent>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import HeaderComponent from '@/views/layout/components/Header.vue'
import NavBarComponent from '@/views/layout/components/NavBar.vue'
import MainComponent from '@/views/layout/components/Main.vue'

export default {
  name: 'LayoutView',
  data () {
    return {
      // currentActive: '' // 当前激活的菜单项
    }
  },
  created () {
    // this.$store.dispatch('user/getModules')
    //   .then(() => {
    //   })
    //   .catch((e) => {
    //     console.log(e)
    //   })
    // // 监听路由变化，更新当前激活的菜单项
    // this.$router.afterEach((to, from) => {
    //   this.currentActive = to.path
    // })
  },
  components: {
    MainComponent,
    NavBarComponent,
    HeaderComponent
  },
  computed: {
    ...mapState({
      modules: state => state.user.modules
    })
  },
  methods: {
    // handleMenuSelect (index) {
    //   // 处理菜单项选择事件
    //   this.currentActive = index
    // }
  }
}
</script>

<style lang="scss" scoped>

.layout {
  display: flex;
  width: 100%;
  height: 100%;
}

.layout-right {
  flex: 1;
}

</style>
