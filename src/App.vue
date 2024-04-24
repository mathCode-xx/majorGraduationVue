<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { startFlushTask } from '@/utils/token'

export default {
  name: 'App',
  created () {
    // 启动定时任务
    startFlushTask()
  },
  data () {
  },
  components: {}
}
</script>

<style lang="sass">
</style>
