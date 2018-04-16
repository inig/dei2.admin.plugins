<template>
  <div class="article_view_container">
    <article-header></article-header>
    <div class="article_item_body">
      <Row>
        <Col :xs="24" :sm="16" :md="16" :lg="16">
          <h3 class="article_item_title">
            <span>{{article.title}}</span>
          </h3>
          <small class="article_item_sub_title">
            {{article.updateTime | timeFormat('YYYY年MM月DD日 hh时mm分ss秒')}}，{{article['zpm_user'].nickname}}
          </small>
          <div class="copy_right_container">
            <p>by <span v-text="article['zpm_user'].nickname"></span> from {{location}}</p>
            <p>本文可全文转载，但需得到原作者许可，同时保留原作者和出处。</p>
          </div>
          <div class="article_content_container markdown-body" v-md="article.content"></div>
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
<style scoped>
 .article_view_container {
   width: 100%;
   height: 100%;
   font-size: medium;
   font-family: "Source Han Sans CN", 'PingFang SC', 'Myriad Pro', 'Hiragino Sans GB', SimHei;
 }
 .article_item_body {
   width: 100%;
   height: calc(100% - 64px - 6px);
   overflow: auto;
   margin-top: 6px;
   padding: 10px;
   -webkit-box-sizing: border-box;
   -moz-box-sizing: border-box;
   box-sizing: border-box;
 }
 .article_item_title {
   font-size: 24px;
   margin-top: 10px;
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
    font-size: 16px;
    padding: 8px;
    margin: 15px 0;
    font-family: 'Microsoft JhengHei';
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
  import * as types from '../../../../store/mutation-types'
  import { LIST_RIGHT_ADS } from '../../../../ads/index'
  export default {
    name: 'ArticleView',
    data () {
      return {
        article: {
          'zpm_user': {}
        },
        location: location.href,
        rightAds: LIST_RIGHT_ADS,
        requestInfo: this.$store.state.requestInfo
      }
    },
    async created () {
      console.log(this.$route)
      await this.getContent()
    },
    methods: {
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
    components: {
      ArticleHeader: () => import('./Header.vue')
    }
  }
</script>
