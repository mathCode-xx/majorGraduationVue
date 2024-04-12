<template>
  <div class="header">
    <div class="header-top">
      <div class="fl">
        <el-button v-show="isShow" icon="el-icon-s-fold" @click="isShow = !isShow"></el-button>
        <el-button v-show="!isShow" icon="el-icon-s-unfold" @click="isShow = !isShow"></el-button>
      </div>
      <div class="fl">
        <CrumbComponent></CrumbComponent>
      </div>
    </div>
    <div class="header-bottom">
      <TagsComponent></TagsComponent>
    </div>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui'
import CrumbComponent from '@/components/Crumb.vue'
import TagsComponent from '@/components/Tags.vue'

export default {
  name: 'HeaderComponent',
  components: { TagsComponent, CrumbComponent },
  data () {
    return {
      isShow: true
    }
  },
  methods: {
    handleLoginOut () {
      MessageBox.confirm('是否退出此账号', '', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'info'
      }).then(() => {
        this.$router.replace('/login')
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="less" scoped>

.header {
  box-shadow: 0 5px 5px #ddd;
  height: 80px;
  .header-top {
    height: 50px;
    box-shadow: 0 4px 4px rgba(236, 235, 235, 0.84);
  }
  .fl {
    float: left;
  }
}

.header button {
  width: 50px;
  height: 50px;
  margin: 0;
  font-size: 20px;
  padding: 12px 10px;
  border: none;
}

</style>
