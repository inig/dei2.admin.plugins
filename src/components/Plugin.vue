<template>
    <div class="plugin_container">
      <pre class="code_container" :ref="codeContainerRef"></pre>
    </div>
</template>
<style>
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
      /*height: 633px;*/
      height: 100%;
  }
    .CodeMirror {
        height: 100%!important;
    }
</style>
<script>
  import * as types from '../store/mutation-types'
  import utils from '../utils'
  export default {
    name: 'Plugins',
    data () {
      return {
        contentRouterViewLoader: this.$store.state.contentRouterViewLoader,
        codeContainerRef: 'code-container-ref',
        currentPlugin: '',
        currentFileName: '',
        fileContent: '',
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events,
        configs: {
          common: {
            theme: 'zenburn',
            lineNumbers: true,
            lineWrapping: true,
            styleActiveLine: true,
            foldGutter: true,
            matchBrackets: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            matchTags: {bothTags: true},
            keyMap: 'sublime'
          },
          myPlugin: {
            autoCloseTags: true,
            autoCloseBrackets: true,
            readOnly: false
          },
          otherPlugin: {
            readOnly: true
          },
          pluginVue: {
            mode: 'vue'
          },
          pluginJson: {
            mode: 'application/json'
          },
          pluginMd: {
            mode: 'markdown'
          }
        }
      }
    },
    computed: {
      loginInfo () {
        return utils.storage.getItem(this.$store.state.localStorageKeys.userInfo)
      },
      allPlugins () {
        return this.$store.state.allPlugins
      }
    },
    async created () {
      this.currentPlugin = this.$route.params.pluginName
      this.currentFileName = this.$route.params.fileName
      this.eventHub.$on(this.events.updatePluginFileContent, await this.updatePluginFileContent)
      await this.updatePluginFileContent({
        plugin: this.currentPlugin,
        filename: this.currentFileName
      })
    },
    watch: {
      '$route': async function (value) {
        this.currentPlugin = value.params.pluginName
        this.currentFileName = value.params.fileName
        await this.updatePluginFileContent({
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
        return fileContent
      },
      async updatePluginFileContent (args) {
        const that = this
//        that.eventHub.$off(that.events.updatePluginFileContent)
        try {
          let _fileData = await this.getFileContent({
            plugin: args.plugin,
            filename: args.filename
          })
          if (_fileData.data.plugin === args.plugin && _fileData.data.filename === args.filename) {
            this.fileContent = _fileData.data.content
          }
        } catch (err) {
          this.fileContent = ''
        }
        this.beautifyCode()
        setTimeout(() => {
          that.$store.state.loaders[that.contentRouterViewLoader].hide()
        }, 800)
      },
      findPluginInfoByName (pluginName) {
        let outPlugin = {}
        let allPlugins = this.allPlugins
        let i = 0
        for (i; i < allPlugins.length; i++) {
          if (allPlugins[i].name === pluginName) {
            outPlugin = allPlugins[i]
            i = allPlugins.length
          }
        }
        return outPlugin
      },
      beautifyCode () {
        const that = this
        let pluginInfo = this.findPluginInfoByName(this.currentPlugin)
        let isMyPlugin = (String(pluginInfo.author) === String(this.loginInfo.phonenum))
        let mode = ''
        let fileSuffix = this.currentFileName.replace(/^.+\.(.+)$/, '$1').toLowerCase()
        switch (fileSuffix) {
          case 'vue':
            mode = 'vue'
            break
          case 'json':
            mode = 'application/json'
            break
          case 'md':
            mode = 'markdown'
            break
          default:
            break
        }
        let configs = Object.assign({}, this.configs.common, (isMyPlugin ? this.configs.myPlugin : this.configs.otherPlugin), {
          mode: mode
        })
        let ele = this.$refs[this.codeContainerRef]
        ele.innerHTML = ''
        require([
          'codemirror/lib/codemirror',
          'codemirror/mode/vue/vue',
          'codemirror/mode/javascript/javascript',
          'codemirror/mode/markdown/markdown',
          'codemirror/addon/comment/comment',
          'codemirror/addon/fold/foldcode',
          'codemirror/addon/fold/foldgutter',
          'codemirror/addon/fold/markdown-fold',
          'codemirror/addon/fold/xml-fold',
          'codemirror/addon/fold/comment-fold',
          'codemirror/addon/fold/brace-fold',
          'codemirror/addon/edit/closebrackets',
          'codemirror/addon/edit/closetag',
          'codemirror/addon/edit/matchtags',
          'codemirror/keymap/sublime'
        ], function (CodeMirror) {
          CodeMirror(ele, Object.assign({
            value: that.fileContent
          }, configs))
        })
      }
    },
    components: {}
  }
</script>
