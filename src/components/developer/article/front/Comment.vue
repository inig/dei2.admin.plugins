<template>
  <div class="article_comment_container" v-if="rootComment ? (comment.rid === '') : (comment.rid !== '')">
    <div class="article_comment_left_container">
      <img class="article_comment_head_icon_img" :src="comment.headIcon || '/static/images/avatar_male_1.jpg'"/>
    </div>
    <div class="article_comment_main_container">
      <div class="article_comment_nickname_container">
        <div class="article_comment_nickname">
          <span v-text="comment.nickname"></span>
          <span class="article_comment_author_tag" v-if="comment.phonenum === author">
            楼主
          </span>
        </div>
        <div class="article_comment_like" :class="{active: comment.like && JSON.parse(comment.like).length > 0}">
          <Icon :type="comment.like && JSON.parse(comment.like).length > 0 ? 'ios-heart' : 'ios-heart-outline'" size="14" style="margin-right: 5px;"></Icon>
          <span v-text="comment.like && JSON.parse(comment.like).length > 0 ? JSON.parse(comment.like).length : '喜欢'"></span>
        </div>
      </div>
      <div class="article_comment_content_container" @click="chooseComment">
        <span v-html="comment.content.replace(/\n/g, '<br>')"></span>
        <span v-if="comment.parent && comment.parent.content"><a href="javascript: void(0)">//@{{comment.parent.nickname}}: </a>{{comment.parent.content.substring(0, 100) + '...'}}</span>
      </div>
      <div class="article_comment_feedback_container" @click="chooseComment">
        {{comment.postTime | time}} <a class="feedback_text" href="javascript: void(0)">{{subComments.length > 0 ? subComments.length : ''}} 回复</a>
      </div>
      <div class="sub_comments_container" v-if="subComments.length > 0" @click="chooseComment">
        <div class="sub_comments_item" v-for="(subComment, idx) in subComments.slice(0, listSubCommentsCount)" :key="subComment.uuid">
          <a class="sub_comments_item_text" href="javascript: void(0)" v-text="subComment.nickname + ': '"></a>
          <span v-text="subComment.content"></span>
        </div>
        <div class="more_sub_comments_text" v-if="subComments.length > listSubCommentsCount">查看全部 <span style="font-size: 14px; color: #333; font-weight: bold;" v-text="subComments.length"></span> 条评论</div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  @import "../../../../assets/css/theme";
  .article_comment_container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 8px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
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
  .article_comment_author_tag {
    font-size: 12px;
    padding: 0 4px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid $theme;
    color: $theme;
    border-radius: 2px;
    display: inline-block;
    -webkit-transform: scale(0.7);
    -moz-transform: scale(0.7);
    -ms-transform: scale(0.7);
    -o-transform: scale(0.7);
    transform: scale(0.7);
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
  }
  .article_comment_feedback_container {
    font-size: 10px;
  }
  .feedback_text {
    padding: 2px 8px;
    background-color: #f5f5f5;
    border-radius: 30px;
    color: green;
  }
  .sub_comments_container {
    width: 100%;
    padding: 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #f5f5f5;
    border-radius: 3px;
    margin-top: 10px;
  }
  .sub_comments_item {
    margin: 5px 0;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    text-align: justify;
    word-break: break-all;
  }
  .sub_comments_item_text {
    color: #2b85e4;
  }
  .more_sub_comments_text {
    font-size: 12px;
    margin-top: 15px;
    color: #aaaaaa;
  }
</style>
<script>
  export default {
    name: 'Comment',
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
        listSubCommentsCount: 5 // 子评论最多显示的条数
//        subComments: []
      }
    },
    computed: {
      // comments () {
      //   return this.article['zpm_comments']
      // }
      comments () {
        return this.$store.state.article.comments[this.comment.aid]
      },
      subComments () {
        return this.formatSubComments(this.$store.state.article.comments[this.comment.aid])
      }
    },
    created () {
//      this.formatSubComments()
    },
    methods: {
      findSubComments (comments) {
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
      formatSubComments (comments) {
        if (!comments) {
          return []
        }
        let subComments = this.findSubComments(comments)
        let i = 0
        for (i; i < subComments.length; i++) {
          subComments[i].parent = this.findParentComment(subComments[i])
        }
        return subComments
      },
      findParentComment (comment) {
        let i = 0
        let outComment = {}
        let comments = this.comments
        for (i; i < comments.length; i++) {
          if (comments[i].uuid === comment.pid && this.comment.uuid !== comment.pid) {
            outComment = comments[i]
            i = comments.length
          }
        }
        return outComment
      },
      chooseComment () {
        this.$emit('view', this.comment)
      }
    },
    components: {}
  }
</script>
