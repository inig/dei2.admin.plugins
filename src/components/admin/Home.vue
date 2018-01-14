<template>
  <div class="admin_container">
    <app-header></app-header>
    <app-content></app-content>
  </div>
</template>
<style>
  .admin_container {
    width: 100%;
    height: 100%;
  }
</style>
<script>
  export default {
    name: 'AdminHome',
    data () {
      return {}
    },
    components: {
      AppHeader: () => import('../AppHeader.vue'),
      AppContent: () => import('../AppContent.vue')
    }
  }
</script>
