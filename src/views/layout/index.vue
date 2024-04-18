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
import HeaderComponent from '@/views/layout/components/Header.vue'
import NavBarComponent from '@/views/layout/components/NavBar.vue'
import MainComponent from '@/views/layout/components/Main.vue'

export default {
  name: 'LayoutView',
  components: {
    MainComponent,
    NavBarComponent,
    HeaderComponent
  }
}
</script>

<style lang="scss" scoped>

.layout {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
}

.layout-right {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  flex-basis: fill;
}

</style>
