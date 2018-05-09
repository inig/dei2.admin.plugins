<template>
  <div class="article_list_container">
    <article-header></article-header>
    <zpm-scroll class="article_item_body_wrapper" :ref="scroller.containerRef2"
                :data="articles"
                :options="scrollOptions"
                :pullDownRefresh="true"
                :pullUpLoad="true"
                @pullingDown="onPullingDown"
                @pullingUp="onPullingUp"
    >
      <Row class="article_item_body" :ref="scroller.containerRef" style="background-color: #FFF">
        <Col :xs="24" :sm="16" :md="16" :lg="16" :ref="scroller.targetRef">
        <!--<Scroll style="height: 100%;" :on-reach-bottom="loadNextPage">-->
        <Card style="background-color: transparent" :bordered="false" dis-hover v-for="(article, index) in articles" :key="article.uuid">
          <h3 class="article_item_title">
            <a :href="'/article/q/' + article.uuid.replace(/^([a-zA-Z0-9]*).*/, '$1')">{{article.title}}</a>
          </h3>
          <small class="article_item_sub_title">
            {{article.updateTime | timeFormat('YYYY年MM月DD日 hh时mm分ss秒')}}，{{article['zpm_user'].nickname}}
          </small>
          <div class="article_item_content markdown-body" v-md:100="article.content"></div>
          <a class="read_all" :href="'/article/q/' + article.uuid.replace(/^([a-zA-Z0-9]*).*/, '$1')" :title="article.title">
            <strong>阅读全文...</strong>
          </a>
        </Card>
        <!--<div class="bottom_loading_container">-->
          <!--<div class="loading_more_container" :class="{shown: scroller.disabled}" :style="{transform: 'scale(' + scroller.scale + ')'}">-->
            <!--<Spin>-->
              <!--<Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>-->
              <!--<div style="font-size: 12px;">加载中</div>-->
            <!--</Spin>-->
          <!--</div>-->
          <!--<div class="no_more_data" v-if="!scroller.disabled">-->
            <!--已经到底了-->
          <!--</div>-->
        <!--</div>-->
        <!--</Scroll>-->
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
  </div>
</template>
<style scoped lang="scss">
  .bottom_loading_container {
    position: relative;
    height: 42px;
  }
  .loading_more_container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    opacity: 0;
    -webkit-transition: opacity .3s ease-in-out;
    -moz-transition: opacity .3s ease-in-out;
    -ms-transition: opacity .3s ease-in-out;
    -o-transition: opacity .3s ease-in-out;
    transition: opacity .3s ease-in-out;
    /*-webkit-transition: all .3s ease-in-out;*/
    /*-moz-transition: all .3s ease-in-out;*/
    /*-ms-transition: all .3s ease-in-out;*/
    /*-o-transition: all .3s ease-in-out;*/
    /*transition: all .3s ease-in-out;*/
  }
  .loading_more_container.shown {
    opacity: 1;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
  .demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
  }
  .no_more_data {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 12px;
    color: #c5c5c5;
  }
  .article_list_container {
    width: 100%;
    height: 100%;
    font-size: medium;
    font-family: "Source Han Sans CN", 'PingFang SC', 'Myriad Pro', 'Hiragino Sans GB', SimHei;
  }
  .article_item_body_wrapper {
    width: 100%;
    height: calc(100% - 64px - 6px);
    overflow: hidden;
  }
  .article_item_body {
    /*width: 100%;*/
    /*height: calc(100% - 64px - 6px);*/
    /*overflow: hidden;*/
    /*margin-top: 6px;*/
  }
  .article_item_title {
    font-size: 24px;
    margin-top: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .article_item_title a {
    color: #34538b;
    text-decoration: none;
  }
  .article_item_sub_title {
    color: #777;
    font-family: Arial, Sans-Serif;
    font-size: 75%;
    line-height: 1.5;
  }
  .article_item_content {
    padding: 15px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .read_all {
    color: #34538b;
    text-decoration: none;
    font-size: 15px;
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
</style>
<script>
//  import IScroll from 'iscroll/build/iscroll-probe'
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
    name: 'ArticleList',
    data () {
      return {
        requestInfo: this.$store.state.requestInfo,
        articles: [],
        postYears: {},
        pageIndex: 1,
        pageSize: 1,
        totalCounts: 0,
        totalPages: 1,
        rightAds: LIST_RIGHT_ADS,
        scrollY: 0,
        scroller: {
          containerRef: 'scroller-container-ref',
          containerRef2: 'scroller-container-ref2',
          targetRef: 'scroller-target-ref',
          y: 0,
          maxScrollY: 0,
          height: 0,
          maxHeight: 0,
          disabled: false,
          scale: 0.1,
          target: null
        },
        scrollOptions: {
          pullUpLoad: {
            threshold: 0,
            txt: {
              more: '加载更多',
              noMore: '<p>这就到底了？</p><p>文章太少，我<a href="http://192.168.189.89">去写</a>一个</p><p>asf</p><p>as0000</p>'
            }
          }
        }
      }
    },
    async created () {
      initBD()
      await this.list({
        isInit: true
      })
      this.$nextTick(() => {
        setTimeout(() => {
//          this.initPageScroller()
        }, 500)
      })
    },
    methods: {
      onPullingDown () {
        setTimeout(async () => {
          await this.list({
            isInit: true
          })
        }, 800)
      },
      onPullingUp () {
        setTimeout(async () => {
          await this.loadNextPage()
        }, 800)
      },
      initPageScroller () {
//        const that = this
//        if (!this.scroller.target) {
//          this.scroller.target = new IScroll(this.$refs[this.scroller.containerRef2], {
//            mouseWheel: true,
//            click: true,
//            scrollbars: true,
//            fadeScrollbars: true,
//            probeType: 3
//          })
//        } else {
//          this.scroller.target.refresh()
//        }
//        this.scroller.target.on('scroll', async function () {
//          that.scroller.y = Math.abs(this.y)
//          that.scroller.maxScrollY = Math.abs(this.maxScrollY)
//          that.scroller.scale = 1 - parseFloat((that.scroller.maxScrollY - that.scroller.y) / 30)
//          if (that.scroller.disabled) {
//            return
//          }
//          if (that.scroller.maxScrollY <= that.scroller.y + 30) {
//            that.scroller.disabled = true
//            await that.loadNextPage()
//            that.scroller.disabled = false
//            that.scroller.target.refresh()
//          }
//        })
      },
      async list (args) {
        if (args && args.isInit) {
          this.pageIndex = 1
        }
        let _searchCondition = {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
        if (args && args.hasOwnProperty('author') && args.author.trim() !== '') {
          _searchCondition.author = args.author
        }
        let articleData = await this.$store.dispatch(types.AJAX2, {
          url: this.requestInfo.getAllArticle,
          data: _searchCondition
        })
        if (articleData.status === 200) {
          if (args && args.isInit) {
            this.articles = articleData.data.list
          } else {
            this.articles = this.articles.concat(articleData.data.list)
          }
          this.totalCounts = articleData.data.totalCounts
          this.totalPages = articleData.data.total
        }
      },
      async loadNextPage () {
        if (this.pageIndex < this.totalPages) {
          // 加载下一页
          this.pageIndex += 1
          await this.list({
            isInit: false
          })
        } else {
          this.$refs[this.scroller.containerRef2].forceUpdate()
        }
      }
    },
    components: {
      ArticleHeader: () => import('./Header.vue'),
      ZpmScroll: () => import('../../../coms/ZpmScroll/ZpmScroll.vue')
    }
  }
</script>
