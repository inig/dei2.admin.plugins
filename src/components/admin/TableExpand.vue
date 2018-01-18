<template>
  <div class="expand_container">
    <p class="expand_item"
      @click="previewFile(item)"
      v-for="(item, index) in fileList"
      :key="index">
      {{item}}
    </p>
    <Modal class="preview_file_modal" v-model="isShow" :title="row.name + ' / ' + currentFileName" :styles="{top: '50px'}" width="80%">
      <div class="preview_file_container" :style="{height: fullHeight * 0.7 + 'px'}">
        <pre class="preview_file_code" :ref="codeContainerRef"></pre>
        <loading class="preview_file_loader" :data-ref="previewLoader"></loading>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<style scoped>
  .expand_container .ivu-modal-footer{
    display: none;
  }
  .expand_container {
    width: 100%;
  }
  .expand_item {
    padding: 10px 0;
    cursor: pointer;
  }
  .expand_item:hover {
    color: #2d8cf0;
  }
  .preview_file_container {
    box-sizing: border-box;
    width: 100%;
    position: relative;
  }
  .preview_file_code {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
  .preview_file_loader {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.8);
  }
</style>
<script>
  import * as types from '../../store/mutation-types'
  import Loading from '../Loading.vue'
  export default {
    props: {
      row: Object
    },
    data () {
      return {
        isShow: false,
        previewLoader: this.$store.state.previewLoader,
        codeContainerRef: 'code-container-ref',
        fileList: ['index.vue', 'package.json', 'README.md'],
        currentFileName: '',
        fileContent: '',
        configs: {
          theme: 'zenburn',
          lineNumbers: true,
          lineWrapping: true,
          styleActiveLine: true,
          foldGutter: true,
          matchBrackets: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          matchTags: {bothTags: true},
          keyMap: 'sublime',
          readOnly: true
        },
        fullHeight: 0,
        requestInfo: this.$store.state.requestInfo
      }
    },
    created () {
      this.fullHeight = document.documentElement.clientHeight
    },
    mounted () {
      window.addEventListener('resize', this.handleResize)
    },
    methods: {
      handleResize () {
        this.fullHeight = document.documentElement.clientHeight
      },
      async previewFile (fileName) {
        this.$store.state.loaders[this.previewLoader].show()
        this.isShow = true
        this.currentFileName = fileName
        try {
          let _fileData = await this.getFileContent({
            plugin: this.row.name,
            filename: fileName
          })
          if (_fileData.data.plugin === this.row.name && _fileData.data.filename === fileName) {
            this.fileContent = _fileData.data.content
          }
        } catch (err) {
          this.fileContent = ''
        }
        this.beautifyCode()
        setTimeout(() => {
          this.$store.state.loaders[this.previewLoader].hide()
        }, 800)
      },
      async getFileContent (args) {
        let fileContent = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.viewFile,
          data: {
            plugin: args.plugin,
            filename: args.filename
          }
        })
        return fileContent
      },
      beautifyCode () {
        const that = this
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
        let configs = Object.assign({}, this.configs, {
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
          that.editor = CodeMirror(ele, Object.assign({
            value: that.fileContent
          }, configs))
        })
      }
    },
    components: {
      Loading
    }
  }
</script>
