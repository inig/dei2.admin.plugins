<template>
    <div class="developer_container">
        <app-header></app-header>
        <app-content></app-content>
    </div>
</template>
<style>
    .developer_container {
        width: 100%;
        height: 100%;
    }
</style>
<script>
  export default {
    name: 'DeveloperHome',
    data () {
      return {}
    },
    components: {
      AppHeader: () => import('../AppHeader.vue'),
      AppContent: () => import('../AppContent.vue')
    }
  }
</script>
