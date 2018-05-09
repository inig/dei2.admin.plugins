<template>
  <div class="article_index_container">
    <Timeline pending>
      <TimelineItem v-for="(postYear, idx) in Object.keys(postYears).reverse()" :key="postYear">
        <Icon type="calendar" slot="dot" style="margin-top: 10px;"></Icon>
        <span class="title">{{postYear}}年</span>
        <div class="content" v-for="(article, index) in postYears[postYear]" :key="index">
          <div class="content_inner">
            <p class="article_title" :data-uuid="article.uuid" @click="gotoArticleDetail">-【{{article.title}}】</p>
            <p class="post_time">更新时间：{{article.updateTime | timeFormat('M月D日 hh:mm:ss')}}</p>
            <p class="post_time">作者：{{article['zpm_user'] && article['zpm_user'].nickname}}</p>
          </div>
        </div>
      </TimelineItem>
      <TimelineItem>
        <a href="javascript:void(0)" @click="loadNextPage" v-if="totalPages > pageIndex">查看更多</a>
        <span class="loaded_text" v-else>已经加载完毕</span>
      </TimelineItem>
    </Timeline>
    <div class="filter_container"></div>
    <div class="operation_container">
      <Tooltip content="新建文章" placement="left">
        <div class="operation_item" @click="showCreateNewArticleModal">
          <Icon type="plus-circled" size="40"></Icon>
        </div>
      </Tooltip>
    </div>

    <Modal
      v-model="newArticle.shown"
      title="新建文章"
      :loading="newArticle.loading"
      @on-ok="createNewArticle">
      <Input v-model="newArticle.title" placeholder="给文章起个标题先" style="width: 100%;"/>
    </Modal>
  </div>
</template>
<style scoped lang="scss">
  @import "../../../assets/css/theme";
  .article_index_container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 20px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .title {
    font-weight: bold;
    font-size: 18px;
  }
  .content {
    /*height: 30px;*/
    padding: 10px 0;
    font-size: 14px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .content_inner {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .post_time {
    /*margin-right: 10px;*/
    color: #888;
    font-size: 12px;
    margin-left: 15px;
    margin-top: 5px;
  }
  .article_title {
    color: #2d8cf0;
    cursor: pointer;
  }
  .loaded_text {
    color: #cccccc;
  }
  .filter_container {
    position: fixed;
    right: 20px;
    top: 80px;
    width: 100px;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.2);
  }

  .operation_container {
    position: fixed;
    right: 20px;
    bottom: 20px;
    /*min-width: 100px;*/
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .operation_item {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $theme;
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
        postYears: {},
        pageIndex: 1,
        pageSize: 2,
        totalCounts: 0,
        totalPages: 1,
        offsetCount: 0,
        newArticle: {
          shown: false,
          title: '',
          loading: false
        }
      }
    },
    computed: {
      loginInfo () {
        return this.$store.state.loginInfo
      }
    },
    async created () {
      await this.list({
        isInit: true,
        author: this.loginInfo.phonenum
      })
    },
    methods: {
      showCreateNewArticleModal () {
        this.newArticle.shown = true
      },
      async createNewArticle () {
        let createdData = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.createArticle,
          data: {
            title: this.newArticle.title
          }
        })
        if (createdData.status === 200) {
          let _d = new Date()
          _d.setTime(createdData.data.updateTime)
          let _year = _d.getFullYear()
          if (this.postYears.hasOwnProperty(_year)) {
            this.postYears[_year].unshift(createdData.data)
          }
          this.offsetCount += 1
          this.$Message.success('保存成功')
        } else {
          this.$Message.error('文章保存失败，请稍后重试')
        }
        this.newArticle.title = ''
      },
      formatPostYears (list) {
        let _postYears = JSON.parse(JSON.stringify(this.postYears))
        let i = 0
        let _d = new Date()
        for (i; i < list.length; i++) {
          _d.setTime(Number(list[i].updateTime))
          let _tempYear = _d.getFullYear()
          // if (_postYears.indexOf(_tempYear) < 0) {
          //   _postYears.push(_tempYear)
          // }
          if (_postYears.hasOwnProperty(_tempYear)) {
            _postYears[_tempYear].push(list[i])
          } else {
            _postYears[_tempYear] = [list[i]]
            let _obj = {}
            _obj[_tempYear] = [list[i]]
            Object.assign(_postYears, _obj)
          }
        }
        this.postYears = _postYears
      },
      async list (args) {
        if (args && args.isInit) {
          this.pageIndex = 1
        }
        let _searchCondition = {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          offsetCount: this.offsetCount
        }
        if (args && args.hasOwnProperty('author') && args.author.trim() !== '') {
          _searchCondition.author = args.author
        }
        let articleData = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.listArticle,
          data: _searchCondition
        })
        if (articleData.status === 200) {
          this.formatPostYears(articleData.data.list)
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
            isInit: false,
            author: this.loginInfo.phonenum
          })
        }
      },
      gotoArticleDetail (e) {
        this.$router.push({
          path: `/article/${e.target.dataset.uuid.replace(/^([a-zA-Z0-9]*).*/, '$1')}`
        })
      }
    },
    components: {}
  }
</script>
