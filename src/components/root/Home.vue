<template>
  <div class="root_container">
    <app-header></app-header>
    <app-content></app-content>
  </div>
</template>
<style>
  .root_container {
    width: 100%;
    height: 100%;
  }
</style>
<script>
  export default {
    name: 'RootHome',
    data () {
      return {}
    },
    components: {
      AppHeader: () => import('../AppHeader.vue'),
      AppContent: () => import('../AppContent.vue')
    }
  }
</script>
