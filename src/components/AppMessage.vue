<template>
  <div class="app-message-container">
    <div class="app-message-wrap">
      <div class="app-message-mainlist">
        <div class="app-message-tab" v-for="(tab, index) in tabList" :key="index">
          <Button @click="getMesByType(tab.type)" size="large" long type="text">
            <transition name="mes-current-type-btn">
              <Icon v-show="currentMesType === tab.type" type="checkmark"></Icon>
            </transition>
            <span class="mes-type-btn-text">{{tab.text}}</span>
            <Badge class="message-count-badge-outer" class-name="message-count-badge" :count="messageType[tab.type].count"></Badge>
          </Button>
        </div>
      </div>
      <div class="app-message-content">
        <transition name="view-message">
          <div v-if="showMesTitleList" class="message-list-content">
            <Table ref="messageList" :columns="mesTitleColumns" @on-row-click="previewMessage" :data="messageType[currentMesType].mesData" :no-data-text="messageType[currentMesType].nodataText" :stripe="true"></Table>
            <div class="message-pages-container" v-if="showPage">
              <Page
                size="small"
                :current="messageType[currentMesType].pageIndex"
                :total="messageType[currentMesType].count"
                :page-size="messageType[currentMesType].pageSize"
                :page-size-opts="pageSizeOpts"
                show-elevator
                show-sizer
                @on-change="changePage"
                @on-page-size-change="changePageSize"
                >
              </Page>
            </div>
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
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
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
  .message-pages-container {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
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
  // import utils from '../utils/index'
  export default {
    data () {
      const markAsreadBtn = (h, params) => {
        return h('Button', {
          props: {
            size: 'small'
          },
          on: {
            click: (evt) => {
              evt.stopPropagation()
              this.updateMesHandleFn({
                type: 'hasread',
                status: 2,
                fromStatus: 1,
                uuid: params.row.uuid
              })
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
            click: (evt) => {
              evt.stopPropagation()
              this.updateMesHandleFn({
                type: 'recyclebin',
                status: 0,
                fromStatus: 2,
                uuid: params.row.uuid
              })
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
            click: (evt) => {
              evt.stopPropagation()
              this.updateMesHandleFn({
                type: 'hasread',
                status: 2,
                fromStatus: 0,
                uuid: params.row.uuid
              })
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
        currentMesType: 'unread',
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events,
        currentMessageCount: 0,
        currentMesList: [],
        messageType: {
          unread: {
            clickFlag: false,
            count: 0,
            pageIndex: 1,
            pageSize: 3,
            mesData: [],
            status: 1,
            nodataText: '暂无未读消息'
          },
          hasread: {
            clickFlag: false,
            count: 0,
            pageIndex: 1,
            pageSize: 3,
            mesData: [],
            status: 2,
            nodataText: '暂无已读消息'
          },
          recyclebin: {
            clickFlag: false,
            count: 0,
            pageIndex: 1,
            pageSize: 3,
            mesData: [],
            status: 0,
            nodataText: '回收站无消息'
          }
        },
        pageSizeOpts: [1, 2, 3, 4],
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
                style: {
                  cursor: 'default'
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
              let time = ''
              switch (this.currentMesType) {
                case 'unread': time = params.row.sendTime
                  break
                case 'hasread': time = params.row.readTime
                  break
                case 'recyclebin': time = params.row.readTime
                  break
                default: time = params.row.sendTime
                  break
              }
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
                }, this.formatDate(time))
              ])
            }
          },
          {
            title: ' ',
            key: 'asread',
            align: 'center',
            width: 100,
            render: (h, params) => {
              if (this.currentMesType === 'unread') {
                return h('div', [
                  markAsreadBtn(h, params)
                ])
              } else if (this.currentMesType === 'hasread') {
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
        ],
        requestInfo: this.$store.state.requestInfo,
        socket: this.$store.state.socket,
        socketEvents: this.$store.state.socketEvents
      }
    },
    created () {
      this.$nextTick(() => {
        this.getMesByType(this.currentMesType)
        this.socket.client.on(this.socket.event, this.getNewMessage)
      })
    },
    computed: {
      loginInfo () {
        return this.$store.state.loginInfo
      },
      showPage () {
        let isShowPage = true
        if (this.messageType[this.currentMesType].count === 0) {
          isShowPage = false
        }
        return isShowPage
      }
    },
    methods: {
      previewMessage (evt) {
        console.log(evt)
        this.showMesTitleList = false
        this.mes.title = evt.title
        this.mes.time = this.formatDate(evt.sendTime)
        this.mes.desc = evt.desc
        // 类型为"未读消息"时，调用接口
        if (this.messageType[this.currentMesType].status === 1) {
          this.updateMesHandleFn({
            type: 'hasread',
            status: 2,
            fromStatus: 1,
            uuid: evt.uuid
          })
        }
      },
      getNewMessage (args) {
        if (args.to.phonenum === this.loginInfo.phonenum) {
          this.messageType.unread.count += 1
          if (this.messageType.unread.pageIndex === 1) {
            let newMessage = {
              title: args.message.title,
              desc: args.message.value,
              sendTime: args.message.sendTime,
              uuid: args.message.uuid
            }
            this.messageType.unread.mesData.unshift(newMessage)
            this.messageType.unread.mesData.splice(this.messageType.unread.pageSize)
          }
        }
      },
      async getMesByPage (type) {
        let messageList = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.queryMessage,
          data: {
            toPhonenum: this.loginInfo.phonenum,
            pageIndex: this.messageType[type].pageIndex,
            pageSize: this.messageType[type].pageSize,
            status: this.messageType[type].status
          }
        })
        this.messageType[type].mesData = messageList.data.list || []
        this.messageType[type].count = messageList.data.totalCounts || 0
      },
      async getMesByType (type) {
        this.currentMesType = type
        this.showMesTitleList = true
        if (!this.messageType[this.currentMesType].clickFlag) {
          this.messageType[this.currentMesType].clickFlag = true
          await this.getMesByPage(this.currentMesType)
        }
      },
      async changePage (evt) {
        this.messageType[this.currentMesType].pageIndex = evt
        await this.getMesByPage(this.currentMesType)
      },
      async changePageSize (evt) {
        this.messageType[this.currentMesType].pageSize = evt
        this.messageType[this.currentMesType].pageIndex = 1
        await this.getMesByPage(this.currentMesType)
      },
      formatDate (time) {
        let date = new Date()
        date.setTime(time)
        let _year = date.getFullYear()
        let _month = ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1))
        let _day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
        let _hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())
        let _minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        let _second = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())

        return _year + '/' + _month + '/' + _day + '  ' + _hour + ':' + _minute + ':' + _second
      },
      async backMesTitleList () {
        if (this.currentMesType === 'unread') {
          await this.getMesByPage(this.currentMesType)
        }
        this.showMesTitleList = true
      },
      async updateMesHandleFn (args) {
        this.messageType[this.currentMesType].count -= 1
        let _rmoveMes = this.messageType[this.currentMesType].mesData.splice(args.index, 1)[0]
        let _time = +new Date()
        if (this.messageType[args.type].clickFlag) {
          if (!_rmoveMes.readTime) {
            _rmoveMes.readTime = _time
          }
          this.messageType[args.type].count += 1
          if (this.messageType[args.type].pageIndex === 1) {
            this.messageType[args.type].mesData.unshift(_rmoveMes)
            this.messageType[args.type].mesData.splice(this.messageType[args.type].pageSize)
          }
        }
        let _data = {
          status: args.status,
          uuid: args.uuid
        }
        if (args.type === 'unread') {
          _data.readTime = _time
        }
        await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.updateMessage,
          data: _data
        })
        if (args.type === 'hasread' && args.fromStatus === 1) {
          this.eventHub.$emit(this.events.readMessage, {
            count: 1
          })
        }
        await this.getMesByPage(this.currentMesType)
      }
    }
  }
</script>
