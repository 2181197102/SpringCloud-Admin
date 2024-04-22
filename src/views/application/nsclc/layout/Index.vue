<template>
  <div class="app_index">
    <el-container class="app_index" justify="center">
      <el-aside style="width: 200px;">
        <Aside />
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Aside from '../Aside.vue'
export default {
  name: 'Index',
  components: {
    Aside
  }
}
</script>

<style scoped>
.app_index {
  width: 100%;
  height: 100%;
  min-height: 100%;
}
</style>
