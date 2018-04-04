<template>
  <div class="article_index_container">
    <Timeline pending>
      <TimelineItem>
        <Icon type="calendar" slot="dot" style="margin-top: 10px;"></Icon>
        <span class="title">2018年</span>
        <p class="content" v-for="(article, index) in articles" :key="article.uuid">
          <span class="post_time">{{article.postTime | timeFormat('M月D日 hh:mm:ss')}}</span>
          <!--<span class="post_time">{{article.postTime | timeFormat('M月D日 hh时mm分ss秒')}}</span>-->
          <span class="article_title" :data-uuid="article.uuid" @click="gotoArticleDetail">【{{article.title}}】</span>
        </p>
      </TimelineItem>
      <TimelineItem><a href="javascript:void(0)" @click="loadNextPage">查看更多</a></TimelineItem>
    </Timeline>
  </div>
</template>
<style scoped>
  .article_index_container {
    width: 100%;
    height: 100%;
    padding: 20px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .title {
    font-weight: bold;
    font-size: 18px;
  }
  .content {
    height: 30px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .post_time {
    margin-right: 10px;
  }
  .article_title {
    color: #2d8cf0;
    cursor: pointer;
  }
</style>
<script>
  import * as types from '../../../store/mutation-types'
  export default {
    name: 'ArticleIndex',
    data () {
      return {
        requestInfo: this.$store.state.requestInfo,
        articles: [],
        pageIndex: 1,
        pageSize: 20,
        totalCounts: 0
      }
    },
    async created () {
      await this.list(true)
    },
    methods: {
      async list (isInit) {
        if (isInit) {
          this.pageIndex = 1
        }
        let articleData = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.listArticle,
          data: {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
        })
        if (articleData.status === 200) {
          if (isInit) {
            this.articles = articleData.data.list
          } else {
            this.articles.push(articleData.data.list)
          }
          this.totalCounts = articleData.data.totalCounts
        }
      },
      loadNextPage () {
        if (this.pageIndex < this.totalCounts) {
          // 加载下一页
          this.pageIndex += 1
          this.list()
        }
      },
      gotoArticleDetail (e) {
        this.$router.push({
          path: `/article/${e.target.dataset.uuid}`
        })
      }
    },
    components: {}
  }
</script>
