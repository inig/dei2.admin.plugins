<template>
    <div class="admin_main_content_container">
        <router-view name="ContentRouter"></router-view>
    </div>
</template>
<style scoped>
    .admin_main_content_container {
        width: 100%;
        height: 100%;
        background-color: transparent;
    }
</style>
<script>
  export default {
    name: 'MainContent',
    data () {
      return {
      }
    },
    components: {}
  }
</script>
