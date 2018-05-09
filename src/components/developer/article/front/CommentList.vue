<template>
  <div class="comment_list_container">
    <div class="comment_list_header">
      <div class="close_container" @click="closeCommentList">
        <Icon size="30" type="ios-close-empty"></Icon>
      </div>
      <p class="comment_list_header_text" v-if="subComments.length > 0"><span v-text="subComments.length"></span>条回复</p>
      <p class="comment_list_header_text" v-else>暂无回复</p>
    </div>

    <zpm-scroll class="comment_scroll_body" :data="subComments">
      <div class="comment_scroll_inner">
        <div class="article_comment_top">
          <div class="article_comment_left_container">
            <img class="article_comment_head_icon_img" :src="comment.headIcon || '/static/images/avatar_male_1.jpg'"/>
          </div>
          <div class="article_comment_main_container">
            <div class="article_comment_nickname_container">
              <div class="article_comment_nickname">
                <span v-text="comment.nickname"></span>
              </div>
              <!--<div class="article_comment_like" :class="{active: comment.like && JSON.parse(comment.like).length > 0}">-->
              <!--<Icon :type="comment.like && JSON.parse(comment.like).length > 0 ? 'ios-heart' : 'ios-heart-outline'" size="14" style="margin-right: 5px;"></Icon>-->
              <!--<span v-text="comment.like && JSON.parse(comment.like).length > 0 ? JSON.parse(comment.like).length : '喜欢'"></span>-->
              <!--</div>-->
            </div>
            <div class="article_comment_content_container" v-text="comment.content"></div>
            <div class="article_comment_feedback_container">
              {{comment.postTime | time}}
            </div>
            <div class="article_comment_like_container">
              <div class="article_comment_like_detail_container disabled" v-if="!comment.like || JSON.parse(comment.like).length < 1">暂无人喜欢过</div>
              <div class="article_comment_like_detail_container" v-if="comment.like && JSON.parse(comment.like).length > 0">{{JSON.parse(comment.like).length}} 人喜欢过</div>
              <div class="article_comment_like" :class="{active: comment.like && JSON.parse(comment.like).length > 0}">
                <Icon :type="comment.like && JSON.parse(comment.like).length > 0 ? 'ios-heart' : 'ios-heart-outline'" size="14" style="margin-right: 5px;"></Icon>
                <span v-text="comment.like && JSON.parse(comment.like).length > 0 ? JSON.parse(comment.like).length : '喜欢'"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="sub_comments_title">{{subComments.length < 1 ? '暂无评论' : '全部评论'}}</p>
      <div class="comment_sub_item" v-for="(c, index) in subComments" :key="c.uuid">
        <comment :root-comment="false" :author="author" :comment="c" @view="commentSomebody"></comment>
        <!--<comment :root-comment="false" :author="author" :comments="comments" :comment="c" @view="commentSomebody"></comment>-->
      </div>
    </zpm-scroll>

    <div class="bottom_feedback">
      <feedback :aid="comment.aid" :pid="sendMessageTo" :rid="comment.uuid" :data-rid="comment.uuid" :placeholder="commentPlaceholder" :focus="showEdit" @feedback="addComment" @end-input="endInput"></feedback>
    </div>
  </div>
</template>
<style scoped lang="scss">
  @import "../../../../assets/css/theme";
  .comment_list_container {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
  }
  .comment_list_header {
    position: relative;
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #f5f5f5;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .close_container {
    position: absolute;
    left: 0;
    top: 0;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .comment_list_header_text {
    font-size: 14px;
  }

  .comment_scroll_body {
    width: 100%;
    height: calc(100% - 49px - 48px);
  }
  .comment_scroll_inner {
    width: 100%;
    height: auto;
  }

  .comment_sub_item {
    padding: 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .sub_comments_title {
    font-size: 12px;
    color: #333;
    padding-left: 15px;
    margin-top: 15px;
  }

  /* 顶部楼主自己的评论 */
  .article_comment_top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 15px 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border-bottom: 1px solid #f5f5f5;
  }
  .article_comment_left_container {
    width: 40px;
    display: inline-flex;
    align-items: flex-start;
    justify-content: center;
  }
  .article_comment_head_icon_img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #f5f5f5;
  }
  .article_comment_main_container {
    width: calc(100% - 40px);
    padding-left: 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .article_comment_nickname_container {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
  }
  .article_comment_nickname {
    width: calc(100% - 48px);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 12px;
    color: #2b85e4;
  }
  .article_comment_like {
    font-size: 12px;
    color: #888;
    display: inline-flex;
    align-items: center;
  }
  .article_comment_like.active {
    font-size: 13px;
    color: red;
    -webkit-transition: all .2s ease-in-out;
    -moz-transition: all .2s ease-in-out;
    -ms-transition: all .2s ease-in-out;
    -o-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
  }
  .article_comment_content_container {
    width: 100%;
    padding: 5px 0;
    font-size: 14px;
    color: #333;
    text-align: justify;
  }
  .article_comment_feedback_container {
    font-size: 10px;
  }
  .article_comment_like_container {
    width: 100%;
    height: 32px;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
  }
  .article_comment_like_detail_container {
    width: calc(100% - 50px);
  }
  .article_comment_like_detail_container.disabled {
    opacity: 0.7;
  }
  /* 顶部楼主自己的评论 */

  .bottom_feedback {
    width: 100%;
    height: 48px;
  }
</style>
<script>
  import * as types from '../../../../store/mutation-types'
  export default {
    name: 'CommentList',
    props: {
      'comment': {
        type: Object,
        default: function () {
          return {}
        }
      },
//      'comments': {
//        type: Array,
//        default: function () {
//          return []
//        }
//      },
      'rootComment': {
        type: Boolean,
        default: false
      },
      'author': {
        type: String,
        default: ''
      }
    },
    data () {
      return {
//        subComments: [],
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events,
        commentPlaceholder: '',
        showEdit: false,
        sendMessageTo: ''
      }
    },
    computed: {
      comments () {
        return this.$store.state.article.comments[this.comment.aid]
      },
      subComments () {
        return this.findSubComments(this.$store.state.article.comments[this.comment.aid])
      }
    },
    created () {
    },
    watch: {
//      'comment': function () {
//        this.subComments = this.findSubComments()
//      },
//      'comments': function () {
//        this.subComments = this.findSubComments()
//      }
    },
    methods: {
      findSubComments (comments) {
        if (!comments) {
          return []
        }
        let i = 0
        let outArr = []
//        let comments = this.comments
        for (i; i < comments.length; i++) {
          if (comments[i].rid === this.comment.uuid && comments[i].aid === this.comment.aid) {
            outArr.push(comments[i])
          }
        }
        return outArr
      },
      closeCommentList () {
        this.eventHub.$emit(this.events.frontArticleCloseCommentList)
      },
      addComment (data) {
        this.comments.unshift(data)
        this.cacheArticleComments(this.comments)
      },
      cacheArticleComments (comments) {
        let _articleComments = {}
        _articleComments[this.comment.aid] = JSON.parse(JSON.stringify(comments))
        this.$store.commit(types.SET_COMMENTS, _articleComments)
      },
      commentSomebody (data) {
        this.commentPlaceholder = '回复 ' + data.nickname + ': '
        if (data.uuid !== this.comment.uuid) {
          // 自己不能回复自己
          this.sendMessageTo = data.uuid
        }
        this.showEdit = true
      },
      endInput () {
        this.commentPlaceholder = ''
        this.sendMessageTo = ''
        this.showEdit = false
      }
    },
    components: {
      Comment: () => import('./Comment.vue'),
      Feedback: () => import('./Feedback.vue'),
      ZpmScroll: () => import('../../../coms/ZpmScroll/ZpmScroll.vue')
    }
  }
</script>
