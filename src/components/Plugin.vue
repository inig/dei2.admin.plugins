<template>
    <div class="plugin_container">
        单个插件 {{currentPlugin}}
    </div>
</template>
<style scoped>
    .plugin_container {
        background-color: lightcyan;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
    }
</style>
<script>
  export default {
    name: 'Plugins',
    data () {
      return {
        currentPlugin: ''
      }
    },
    created () {
      this.currentPlugin = this.$route.params.pluginName
    },
    watch: {
      '$route': function (value) {
        this.currentPlugin = value.params.pluginName
//        console.log('>>>>>', value)
      }
    },
    components: {}
  }
</script>
