<template>
    <div class="plugin_container">
        <code>
          {{fileContent}}
        </code>
    </div>
</template>
<style scoped>
    .plugin_container {
        background-color: lightcyan;
        /*display: flex;*/
        /*align-items: center;*/
        /*justify-content: center;*/
        font-size: 14px;
      overflow: auto;
    }
</style>
<script>
  import * as types from '../store/mutation-types'
  export default {
    name: 'Plugins',
    data () {
      return {
        currentPlugin: '',
        currentFileName: '',
        fileContent: ''
      }
    },
    created () {
      this.currentPlugin = this.$route.params.pluginName
      this.currentFileName = this.$route.params.fileName
    },
    watch: {
      '$route': async function (value) {
        this.currentPlugin = value.params.pluginName
        this.currentFileName = value.params.fileName
        this.fileContent = await this.getFileContent({
          plugin: this.currentPlugin,
          filename: this.currentFileName
        })
      }
    },
    methods: {
      async getFileContent (args) {
        let fileContent = await this.$store.dispatch(types.VIEW_FILE, {
          plugin: args.plugin,
          filename: args.filename
        })
        return fileContent.data.content
      }
    },
    components: {}
  }
</script>
