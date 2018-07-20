<template>
  <div class="article_detail_container">
    <div class="article_detail_header">
      <div class="article_detail_header_back" @click="backToArticleIndex">
        <Icon type="ios-arrow-back" size="18"></Icon>
        <span class="article_detail_header_back_text">返回列表</span>
      </div>
      <p class="article_detail_header_title" contenteditable @input="changeArticleTitle" v-if="loginInfo.phonenum === articleDetail.author">{{articleDetail.title}}</p>
      <p class="article_detail_header_title" v-else>{{articleDetail.title}}</p>
      <div class="article_detail_right_menu_container" v-if="loginInfo.phonenum === articleDetail.author">
        <div class="article_detail_right_menu_item" @click="openPreview">
          <Tooltip content="预览" placement="bottom" class="icon_wrapper" :transfer="true">
            <Icon type="eye" size="18"></Icon>
          </Tooltip>
        </div>
      </div>
    </div>
    <pre class="code_preview" :ref="codeContainerRef" v-if="loginInfo.phonenum === articleDetail.author">
      {{articleDetail.content}}
    </pre>
    <!--<div class="article_toggle" @click="openPreview">-->
      <!--<Tooltip content="预览" placement="left" class="icon_wrapper">-->
        <!--<Icon type="eye" size="18"></Icon>-->
      <!--</Tooltip>-->
    <!--</div>-->
    <div class="article_viewer_container" :class="{shown: showPreview || (loginInfo.phonenum !== articleDetail.author)}">
      <div class="article_viewer_header">
        <div class="article_viewer_header_back" @click="closePreview">
          <Icon type="ios-arrow-back" size="18"></Icon>
          <span class="article_viewer_header_back_text">{{loginInfo.phonenum !== articleDetail.author ? '返回列表' : '返回编辑'}}</span>
        </div>
        <p class="article_viewer_header_title">{{cacheArticleDetail.title}}</p>
      </div>
      <div class="article_viewer_body markdown-body" v-html="markdownContent"></div>
    </div>
  </div>
</template>
<style scoped>
  .article_detail_container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 20px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    /*display: flex;*/
    /*align-items: flex-start;*/
    /*justify-content: space-between;*/
  }
  .article_detail_header {
    position: relative;
    /*left: 0;*/
    /*top: 0;*/
    width: 100%;
    height: 31px;
    background-color: #ffffff;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
    /*border-bottom: 1px solid rgba(0, 0, 0, 0.1);*/
  }
  .article_detail_header_title {
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
  .article_detail_header_back {
    position: absolute;
    left: 0;
    top: 0;
    height: 30px;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }
  .article_detail_header_back:active {
    opacity: 0.7;
  }
  .article_detail_header_back_text {
    margin-left: 8px;
  }
  .article_detail_right_menu_container {
    position: absolute;
    top: 0;
    right: 10px;
    height: 31px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
  }
  .article_detail_right_menu_item {
    height: 31px;
    cursor: pointer;
    margin-left: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .code_preview {
    text-shadow: none;
    height: calc(100% - 31px);
    overflow: hidden;
    /*overflow-y: auto;*/
  }
  /*.article_detail_container .CodeMirror-scroll {*/
    /*padding-right: 40px!important;*/
    /*!*width: calc(100% - 40px);*!*/
  /*}*/
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
        cacheArticleDetail: {},
        codeContainerRef: 'code-container-ref',
        editor: {},
        markdownContent: '',
        showPreview: false,
        platform: 'windows'
      }
    },
    computed: {
      loginInfo () {
        return this.$store.state.loginInfo
      },
      articleId () {
        return this.$route.params.articleId
      }
    },
    async created () {
      const that = this
      await this.getArticleContent()
      let isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel')
      isMac && (this.platform = 'mac')
      this.$nextTick(() => {
        window.onkeydown = function (ev) {
          if (that.$route.name === 'ArticleDetail') {
            if (that.platform === 'mac') {
              if (ev.metaKey && ev.shiftKey && ev.keyCode === 83) {
                // mac下 command + shift + s
                that.save()
              } else if (ev.metaKey && ev.keyCode === 83) {
                // mac下 command + s
                that.save()
                ev.preventDefault()
                return false
              } else if (ev.metaKey && ev.shiftKey && ev.keyCode === 80) {
                // 预览 command + shift + p
                that.togglePreview()
              } else if (ev.metaKey && ev.keyCode === 80) {
                // 预览 command + p
                that.togglePreview()
                ev.preventDefault()
                return false
              } else if (ev.metaKey && ev.shiftKey && ev.keyCode === 69) {
                // 编辑文章 command + shift + e
                that.togglePreview()
              } else if (ev.metaKey && ev.keyCode === 69) {
                // 编辑文章 command + e
                that.togglePreview()
                ev.preventDefault()
                return false
              }
            } else {
              if (ev.ctrlKey && ev.shiftKey && ev.keyCode === 83) {
                // windows下  control + shift + s 保存
                that.save()
              } else if (ev.ctrlKey && ev.keyCode === 83) {
                // windows下  control + shift + s 保存
                that.save()
                ev.preventDefault()
                return false
              } else if (ev.ctrlKey && ev.shiftKey && ev.keyCode === 38) {
                // 预览 command + shift + p
                that.togglePreview()
              } else if (ev.ctrlKey && ev.keyCode === 38) {
                // 预览 command + shift + p
                that.togglePreview()
                ev.preventDefault()
                return false
              } else if (ev.ctrlKey && ev.shiftKey && ev.keyCode === 40) {
                // 编辑文章 command + shift + e
                that.togglePreview()
              } else if (ev.ctrlKey && ev.keyCode === 40) {
                // 编辑文章 command + shift + e
                that.togglePreview()
                ev.preventDefault()
                return false
              }
            }
          }
        }
      })
    },
    watch: {
      '$route': async function (val) {
        if (this.$route.name === 'ArticleDetail') {
          await this.getArticleContent()
        }
      },
      'cacheArticleDetail.title': function (val) {
        document.title = val
      },
      'articleDetail': function (val) {
        if (val) {
          setTimeout(() => {
            this.beautifyCode()
          }, 1)
        }
      }
    },
    methods: {
      changeArticleTitle (e) {
        this.cacheArticleDetail.title = e.target.textContent
      },
      backToArticleIndex () {
        this.$router.back()
        this.showPreview = false
      },
      togglePreview () {
        if (this.showPreview) {
          this.closePreview()
        } else {
          this.openPreview()
        }
      },
      openPreview () {
        this.showPreview = true
      },
      closePreview () {
        if (this.loginInfo.phonenum !== this.articleDetail.author) {
          this.backToArticleIndex()
        } else {
          this.showPreview = false
        }
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
          this.cacheArticleDetail = JSON.parse(JSON.stringify(articleData.data))
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
        ele && (ele.innerHTML = '')
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
            value: that.articleDetail.content || ''
          }, configs))
          that.markdownContent = marked(that.articleDetail.content || '', {
            smartLists: true
          })
          that.editor.on('change', function (evt) {
            that.markdownContent = marked(evt.doc.getValue(), {
              smartLists: true
            })
          })
        })
      },
      async save () {
        let updateKeys = {
          uuid: this.articleId
        }
        if (this.cacheArticleDetail.title !== this.articleDetail.title) {
          updateKeys.title = this.cacheArticleDetail.title
        }
        if (this.editor.doc.getValue() !== this.articleDetail.content) {
          // 文章内容有变化
          updateKeys.content = this.editor.doc.getValue()
        }
        if (updateKeys.hasOwnProperty('title') || updateKeys.hasOwnProperty('content')) {
          let savedData = await this.$store.dispatch(types.AJAX, {
            url: this.requestInfo.saveArticle,
            data: updateKeys
          })
          if (savedData.status === 200) {
            this.$Message.success('保存成功')
          } else {
            this.$Message.error('文章保存失败，请稍后重试')
          }
        }
      }
    },
    components: {}
  }
</script>
