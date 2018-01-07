<template>
    <div class="plugin_container">
      <pre class="code_container" v-highlight="fileContent"><code>{{fileContent}}</code></pre>
    </div>
</template>
<style scoped>
    .plugin_container {
        /*background-color: lightcyan;*/
        /*display: flex;*/
        /*align-items: center;*/
        /*justify-content: center;*/
        font-size: 14px;
      box-sizing: border-box;
      overflow: auto;
    }
  .code_container {
    text-shadow: none;
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
    async created () {
      this.currentPlugin = this.$route.params.pluginName
      this.currentFileName = this.$route.params.fileName
      this.fileContent = await this.getFileContent({
        plugin: this.currentPlugin,
        filename: this.currentFileName
      })
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
      // ,
      // 'fileContent': function (value) {
      //   let _value = value.split('\n')
      //   let i = 0
      //   for (i; i < _value.length; i++) {
      //     let _tempValue = _value[i]
      //     _value[i] = `<p class="code">${_tempValue}</p>`
      //   }
      //   console.log('...................')
      //   return _value.join('')
      // }
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
