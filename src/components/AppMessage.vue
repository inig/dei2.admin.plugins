<template>
  <div class="app-message-container">
    <div class="app-message-wrap">
      <div class="app-message-mainlist">
        <div class="app-message-tab" v-for="(tab, index) in tabList" :key="index">
          <Button @click="setCurrentMesType(tab.type)" size="large" long type="text">
            <transition name="mes-current-type-btn">
              <Icon v-show="currentMessageType === tab.type" type="checkmark"></Icon>
            </transition>
            <span class="mes-type-btn-text">{{tab.text}}</span>
            <Badge class="message-count-badge-outer" class-name="message-count-badge" :count="messageType[tab.type].count"></Badge>
          </Button>
        </div>
      </div>
      <div class="app-message-content">
        <transition name="view-message">
          <div v-if="showMesTitleList" class="message-list-content">
            <Table ref="messageList" :columns="mesTitleColumns" :data="currentMesList" :no-data-text="messageType[currentMessageType].nodataText"></Table>
          </div>
        </transition>
        <transition name="back-message-list">
          <div v-if="!showMesTitleList" class="message-view-content">
            <div class="message-view-content-top-bar">
              <span class="mes-back-btn-con">
                <Button type="text" @click="backMesTitleList"><Icon type="chevron-left"></Icon>&nbsp;&nbsp;返回</Button>
              </span>
              <h3 class="mes-title">{{ mes.title }}</h3>
            </div>
            <p class="mes-time-con"><Icon type="android-time"></Icon>&nbsp;&nbsp;{{ mes.time }}</p>
            <div class="message-content-body">
              <p class="message-content" v-html="mes.desc"></p>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .app-message-container {
    width: 100%;
    height: 100%;
  }
  .app-message-wrap {
    display: flex;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2);
  }
  .app-message-mainlist {
    width: 300px;
    display: flex;
    flex-direction: column;
    background-color: #f0f0f0;
  }
  .app-message-mainlist .app-message-tab {
    padding: 10px;
    margin: 0 20px;
    border-bottom: 1px dashed #d2d3d2;
  }
  .app-message-mainlist .mes-type-btn-text {
    margin-left: 10px;
  }
  .app-message-mainlist .message-count-badge {
    right: -10px;
  }
  .mes-current-type-btn-enter, .mes-current-type-btn-leave-to {
    opacity: 0;
    width: 0;
  }
  .mes-current-type-btn-enter-active, .mes-current-type-btn-leave-active {
    transition: all .3s;
  }
  .mes-current-type-btn-enter-to, .mes-current-type-btn-leave {
    opacity: 1;
    width: 12px;
  }
  .app-message-content {
    flex: 1;
    background-color: #fff;
    overflow: hidden;
  }
  .message-list-content, .message-view-content {
    width: 100%;
    height: 100%;
  }
  .view-message-enter, .view-message-leave-to {
    opacity: 0;
  }
  .view-message-enter-active, .view-message-leave-active {
    transition: all .5s;
  }
  .view-message-enter-to, .view-message-leave {
    opacity: 1;
  }
  .back-message-list-enter, .back-message-list-leave-to{
    opacity: 0;
  }
  .back-message-list-enter-active, .back-message-list-leave-active{
    transition: all .5s;
  }
  .back-message-list-enter-to, .back-message-list-leave{
    opacity: 1;
  }
  .message-view-content-top-bar {
    width: 100%;
    height: 40px;
    background-color: #fff;
    border-bottom: 1px solid #dedede;
    position: relative;
  }
  .mes-back-btn-con {
    position: absolute;
    width: 70px;
    height: 30px;
    left: 0;
    top: 5px;
  }
  .mes-title {
    position: absolute;
    top: 0;
    right: 70px;
    bottom: 0;
    left: 70px;
    line-height: 40px;
    padding: 0 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }
  .mes-time-con {
    width: 100%;
    padding: 20px 0;
    text-align: center;
    font-size: 14px;
    color: #b7b7b5;
  }
  .message-content {
    padding: 10px 20px;
  }
</style>
<script>
  import * as types from '../store/mutation-types'
  import utils from '../utils/index'
  export default {
    data () {
      const markAsreadBtn = (h, params) => {
        return h('Button', {
          props: {
            size: 'small'
          },
          on: {
            click: () => {

            }
          }
        }, '标为已读')
      }
      const deleteMesBtn = (h, params) => {
        return h('Button', {
          props: {
            size: 'small',
            type: 'error'
          },
          on: {
            click: () => {

            }
          }
        }, '删除')
      }
      const restoreBtn = (h, params) => {
        return h('Button', {
          props: {
            size: 'small'
          },
          on: {
            click: () => {

            }
          }
        }, '还原')
      }
      return {
        tabList: [
          {
            type: 'unread',
            text: '未读消息'
          },
          {
            type: 'hasread',
            text: '已读消息'
          },
          {
            type: 'recyclebin',
            text: '回收站'
          }
        ],
        messageType: {
          unread: {
            status: 1,
            nodataText: '暂无未读消息',
            count: 0
          },
          hasread: {
            status: 2,
            nodataText: '暂无已读消息',
            count: 0
          },
          recyclebin: {
            status: 0,
            nodataText: '回收站无消息',
            count: 0
          }
        },
        currentMessageType: 'unread',
        currentMessageCount: 0,
        currentMesList: [],
        unread: {
          pageIndex: 1,
          pageSize: 2,
          mesData: []
        },
        unreadMesList: [],
        hasreadMesList: [],
        recyclebinList: [],
        unreadCount: 0,
        hasreadCount: 0,
        recyclebinCount: 0,
        showMesTitleList: true,
        mes: {
          title: '',
          time: '',
          desc: ''
        },
        mesTitleColumns: [
          {
            title: ' ',
            key: 'title',
            align: 'left',
            ellipsis: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.showMesTitleList = false
                    this.mes.title = params.row.title
                    this.mes.time = this.formatDate(params.row.sendTime)
                    this.mes.desc = params.row.desc
                    this.readMessage(params.row.uuid)
                  }
                }
              }, params.row.title)
            }
          },
          {
            title: ' ',
            key: 'time',
            align: 'center',
            width: 180,
            render: (h, params) => {
              return h('span', [
                h('Icon', {
                  props: {
                    type: 'android-time',
                    size: 12
                  },
                  style: {
                    margin: '0 5px'
                  }
                }),
                h('span', {
                  props: {
                    type: 'android-time',
                    size: 12
                  }
                }, this.formatDate(params.row.sendTime))
              ])
            }
          },
          {
            title: ' ',
            key: 'asread',
            align: 'center',
            width: 100,
            render: (h, params) => {
              if (this.currentMessageType === 'unread') {
                return h('div', [
                  markAsreadBtn(h, params)
                ])
              } else if (this.currentMessageType === 'hasread') {
                return h('div', [
                  deleteMesBtn(h, params)
                ])
              } else {
                return h('div', [
                  restoreBtn(h, params)
                ])
              }
            }
          }
        ]
      }
    },
    created () {
      this.$nextTick(() => {
        this.setCurrentMesType()
      })
    },
    computed: {
      loginInfo () {
        return utils.storage.getItem(this.$store.state.localStorageKeys.userInfo)
      }
    },
    methods: {
      async setCurrentMesType (type) {
        if (this.currentMessageType === type) {
          return false
        }
        this.currentMessageType = type || 'unread'
        let messageList = await this.$store.dispatch(types.QUERY_MESSAGE, {
          token: this.loginInfo.token,
          phonenum: this.loginInfo.phonenum,
          toPhonenum: this.loginInfo.phonenum,
          status: this.messageType[this.currentMessageType].status
        })
        this.currentMesList = messageList.data.list || []
        // this.unreadMesList =
        this.messageType[this.currentMessageType].count = messageList.data.count || 0
        console.log(messageList)
      },
      async readMessage (uuid) {
        let data = await this.$store.dispatch(types.READ_MESSAGE, {
          token: this.loginInfo.token,
          phonenum: this.loginInfo.phonenum,
          readTime: +new Date(),
          uuid: uuid
        })
        console.log(data)
      },
      formatDate (time) {
        let date = new Date()
        date.setTime(time)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hour = date.getHours()
        let minute = date.getMinutes()
        let second = date.getSeconds()
        return year + '/' + month + '/' + day + '  ' + hour + ':' + minute + ':' + second
      },
      backMesTitleList () {
        this.showMesTitleList = true
      }
    }
  }
</script>
