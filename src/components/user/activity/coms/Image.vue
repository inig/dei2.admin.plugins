<template>
  <div class="com_image_container" :tabindex="10"></div>
</template>
<style scoped>
  .com_image_container {

  }
</style>
<script>
  export default {
    name: 'Image',
    data () {
      return {
      }
    },
    computed: {
      currentPageIndex () {
        return this.$store.state.currentPageIndex
      },
      activityInfoChanged () {
        return this.$store.state.activityInfoChanged
      },
      activityInfo () {
        return this.$store.state.activityInfo
      }
    },
    components: {}
  }
</script>
