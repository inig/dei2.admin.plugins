<template>
  <div class="activity_card_container">
    <div class="activity_card_inner">
      <div class="activity_preview_image_container">
        <img class="activity_preview_image" :src="dataValue.thumbnail || assets.defaultActivity127x200">
        <div class="activity_description">
          <span v-text="dataValue.desc"></span>
        </div>
        <div class="activity_operation_container">
          <div class="activity_operations">
            <div class="activity_operation_item" @click="showPopup">
              <Tooltip content="预览" placement="right">
                <Icon type="eye" size="20"></Icon>
              </Tooltip>
            </div>
            <div class="activity_operation_item" @click="edit" v-if="dataValue.author === loginInfo.phonenum">
              <Tooltip content="编辑" placement="right">
                <Icon type="edit" size="20"></Icon>
              </Tooltip>
            </div>
            <div class="activity_operation_item RED" @click="showRemoveActivityConfirm" v-if="dataValue.author === loginInfo.phonenum">
              <Tooltip content="删除" placement="right">
                <Icon type="trash-a" size="22"></Icon>
              </Tooltip>
              <Modal v-model="removeActivityConfirm" width="360">
                <p slot="header" style="color: #f60; text-align: center">
                  <Icon type="information-circled"></Icon>
                  <span>删除确认</span>
                </p>
                <div style="text-align: center">
                  <p>"<span style="color: #ed3f14; font-weight: bold;">{{dataValue.desc}}</span>"，删除之后将无法恢复</p>
                  <p>确认删除吗?</p>
                </div>
                <div slot="footer">
                  <Button type="error" size="large" long :loading="removingActivity" @click="remove">删除</Button>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .RED {
    color: #ed3f14;
    /*color: #BF0A10;*/
  }
  .activity_card_container {
    float: left;
    width: 127px;
    height: 200px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .activity_card_inner {
    width: 127px;
    height: 200px;
    /*border: 1px solid #f5f5f5;*/
    /*background-color: rgba(18,231,255,0.38);*/
  }
  .activity_preview_image_container {
    position: relative;
    width: 127px;
    height: 200px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 4px;
  }
  .activity_preview_image {
    width: 127px;
    /*width: 112px;*/
    height: 200px;
    /*background-color: red;*/
  }
  .activity_operation_container {
    position: absolute;
    width: 127px;
    height: 200px;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    color: #fff;
    -webkit-transform: translate(0, 100%);
    -moz-transform: translate(0, 100%);
    -ms-transform: translate(0, 100%);
    -o-transform: translate(0, 100%);
    transform: translate(0, 100%);
    opacity: 0;
    -webkit-transition: all .3s ease-in-out;
    -moz-transition: all .3s ease-in-out;
    -ms-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
  }
  .activity_preview_image_container:hover .activity_operation_container {
    opacity: 1;
    -webkit-transform: translate(0, 0%);
    -moz-transform: translate(0, 0%);
    -ms-transform: translate(0, 0%);
    -o-transform: translate(0, 0%);
    transform: translate(0, 0%);
  }
  .activity_operations {
    width: 127px;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(73, 80, 96, .6);
  }
  .activity_operation_item {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: .7;
    -webkit-transition: all .3s ease;
    -moz-transition: all .3s ease;
    -ms-transition: all .3s ease;
    -o-transition: all .3s ease;
    transition: all .3s ease;
  }
  .activity_operation_item:hover {
    opacity: 1;
    cursor: pointer;
  }
  .activity_operation_item .ivu-tooltip {
    pointer-events: none;
  }
  .activity_operation_item .ivu-tooltip-rel {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .activity_description {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 127px;
    max-height: 60px;
    font-size: 10px;
    padding: 3px 6px;
    text-align: justify;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    background-color: rgba(0, 0, 0, .3);
    color: #ffffff;
  }
</style>
<script>
  import * as types from '../../../store/mutation-types'
  export default {
    name: 'ActivityCard',
    props: ['dataValue'],
    data () {
      return {
        assets: this.$store.state.assets,
        requestInfo: this.$store.state.requestInfo,
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events,
        removeActivityConfirm: false, // 删除确认
        removingActivity: false // 删除中
      }
    },
    computed: {
      loginInfo () {
        return this.$store.state.loginInfo
      }
    },
    methods: {
      showPopup () {
        this.$store.commit(types.SHOW_FULL_SCREEN_POPUP, {
          subCom: {
            Template: () => import('./ActivityPreview.vue')
          },
          subComType: 'preview',
          previewQRCode: 'http//192.168.189.89:8080/activity/preview?q=' + this.dataValue.uuid,
          previewTips: '扫二维码 预览活动',
          previewUUID: this.dataValue.uuid,
          subComStyle: {
            width: '375px',
            height: '667px',
            backgroundColor: '#464c5b',
            overflow: 'hidden'
          }
        })
      },
      getDefaultImage (width, height, text, color, bgColor) {
        let _url = 'http://iph.href.lu/' + width + 'x' + height + '?'
        let _urlArr = []
        text && _urlArr.push('text=' + text)
        color && _urlArr.push('fg=' + color.substring(1))
        bgColor && _urlArr.push('bg=' + bgColor.substring(1))
        return _url + _urlArr.join('&')
      },
      edit () {
        this.$router.push({
          name: 'ActivityEdit',
          params: {
            activityInfo: this.dataValue
          },
          query: {
            q: this.dataValue.uuid
          }
        })
      },
      async remove () {
        // 删除活动
        this.removingActivity = true
        let deleteData = await this.$store.dispatch(types.AJAX, {
          baseUrl: this.requestInfo.baseUrl,
          url: this.requestInfo.deleteActivity,
          data: {
            uuid: this.dataValue.uuid
          }
        })
        setTimeout(() => {
          this.removingActivity = false
          this.removeActivityConfirm = false
          if (deleteData.status === 200) {
            this.eventHub.$emit(this.events.removeActivity, {
              uuid: deleteData.data.uuid
            })
            this.$Message.success({
              content: '删除成功',
              duration: 3
            })
          } else {
            this.$Message.error({
              content: deleteData.message || '删除失败，请重试',
              duration: 3
            })
          }
        }, 800)
      },
      showRemoveActivityConfirm () {
        this.removeActivityConfirm = true
      }
    },
    components: {}
  }
</script>
