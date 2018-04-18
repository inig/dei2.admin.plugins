<template>
  <div class="article_view_container">
    <article-header></article-header>
    <div class="article_item_body" :ref="scrollerRef">
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
            <comment v-for="(comment, index) in article['zpm_comments']" :key="comment.uuid" :comment="comment"></comment>
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
   height: calc(100% - 64px - 6px);
   overflow: hidden;
   margin-top: 6px;
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
</style>
<script>
//  import IScroll from 'iscroll'
  import IScroll from 'iscroll/build/iscroll-probe'
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
        requestInfo: this.$store.state.requestInfo
      }
    },
    async created () {
      initBD()
      await this.getContent()
      this.$nextTick(() => {
        setTimeout(() => {
          this.setTitle()
          this.initPageScroller()
        }, 500)
      })
    },
    methods: {
      initPageScroller () {
        if (!this.scroller) {
          this.scroller = new IScroll(this.$refs[this.scrollerRef], {
            mouseWheel: true,
            click: true,
            scrollbars: true,
            fadeScrollbars: true,
            probeType: 3
          })
        } else {
          this.scroller.refresh()
        }
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
      Comment: () => import('./Comment.vue')
    }
  }
</script>
