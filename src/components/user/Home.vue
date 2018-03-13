<template>
  <div class="user_container">
    <app-header></app-header>
    <app-content></app-content>
  </div>
</template>
<style>
  .user_container {
    width: 100%;
    height: 100%;
  }
</style>
<script>
  export default {
    name: 'UserHome',
    data () {
      return {}
    },
    components: {
      AppHeader: () => import('../AppHeader.vue'),
      AppContent: () => import('../AppContent.vue')
    }
  }
</script>
