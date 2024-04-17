<template>
  <div class="layout-main">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'MainComponent'
}
</script>

<style scoped>

.layout-main {
  margin-top: 10px;
  padding-left: 20px;
  background-color: rgba(239, 239, 239, 0.85);
  width: 100%;
  flex: 1;
  display: flex;
}

</style>
