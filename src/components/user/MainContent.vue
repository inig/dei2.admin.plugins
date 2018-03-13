<template>
    <div class="user_main_content_container">
        <router-view name="ContentRouter"></router-view>
    </div>
</template>
<style scoped>
    .user_main_content_container {
        width: 100%;
        height: 100%;
        /*padding: 20px;*/
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
