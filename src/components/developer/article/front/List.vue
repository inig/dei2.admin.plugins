<template>
  <div class="article_list_container">
    <article-header></article-header>
    <Row>
      <Col :span="16">
        <Scroll :on-reach-bottom="loadNextPage">
          <Card :bordered="false" dis-hover v-for="(article, index) in articles" :key="article.uuid">
            <h3 class="article_item_title">
              <a :href="'/article/q/' + article.uuid">{{article.title}}</a>
            </h3>
            <small class="article_item_sub_title">
              2018年04月10日，张三
            </small>
          </Card>
        </Scroll>
      </Col>
      <Col :span="8">
      </Col>
    </Row>
  </div>
</template>
<style scoped>
  .article_list_container {
    width: 100%;
    height: 100%;
    font-size: medium;
    font-family: "Source Han Sans CN", 'PingFang SC', 'Myriad Pro', 'Hiragino Sans GB', SimHei;
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
</style>
<script>
  import * as types from '../../../../store/mutation-types'
  export default {
    name: 'ArticleList',
    data () {
      return {
        requestInfo: this.$store.state.requestInfo,
        articles: [],
        postYears: {},
        pageIndex: 1,
        pageSize: 2,
        totalCounts: 0,
        totalPages: 1
      }
    },
    async created () {
      await this.list({
        isInit: true
      })
    },
    methods: {
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
        }
      }
    },
    components: {
      ArticleHeader: () => import('./Header.vue')
    }
  }
</script>
