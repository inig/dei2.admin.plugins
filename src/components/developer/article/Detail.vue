<template>
  <div class="article_detail_container">
    <pre class="code_preview" :ref="codeContainerRef">
      {{articleDetail.content}}
    </pre>
    <div class="article_toggle" @click="openPreview">
      <Tooltip content="预览" placement="left" class="icon_wrapper">
        <Icon type="eye" size="18"></Icon>
      </Tooltip>
    </div>
    <div class="article_viewer_container" :class="{shown: showPreview}">
      <div class="article_viewer_header">
        <div class="article_viewer_header_back" @click="closePreview">
          <Icon type="ios-arrow-back" size="18"></Icon>
          <span class="article_viewer_header_back_text">返回</span>
        </div>
        <p class="article_viewer_header_title">{{articleDetail.title}}</p>
      </div>
      <div class="article_viewer_body" v-html="markdownContent"></div>
    </div>
  </div>
</template>
<style>
  .article_detail_container {
    /*position: relative;*/
    width: 100%;
    height: 100%;
    padding: 20px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow-y: auto;
    /*display: flex;*/
    /*align-items: flex-start;*/
    /*justify-content: space-between;*/
  }
  .code_preview {
    text-shadow: none;
    height: 100%;
    overflow: hidden;
    /*overflow-y: auto;*/
  }
  .article_detail_container .CodeMirror-scroll {
    padding-right: 40px!important;
    /*width: calc(100% - 40px);*/
  }
  .article_toggle {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 40px;
    z-index: 98;
    height: calc(100% - 40px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: rgba(255, 255, 255, .2);
    color: #ffffff;
  }
  .icon_wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon_wrapper .ivu-tooltip-rel {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .article_viewer_container {
    position: absolute;
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    left: 20px;
    top: 20px;
    z-index: 99;
    opacity: 0;
    background-color: rgba(255, 255, 255, 1);
    -webkit-transform: translate(100%, 0);
    -moz-transform: translate(100%, 0);
    -ms-transform: translate(100%, 0);
    -o-transform: translate(100%, 0);
    transform: translate(100%, 0);
    -webkit-transition: all .3s ease-in-out;
    -moz-transition: all .3s ease-in-out;
    -ms-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
  }
  .article_viewer_container.shown {
    opacity: 1;
    -webkit-transform: translate(0, 0);
    -moz-transform: translate(0, 0);
    -ms-transform: translate(0, 0);
    -o-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  .article_viewer_header {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 31px;
    background-color: #ffffff;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
    /*border-bottom: 1px solid rgba(0, 0, 0, 0.1);*/
  }
  .article_viewer_header_title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
    -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  }
  .article_viewer_header_back {
    position: absolute;
    left: 0;
    top: 0;
    height: 30px;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }
  .article_viewer_header_back:active {
    opacity: 0.7;
  }
  .article_viewer_header_back_text {
    margin-left: 8px;
  }
  .article_viewer_body {
    position: absolute;
    left: 0;
    top: 31px;
    width: 100%;
    height: calc(100% - 31px);
    padding: 10px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow-y: auto;
  }
</style>
<script>
  import * as types from '../../../store/mutation-types'
  import marked from 'marked'
  export default {
    name: 'ArticleDetail',
    data () {
      return {
        requestInfo: this.$store.state.requestInfo,
        articleDetail: {},
        codeContainerRef: 'code-container-ref',
        editor: {},
        markdownContent: '',
        showPreview: false
      }
    },
    computed: {
      articleId () {
        return this.$route.params.articleId
      }
    },
    async created () {
      await this.getArticleContent()
    },
    methods: {
      toggleShowPreview () {
        this.showPreview = !this.showPreview
      },
      openPreview () {
        this.showPreview = true
      },
      closePreview () {
        this.showPreview = false
      },
      async getArticleContent () {
        let articleData = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.viewArticle,
          data: {
            uuid: this.articleId
          }
        })
        if (articleData.status === 200) {
          this.articleDetail = articleData.data
          this.beautifyCode()
        } else {
          this.$Message.error('文章数据获取失败，请刷新重试')
        }
      },
      beautifyCode () {
        const that = this
        let mode = 'markdown'
        let configs = Object.assign({}, {
          theme: 'zenburn',
          lineNumbers: true,
          lineWrapping: true,
          styleActiveLine: true,
          foldGutter: true,
          matchBrackets: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          matchTags: {bothTags: true},
          keyMap: 'sublime'
        }, {
          mode: mode
        })
        let ele = this.$refs[this.codeContainerRef]
        ele.innerHTML = ''
        require([
          'codemirror/lib/codemirror',
//          'codemirror/mode/vue/vue',
//          'codemirror/mode/javascript/javascript',
          'codemirror/mode/markdown/markdown',
//          'codemirror/addon/comment/comment',
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
            value: that.articleDetail.content
          }, configs))
          that.markdownContent = marked(that.articleDetail.content)
          that.editor.on('change', function (evt) {
            that.markdownContent = marked(evt.doc.getValue())
          })
        })
      }
    },
    components: {}
  }
</script>
