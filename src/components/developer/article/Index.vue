<template>
  <div class="article_index_container">
    <Timeline pending>
      <TimelineItem v-for="(postYear, idx) in Object.keys(postYears).reverse()" :key="postYear">
        <Icon type="calendar" slot="dot" style="margin-top: 10px;"></Icon>
        <span class="title">{{postYear}}年</span>
        <div class="content" v-for="(article, index) in postYears[postYear]" :key="index">
          <div class="content_inner">
            <p class="article_title" :data-uuid="article.uuid.replace(/^([a-zA-Z0-9]*).*/, '$1')" @click="gotoArticleDetail">-【{{article.title}}】</p>
            <!--<p class="post_time">{{article.tag}}</p>-->
            <div class="member_level_tag">
              <p class="member_level_tag_item" v-for="(t, i) in filterTags(article.tag).split(';')" :key="i" v-text="t"></p>
              <Tooltip content="修改标签" placement="right">
                <div class="modify_tag_icon" :data-post-year="postYear" :data-index="index" :data-album="article.album" :data-title="article.title" :data-tags="article.tag" :data-uuid="article.uuid.replace(/^([a-zA-Z0-9]*).*/, '$1')" @click="showModifyTagModal">
                  <Icon type="ios-cog" size="24" style="pointer-events: none;" />
                </div>
              </Tooltip>
            </div>
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
      <Form :model="newArticle" :label-width="40">
        <FormItem label="封面">
          <div class="upload_item">
            <upload-image width="200" height="134" @before-upload="beforeUpload" @progress="uploadImageProgress" @success="setArticleAlbum" @fail="uploadFailed">
              <img class="article_album" style="opacity: 1!important;" :src="newArticle.album || assets.articleAlbum" alt="封面">
            </upload-image>
            <div class="progress_item" v-if="uploadProgress.shown">
              <i-circle :percent="uploadProgress.percent">
                <span class="demo-Circle-inner" style="font-size:24px">{{uploadProgress.percent}}%</span>
              </i-circle>
            </div>
          </div>
        </FormItem>
        <FormItem label="标题">
          <Input v-model="newArticle.title" placeholder="给文章起个标题先" style="width: 100%;"/>
        </FormItem>
        <FormItem label="标签">
          <Select v-model="newArticle.tag" filterable multiple>
            <OptionGroup v-for="(g, index) in allTagsForAdd" :key="g.value" :label="g.text">
              <Option v-for="(t, idx) in g.children" :key="t.value" :value="t.value" :label="t.text">
                <span v-text="t.text" :title="t.message"></span>
                <span style="float: right; color: #cccccc;" v-text="t.message"></span>
              </Option>
            </OptionGroup>
          </Select>
        </FormItem>
      </Form>
    </Modal>

    <Modal
      v-model="modifyTag.shown"
      title="修改文章标签"
      :loading="modifyTag.loading"
      @on-ok="confirmModifyTag">
      <Form :model="modifyTag" :label-width="40">
        <FormItem label="封面">
          <div class="upload_item">
            <upload-image width="200" height="134" @before-upload="beforeUpload" @progress="uploadImageProgress" @success="setArticleAlbum2" @fail="uploadFailed">
              <img class="article_album" style="opacity: 1!important;" :src="modifyTag.album || assets.articleAlbum" alt="封面">
            </upload-image>
            <div class="progress_item" v-if="uploadProgress.shown">
              <i-circle :percent="uploadProgress.percent">
                <span class="demo-Circle-inner" style="font-size:24px">{{uploadProgress.percent}}%</span>
              </i-circle>
            </div>
          </div>
        </FormItem>
        <FormItem label="标题">
          <input v-model="modifyTag.title" disabled class="ban_input"/>
        </FormItem>
        <FormItem label="标签">
          <Select v-model="modifyTag.tag" filterable multiple>
            <OptionGroup v-for="(g, index) in allTagsForAdd" :key="g.value" :label="g.text">
              <Option v-for="(t, idx) in g.children" :key="t.value" :value="t.value" :label="t.text">
                <span v-text="t.text" :title="t.message"></span>
                <span style="float: right; color: #cccccc;" v-text="t.message"></span>
              </Option>
            </OptionGroup>
          </Select>
        </FormItem>
      </Form>
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
  .member_level_tag {
    height: 22px;
    line-height: 22px;
    margin: 5px 0 5px 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  .member_level_tag_item {
    margin: 0 4px 0 0;
    padding: 0 8px;
    border: none;
    border-radius: 3px;
    font-size: 12px;
    background-color: seagreen;
    color: #ffffff;
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

  .ban_input {
    display: inline-block;
    width: 100%;
    height: 32px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border-radius: 4px;
    color: #495060;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out;
    border: none;
    background-color: transparent;
  }
  .modify_tag_icon {
    cursor: pointer;
    margin-left: 5px;
  }

  .article_album {
    max-width: 200px;
    max-height: 134px;
  }

  .upload_item {
    width: 200px;
    height: 134px;
    background-color: #f0f0f0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .upload_item .progress_item {
    position: absolute;
    left: 0;
    top: 0;
    width: 200px;
    height: 134px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
  }
</style>
<script>
  import * as types from '../../../store/mutation-types'
  import UploadImage from '../../coms/UploadImage'
  export default {
    name: 'ArticleIndex',
    data () {
      return {
        assets: this.$store.state.assets,
        requestInfo: this.$store.state.requestInfo,
        articles: [],
        postYears: {},
        pageIndex: 1,
        pageSize: 20,
        totalCounts: 0,
        totalPages: 1,
        offsetCount: 0,
        // allTags: [],
        allTags: {},
        allTagsArr: [],
        allTagsForAdd: [],
        newArticle: {
          shown: false,
          album: '',
          title: '',
          tag: [],
          loading: false
        },
        modifyTag: {
          shown: false,
          uuid: '',
          album: '',
          title: '',
          tag: [],
          postYear: '',
          index: -1,
          loading: false
        },
        uploadProgress: {
          shown: false,
          percent: 0
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

      await this.getAllTags()
    },
    methods: {
      beforeUpload () {
        this.uploadProgress.shown = true
        this.uploadProgress.percent = 0
      },
      uploadImageProgress (event, file, fileList) {
        this.uploadProgress.percent = parseFloat(event.percent.toFixed(2))
      },
      setArticleAlbum (data) {
        this.newArticle.album = data.path
        setTimeout(() => {
          this.uploadProgress.shown = false
        }, 800)
      },
      uploadFailed () {
        setTimeout(() => {
          this.uploadProgress.shown = false
        }, 800)
      },
      setArticleAlbum2 (data) {
        this.modifyTag.album = data.path
        setTimeout(() => {
          this.uploadProgress.shown = false
        }, 800)
      },
      filterTags (tags) {
        const that = this
        return tags.replace(/(([a-zA-Z0-9]+)(;?))/g, function (item, item2, item3, item4) {
          return (that.allTags[item3] ? that.allTags[item3].text : item3) + item4
        })
      },
      async getAllTags () {
        /**
         * 获取所有标签
         */
        let allTags = await this.$store.dispatch(types.AJAX2, {
          url: this.requestInfo.getAllTags
        })
        if (allTags.status === 200) {
          this.allTagsArr = Object.assign([], allTags.data.list)
          this.allTags = this.formatTags(allTags.data.list)
          this.allTagsForAdd = this.formatAllTags(allTags.data.list)
          this.$store.commit(types.CACHE_ALL_ARTICLE_TAGS, {
            tags: this.allTagsArr
          })
        }
      },
      formatTags (tags) {
        let outTags = {}
        for (let i = 0; i < tags.length; i++) {
          if (tags[i].parent !== '0') {
            outTags[tags[i].value] = tags[i]
          }
        }
        return outTags
      },
      // async getAllTags () {
      //   /**
      //    * 获取所有标签
      //    */
      //   let allTags = await this.$store.dispatch(types.AJAX2, {
      //     url: this.requestInfo.getAllTags
      //   })
      //   if (allTags.status === 200) {
      //     this.allTags = this.formatAllTags(allTags.data.list)
      //   }
      // },
      formatAllTags (tags) {
        let outTags = {}
        for (let i = 0; i < tags.length; i++) {
          if (tags[i].parent === '0') {
            outTags[tags[i].value] = Object.assign({}, tags[i], {
              children: []
            })
          } else {
            outTags[tags[i].parent] && outTags[tags[i].parent].children.push(tags[i])
          }
        }
        return Object.values(outTags)
      },
      showModifyTagModal (e) {
        let _attrs = e.target.dataset
        this.modifyTag = Object.assign(this.modifyTag, {
          shown: true,
          uuid: _attrs.uuid,
          album: _attrs.album || this.assets.articleAlbum,
          title: _attrs.title,
          tag: (_attrs.tags.trim() === '') ? [] : _attrs.tags.split(';'),
          postYear: _attrs.postYear,
          index: Number(_attrs.index)
        })
      },
      async confirmModifyTag () {
        let modifyData = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.modifyTag,
          data: {
            uuid: this.modifyTag.uuid,
            album: this.modifyTag.album.trim(),
            tag: this.modifyTag.tag.join(';')
          }
        })
        if (modifyData.status === 200) {
          this.postYears[this.modifyTag.postYear][this.modifyTag.index]['tag'] = this.modifyTag.tag.join(';')
          this.postYears[this.modifyTag.postYear][this.modifyTag.index]['album'] = this.modifyTag.album.trim()
          this.$Message.success('修改成功')
        } else {
          this.$Message.error('标签修改失败，请稍后重试')
        }
      },
      showCreateNewArticleModal () {
        this.newArticle.shown = true
      },
      async createNewArticle () {
        let createdData = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.createArticle,
          data: {
            album: this.newArticle.album,
            title: this.newArticle.title,
            tag: this.newArticle.tag.join(';')
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
        this.newArticle.tag = []
        this.newArticle.album = ''
        this.gotoArticleDetail({
          target: {
            dataset: {
              uuid: createdData.data.uuid
            }
          }
        })
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
    components: {
      UploadImage
    }
  }
</script>
