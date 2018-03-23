<template>
  <div class="app_header">
    <Row type="flex">
      <Col :span="spanLeft" class="layout-menu-left">
        <router-link :to="{path: '/'}">
          <!--<div class="layout-logo-left" v-text="appName"></div>-->
          <Tooltip class="layout-logo-left" :content="fullAppName" placement="right">
            <div v-text="menuFold ? shortAppName : appName"></div>
          </Tooltip>
        </router-link>
      </Col>
      <Col :span="spanRight">
        <div class="layout-header">
          <div class="menu_toggle" @click="toggleMenu">
            <Icon type="navicon" size="26"></Icon>
          </div>
          <full-screen v-model="isFullScreen" @on-change="fullscreenChange" class="full_screen_icon"></full-screen>
          <div class="layout-header-icon-container">
            <div @click="navToMessage" class="message-icon">
              <Badge :count="messageValue" class-name="message-count-badge">
                <Icon type="ios-bell" :size="22"></Icon>
              </Badge>
            </div>
          </div>
          <div class="user_role" v-text="currentRole"></div>
          <Poptip trigger="click" placement="bottom-end" width="200" class="user-badge">
            <Badge dot>
              <Avatar size="large" :src="loginInfo.headIcon || (loginInfo.gender == 1 ? assets.maleAvatar : assets.femaleAvatar)" class="user-avatar"></Avatar>
            </Badge>
            <div class="api" slot="content">
              <Card :bordered="false" :padding="0">
                <p slot="title" v-text="loginInfo.username"></p>
                <a href="#" slot="extra" @click.prevent="logout">
                  退出
                  <Icon type="log-out"></Icon>
                </a>
                <Menu width="200" @on-select="navToUserSet">
                  <MenuItem name="personal">
                    <Icon type="clipboard"></Icon>
                    个人中心
                  </MenuItem>
                  <MenuItem name="setting">
                    <Icon type="settings"></Icon>
                    设置
                  </MenuItem>
                </Menu>
              </Card>
            </div>
          </Poptip>
        </div>
      </Col>
    </Row>
  </div>
</template>
<style>
  .app_header {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 60px;
    background-color: #ffffff;
  }
  .layout{
    /*border: 1px solid #d7dde4;*/
    background: #f5f7f9;
    position: relative;
    /*border-radius: 4px;*/
    overflow: hidden;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
  }
  .layout-menu-left{
    background: #464c5b;
  }
  .layout-header{
    position: relative;
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .layout-header .menu_toggle {
    position: absolute;
    left: 12px;
    cursor: pointer;
  }
  .layout-header-icon-container {
    height: 100%;
    margin-right: 20px;
    display: flex;
    align-items: center;
  }
  .message-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .message-icon .message-count-badge {
    right: -6px;
  }
  .user-badge {
    /* position: absolute;
    right: 30px; */
    display: flex;
    align-items: center;
    height: 100%;
    margin-right: 30px;
    cursor: pointer;
  }
  .user-avatar {
    background-color: #87d068;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .user_role {
    display: flex;
    align-items: center;
    height: 100%;
    margin-right: 16px;
    /* position: absolute;
    right: 80px; */
  }
  .layout-logo-left {
    width: 100%;
    height: 60px;
    /*background: #5b6270;*/
    border-radius: 3px;
    margin: 0 auto;
    padding: 15px 0;
    color: #FFFFFF;
    line-height: 30px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    text-shadow: 0 0 10px #ffffff;
    overflow: hidden;
    border-bottom: 1px solid rgba(30, 36, 50, 0.36);
  }
  .layout-logo-left .ivu-tooltip-rel {
    width: 100%;
  }
  .ivu-col{
    transition: width .2s cubic-bezier(.215,.61,.355,1);
  }
  .user-badge .ivu-poptip-body {
    padding: 0!important;
  }
  .full_screen_icon {
    margin-right: 30px;
    cursor: pointer;
    /*height: 60px;*/
    /*display: inline-flex;*/
    /*align-items: center;*/
    /*justify-content: center;*/
  }
</style>
<script>
  import FullScreen from './fullscreen.vue'
  import * as types from '../store/mutation-types'
  import utils from '../utils'
  export default {
    name: 'AppHeader',
    data () {
      return {
        appName: this.$store.state.appName,
        shortAppName: this.$store.state.shortAppName,
        fullAppName: this.$store.state.fullAppName,
        assets: this.$store.state.assets,
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events,
        messageValue: 0,
        socket: this.$store.state.socket,
        socketEvents: this.$store.state.socketEvents,
        requestInfo: this.$store.state.requestInfo,
        isFullScreen: this.$store.state.isFullScreen
      }
    },
    computed: {
      loginInfo () {
        return this.$store.state.loginInfo
      },
      spanLeft () {
        return this.$store.state.spanLeft
      },
      spanRight () {
        return this.$store.state.spanRight
      },
      menuFold () {
        return this.$store.state.menuFold
      },
      currentRole () {
        let _role = this.loginInfo.role
        let _currentRole = ''
        switch (_role) {
          case 1:
            _currentRole = '超级管理员'
            break
          case 2:
            _currentRole = '管理员'
            break
          case 3:
            _currentRole = '开发者'
            break
          case 4:
            _currentRole = '用户'
            break
          default:
            break
        }
        return _currentRole
      }
    },
    created () {
      this.$nextTick(async () => {
        this.socket.client.on(this.socket.event, this.getNewMessage)
        this.eventHub.$on(this.events.readMessage, this.readMessage)
        await this.getMessageCount({
          status: 1
        })
      })
    },
    methods: {
      toggleMenu () {
        this.$store.commit(types.TOGGLE_MENU)
        setTimeout(() => {
          this.eventHub.$emit(this.events.mainContentSizeChange, {})
        }, 200)
      },
      fullscreenChange () {
        this.$store.commit(types.TOGGLE_FULL_SCREEN, {
          isFullScreen: this.isFullScreen
        })
      },
      readMessage (args) {
        this.messageValue = Math.max(this.messageValue - Number(args.count), 0)
      },
      async getMessageCount (args) {
        let messageCountsData = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.countMessage,
          data: args
        })
        if (messageCountsData.status === 200) {
          this.messageValue = messageCountsData.data.count
        }
      },
      getUserRoleText (role) {
        let _currentRole = ''
        switch (Number(role)) {
          case 1:
            _currentRole = '超级管理员'
            break
          case 2:
            _currentRole = '管理员'
            break
          case 3:
            _currentRole = '开发者'
            break
          case 4:
            _currentRole = '用户'
            break
          default:
            break
        }
        return _currentRole
      },
      getNewMessage (args) {
        if (args.message.type === this.socketEvents.changeUserRole) {
          if (this.loginInfo.status !== args.message.data.status && args.message.data.status === 0) {
            this.$Notice.warning({
              title: '账号状态变更',
              desc: '您的账号被锁定，请联系管理员后再登录'
            })
            utils.storage.clear()
            this.$router.replace('/login')
            // 断开socket.io连接
            this.$store.commit(types.DISCONNECT_SOCKETIO)
          } else if (this.loginInfo.role !== args.message.data.role) {
            this.$Notice.warning({
              title: '账号权限变更',
              desc: `您的账号权限变更为<span style="color: #19be6b;">【${this.getUserRoleText(args.message.data.role)}】</span>，请重新登录`
            })
            utils.storage.clear()
            this.$router.replace('/login')
            // 断开socket.io连接
            this.$store.commit(types.DISCONNECT_SOCKETIO)
          }
        }
        if (this.loginInfo.phonenum === args.to.phonenum) {
          // 未读消息数量加1
          this.messageValue += 1
        }
      },
      logout () {
        if (!utils.isEmptyObj(this.loginInfo)) {
          utils.storage.clear()
          this.$Message.success('您已经退出')
          this.$router.replace('/login')
          // 断开socket.io连接
          this.$store.commit(types.DISCONNECT_SOCKETIO)
        }
      },
      navToUserSet (e) {
        this.$router.push(`/${e}`)
      },
      navToMessage () {
        this.$router.push(`/message`)
      }
    },
    components: {
      FullScreen
    }
  }
</script>
