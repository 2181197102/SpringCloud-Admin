<template>
  <div class="upload1">
    <el-container class="upload1" justify="center">
      <VideoUpload />
    </el-container>
  </div>

</template>

<script>
import VideoUpload from './components/upload-image.vue'

export default {
  name: 'Upload',
  components: {
    VideoUpload
  },
  data() {
    return {
      show: 0
    }
  },
  methods: {
    setShow(value) {
      this.show = value
    }
  }
}
</script>

<style>
.upload1 {
  min-height: 100%;
  width: 100%;
  height:100%;
}

</style>
