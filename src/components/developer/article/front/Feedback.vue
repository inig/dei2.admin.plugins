<template>
  <div class="article_feedback_container">
    <div class="feedback_mobile" v-if="!isPc">
      <div class="bottom_comment_placement" v-if="!commentShown">
        <div type="text" class="comment_input_placement" ref="writeCommentRef" @click="showComment" v-if="loginInfo.token">写评论...</div>
        <div type="text" class="comment_input_placement disabled" v-else>写评论...</div>
        <div class="send_comment_btn disabled">发布</div>
        <div class="disable_placement" v-if="!loginInfo.token"><a href="javascript: void(0)" @click="gotoLogin">登录</a>后才可以评论</div>
      </div>
      <div class="comment_wrapper" :class="{shown: commentShown}" @click="hideComment">
        <div class="bottom_comment_container">
          <Input type="textarea"
                 :autosize="{minRows: 1, maxRows: 4}"
                 :ref="commentRef"
                 class="comment_input"
                 v-model="comment"
                 :placeholder="placeholder || '写评论...'"
                 @on-blur="hideComment"
          />
          <div class="send_comment_btn" :class="{active: comment.trim().length > 0}" @click="sendComment">发布</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .article_feedback_container {
    width: 100%;
    height: 100%;
  }
  .feedback_mobile {
    width: 100%;
    height: 100%;
  }
  .bottom_comment_placement {
    position: absolute;
    width: 100%;
    height: 48px;
    bottom: 0;
    left: 0;
    z-index: 999;
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
  .comment_input_placement.disabled {
    opacity: .3;
  }
  .disable_placement {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 48px;
    font-size: 13px;
    opacity: 1;
    display: flex;
    align-items: center;
    justify-content: center;
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
    z-index: 9999;
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
  .send_comment_btn.disabled {
    opacity: .3;
  }
</style>
<script>
  import * as types from '../../../../store/mutation-types'
  export default {
    name: 'Feedback',
    props: {
      aid: {
        type: String,
        default: ''
      },
      pid: {
        type: String,
        default: ''
      },
      rid: {
        type: String,
        default: ''
      },
      focus: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: '写评论...'
      }
    },
    data () {
      return {
        commentShown: false,
        isPc: !navigator.userAgent.match(/(iphone)|(android)/i),
        requestInfo: this.$store.state.requestInfo,
        comment: '',
        commentRef: 'comment-ref',
        commentFocus: false,
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events
      }
    },
    computed: {
      loginInfo () {
        return this.$store.state.loginInfo
      }
    },
    created () {
      const that = this
      this.$nextTick(() => {
        this.focus && this.loginInfo.token && this.showComment()
      })
      window.onresize = function () {
        that.isPc = !navigator.userAgent.match(/(iphone)|(android)/i)
      }
    },
    watch: {
      'focus': function (val) {
        if (val && this.loginInfo.token) {
//          setTimeout(() => {
//            this.showComment()
//          }, 100)
          this.$refs.writeCommentRef.click()
        } else {
          this.hideComment()
        }
      }
    },
    methods: {
      gotoLogin () {
        this.eventHub.$emit(this.events.frontArticleLogin)
      },
      showComment () {
        this.commentShown = true
        this.$refs[this.commentRef].focus()
      },
      hideComment () {
        this.$refs[this.commentRef].blur()
//        this.commentFocus = false
        this.commentShown = false
        this.$emit('end-input')
        setTimeout(() => {
          if (this.rid !== '') {
            this.comment = ''
          }
        }, 10)
      },
      async sendComment () {
        if (this.comment.trim() === '') {
          return
        }
        let articleId = this.aid
        let _commentObj = {
          aid: articleId,
          content: this.comment,
          nickname: this.loginInfo.nickname || '',
          headIcon: this.loginInfo.headIcon || '',
          pid: this.pid || '',
          rid: this.rid || ''
        }
        let commentData = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.sendComment,
          data: _commentObj
        })
        if (commentData.status === 200) {
          this.$Message.success('评论成功')
          this.comment = ''
          this.$emit('feedback', commentData.data)
        }
      }
    },
    components: {}
  }
</script>
