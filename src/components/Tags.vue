<template>
  <div class="tags">
    <el-tag
      class="tag"
      size="small"
      :closable="index > 0"
      v-for="(item, index) in tags"
      :key="index"
      :effect="item.title === $route.meta.titles[$route.meta.titles.length - 1] ? 'dark' : 'plain'"
      @click="goto(item.path)"
      @close="close(index)"
      :disable-transitions="true"
    >
      {{ item.title }}
    </el-tag>
  </div>
</template>

<script>
export default {
  name: 'TagsComponent',
  data () {
    return {
      tags: [
        {
          title: '首页',
          path: '/home'
        }
      ]
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler (val, oldVal) {
        if (!this.tags.find(item => {
          return val.path === item.path
        })) {
          this.tags.push(
            {
              title: val.meta.titles[val.meta.titles.length - 1],
              path: val.path
            }
          )
        }
      }
    }
  },
  methods: {
    goto (path) {
      this.$router.push(path)
    },
    close (index) {
      if (this.tags[index].path === this.$route.path) {
        this.tags.splice(index, 1)
        this.$router.push(this.tags[this.tags.length - 1].path)
      } else {
        this.tags.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="less" scoped>

.tags {
  padding-left: 20px;
  padding-top: 5px;

  .tag {
    cursor: pointer;
    margin-right: 5px;
  }
}

</style>
