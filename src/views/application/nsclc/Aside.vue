<template>
  <div id="aside" style="height: 100%; width:170px">
    <el-menu
      background-color="#545c64"
      text-color="#ffffff"
      active-text-color="#ffd04b"
      class="el-menu-vertical-demo"
      router
    >
      <el-menu-item index="/nsclc/upload"><i class="el-icon-location" />疗效评估</el-menu-item>
      <el-menu-item index="/nsclc/search"><i class="el-icon-document" />评估历史查询</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Aside'
}
</script>

<style scoped>
  .el-menu-vertical-demo{
      height: 100%;
  }
  #aside {
    height: 100%;
  }
</style>
