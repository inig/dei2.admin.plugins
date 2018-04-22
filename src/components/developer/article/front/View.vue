<template>
  <div class="article_view_container">
    <article-header></article-header>
    <zpm-scroll class="article_item_body" :ref="scrollerRef"
                :style="{height: (isPc ? 'calc(100% - 64px)' : 'calc(100% - 64px - 48px)')}"
                :data="article"
    >
      <Row style="padding-bottom: 20px;">
        <Col :xs="24" :sm="16" :md="16" :lg="16">
          <h3 class="article_item_title">
            <span>{{article.title}}</span>
          </h3>
          <small class="article_item_sub_title">
            {{article.updateTime | timeFormat('YYYY年MM月DD日 hh时mm分ss秒')}}，{{article['zpm_user'].nickname}}
          </small>
          <small class="article_item_sub_title" style="display: block;" v-if="article.totalViews && article.totalViews > 0">
            阅读 {{article.totalViews}} 次，今日 {{article.todayViews}} 次
          </small>
          <div class="copy_right_container">
            <p style="word-wrap: break-word;">by <span v-text="article['zpm_user'].nickname"></span> from {{location}}</p>
            <p>本文可全文转载，但需得到原作者许可，同时保留原作者和出处。</p>
          </div>
          <div class="article_content_container markdown-body" v-md="article.content"></div>
          <p style="font-weight: bold;">（全文完）</p>

          <div class="article_comments_container">
            <comment v-for="(comment, index) in comments" :key="comment.uuid" :root-comment="true" :comments="comments" :comment="comment"></comment>
          </div>
        </Col>
        <Col :xs="0" :sm="8" :md="8" :lg="8">
          <div class="article_item_right_container">
            <a class="article_right_ads_item" v-for="(ra, index) in rightAds" :key="index" :href="ra.redirect" target="_blank">
              <img :src="ra.img"/>
            </a>
          </div>
        </Col>
      </Row>
    </zpm-scroll>
    <div class="bottom_comment_placement" v-if="!commentShown">
      <div type="text" class="comment_input_placement" :data-rid="''" :data-pid="''" @click="showComment">写评论...</div>
      <div class="send_comment_btn">发布</div>
    </div>
    <div class="comment_wrapper" :class="{shown: commentShown}" @click="hideComment">
      <div class="bottom_comment_container">
        <Input type="textarea"
               :autosize="{minRows: 1, maxRows: 4}"
               :ref="commentRef"
               class="comment_input"
               v-model="comment"
               placeholder="写评论..."
               @on-blur="hideComment"
        />
        <div class="send_comment_btn" :class="{active: comment.trim().length > 0}" @click="sendComment">发布</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../../../../assets/css/md-custom";
 .article_view_container {
   width: 100%;
   height: 100%;
   font-size: medium;
   font-family: "Source Han Sans CN", 'PingFang SC', 'Myriad Pro', 'Hiragino Sans GB', SimHei;
 }
 .article_item_body {
   width: 100%;
   /*height: calc(100% - 64px - 6px);*/
   overflow: hidden;
   /*margin-top: 6px;*/
   padding: 10px;
   -webkit-box-sizing: border-box;
   -moz-box-sizing: border-box;
   box-sizing: border-box;
 }
 .article_item_title {
   font-size: 24px;
   margin-top: 10px;
   word-wrap: break-word;
 }
 .article_item_sub_title {
   color: #777;
   font-size: 75%;
   line-height: 1.5;
 }

  .copy_right_container {
    background: #f5f5f5;
    background-color: rgba(0,0,0,.05);
    border-left: 5px solid #ccc;
    font-size: 14px;
    padding: 8px;
    margin: 15px 0;
  }

 .article_item_right_container {
   width: 100%;
   height: 100%;
   /*overflow-y: auto;*/
   overflow-x: hidden;
   display: inline-flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
 }
 .article_right_ads_item {
   width: 90%;
   cursor: pointer;
 }
 .article_right_ads_item img {
   width: 100%;
   pointer-events: none;
   border: 1px solid rgba(153, 0, 204, 0.2);
   /*border: 1px solid rgba(249, 100, 100, 0.3);*/
 }

  .article_comments_container {
    margin-top: 20px;
  }

  .bottom_comment_placement {
    position: absolute;
    width: 100%;
    height: 48px;
    bottom: 0;
    left: 0;
    padding: 5px 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #ffffff;
    border-top: 1px solid #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .comment_input_placement {
    width: calc(100% - 50px);
    height: 30px;
    border: none;
    border-radius: 4px;
    padding-left: 8px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    background-color: #f5f5f5;
    color: #888;
    font-size: 14px;
  }

  .comment_wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    -webkit-transform: translate(0, 100%);
    -moz-transform: translate(0, 100%);
    -ms-transform: translate(0, 100%);
    -o-transform: translate(0, 100%);
    transform: translate(0, 100%);
    -webkit-transition: all .2s ease-in-out;
    -moz-transition: all .2s ease-in-out;
    -ms-transition: all .2s ease-in-out;
    -o-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
    transition-delay: 0.1s;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .comment_wrapper.shown {
    -webkit-transform: translate(0, 0%);
    -moz-transform: translate(0, 0%);
    -ms-transform: translate(0, 0%);
    -o-transform: translate(0, 0%);
    transform: translate(0, 0%);
  }
  .bottom_comment_container {
    position: absolute;
    width: 100%;
    min-height: 48px;
    bottom: 0;
    left: 0;
    padding: 5px 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #ffffff;
    border-top: 1px solid #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .comment_input {
    width: calc(100% - 50px);
    border: none;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    background-color: #f5f5f5;
  }
  .comment_input textarea {
    resize: none;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    border: none;
    background-color: #f5f5f5;
  }
  .send_comment_btn {
    position: absolute;
    right: 0;
    width: 60px;
    font-size: 14px;
    color: #888;
    padding: 5px 8px 10px 8px;
    height: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    display: inline-flex;
    align-items: flex-end;
    justify-content: center;
  }
  .send_comment_btn.active {
    color: #2d8cf0;
    font-weight: bold;
  }
</style>
<script>
//  import IScroll from 'iscroll'
//   import IScroll from 'iscroll/build/iscroll-probe'
  import * as types from '../../../../store/mutation-types'
  import { LIST_RIGHT_ADS } from '../../../../ads/index'
  const initBD = function () {
    var _hmt = window._hmt || []
    console.log(_hmt)
    var hm = document.createElement('script')
    hm.src = 'https://hm.baidu.com/hm.js?c5c0c81d50ece8fafa68984d8d4699f7'
    var s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(hm, s)
  }
  export default {
    name: 'ArticleView',
    data () {
      return {
        article: {
          'zpm_user': {}
        },
        location: location.href,
        rightAds: LIST_RIGHT_ADS,
        scrollerRef: 'scroller-ref',
        scroller: null,
        isPc: !navigator.userAgent.match(/(iphone)|(android)/i),
        requestInfo: this.$store.state.requestInfo,
        comment: '',
        commentRef: 'comment-ref',
        commentShown: false,
        currentComment: {
          pid: '',
          rid: ''
        },
        pageIndex: 1,
        pageSize: 30,
        totalCounts: 0,
        totalPages: 1,
        comments: [] // 该文章的所有评论
      }
    },
    async created () {
      const that = this
      initBD()
      await this.getContent()
      this.$nextTick(() => {
        setTimeout(() => {
          this.setTitle()
          // this.initPageScroller()
        }, 500)
      })
      window.onresize = function () {
        that.isPc = !navigator.userAgent.match(/(iphone)|(android)/i)
      }
    },
    computed: {
      loginInfo () {
        return this.$store.state.loginInfo
      }
    },
    methods: {
      showComment (e) {
        this.currentComment = {
          pid: e.target.dataset.pid || '',
          rid: e.target.dataset.rid || ''
        }
        this.$refs[this.commentRef].focus()
        this.commentShown = true
      },
      hideComment () {
        this.$refs[this.commentRef].blur()
        this.commentShown = false
      },
      initPageScroller () {
        // if (!this.scroller) {
        //   this.scroller = new IScroll(this.$refs[this.scrollerRef], {
        //     mouseWheel: true,
        //     click: true,
        //     scrollbars: true,
        //     fadeScrollbars: true,
        //     probeType: 3
        //   })
        // } else {
        //   this.scroller.refresh()
        // }
      },
      setTitle () {
        if (this.article.title) {
          document.title = this.article.title
        }
      },
      async getContent () {
        let articleId = this.$route.params.articleId
        let articleData = await this.$store.dispatch(types.AJAX2, {
          url: this.requestInfo.viewArticle,
          data: {
            uuid: articleId
          }
        })
        if (articleData.status === 200) {
          this.article = articleData.data
          this.listComments({
            isInit: true
          })
        }
      },
      async listComments (args) {
        if (args && args.isInit) {
          this.pageIndex = 1
        }
        let _searchCondition = {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
        let commentsData = await this.$store.dispatch(types.AJAX2, {
          url: this.requestInfo.getAllComments,
          data: _searchCondition
        })
        if (commentsData.status === 200) {
          if (args && args.isInit) {
            this.comments = commentsData.data.list
          } else {
            this.comments = this.comments.concat(commentsData.data.list)
          }
          this.totalCounts = commentsData.data.totalCounts
          this.totalPages = commentsData.data.total
        }
      },
      async sendComment (e) {
        let articleId = this.article.uuid
        let _commentObj = Object.assign({
          aid: articleId,
          content: this.comment,
          nickname: this.loginInfo.nickname || '',
          headIcon: this.loginInfo.headIcon || ''
        }, this.currentComment)
        let commentData = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.sendComment,
          data: _commentObj
        })
        if (commentData.status === 200) {
          this.$Message.success('评论成功')
          this.comment = ''
          this.currentComment = {
            pid: '',
            rid: ''
          }
          this.comments.unshift(Object.assign({}, _commentObj, {
            phonenum: this.loginInfo.phonenum,
            postTime: +new Date()
          }))
        }
      }
    },
    watch: {
      '$route': function (val) {
        this.setTitle()
      }
    },
    components: {
      ArticleHeader: () => import('./Header.vue'),
      Comment: () => import('./Comment.vue'),
      ZpmScroll: () => import('../../../coms/ZpmScroll/ZpmScroll.vue')
    }
  }
</script>
