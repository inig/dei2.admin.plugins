<template>
  <div class="article_header_container">
    <div class="article_header_top">
      <img class="article_header_top_logo" :src="assets.inigLogo">
      <div class="right_info_container">
        <!--<div class="head_icon_img_container" v-if="loginInfo.token">-->
          <!--<img class="head_icon_img" :src="loginInfo.headIcon || (loginInfo.gender == 1 ? assets.maleAvatar : assets.femaleAvatar)"/>-->
        <!--</div>-->
        <Poptip trigger="click" placement="bottom-end" width="200" class="user-badge" v-if="loginInfo.token">
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
            <!--<Menu width="200" @on-select="navToUserSet">-->
            <!--<MenuItem name="personal">-->
            <!--<Icon type="clipboard"></Icon>-->
            <!--个人中心-->
            <!--</MenuItem>-->
            <!--<MenuItem name="setting">-->
            <!--<Icon type="settings"></Icon>-->
            <!--设置-->
            <!--</MenuItem>-->
            <!--</Menu>-->
            </Card>
          </div>
        </Poptip>
        <div class="login_register_container" v-else @click="showPopup">
          <p>登录/注册</p>
        </div>
      </div>
    </div>
    <div class="full_screen_popup" :class="{shown: fullScreenPopup.shown}">
      <keep-alive>
        <login-or-register :action="action" @close="closePopup"></login-or-register>
      </keep-alive>
    </div>
  </div>
</template>
<style scoped>
  .article_header_container {
    width: 100%;
    height: 64px;
  }
  .article_header_top {
    width: 100%;
    height: 64px;
    background-color: #ffffff;
    padding: 0 8px;
    box-sizing: border-box;
    -webkit-box-shadow: 0 0 8px 1px #f5f5f5;
    -moz-box-shadow: 0 0 8px 1px #f5f5f5;
    box-shadow: 0 0 8px 1px #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .article_header_top_logo {
    height: 56px;
  }
  .right_info_container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .head_icon_img_container {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #eee;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .head_icon_img {
    width: 40px;
    height: 40px;
  }
  .login_register_container {
    font-size: 13px;
    margin-right: 10px;
  }

  .user-badge {
    /* position: absolute;
    right: 30px; */
    display: flex;
    align-items: center;
    height: 100%;
    margin-right: 10px;
    cursor: pointer;
  }
  .user-avatar {
    background-color: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .user-badge .ivu-poptip-body {
    padding: 0!important;
  }

  .full_screen_popup {
    position: fixed;
    z-index: 99999;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: transparent;
    -webkit-transform: translate(0, 100%);
    -moz-transform: translate(0, 100%);
    -ms-transform: translate(0, 100%);
    -o-transform: translate(0, 100%);
    transform: translate(0, 100%);
    -webkit-transition: all .2s cubic-bezier(0.215, 0.610, 0.355, 1.000);
    -moz-transition: all .2s cubic-bezier(0.215, 0.610, 0.355, 1.000);
    -ms-transition: all .2s cubic-bezier(0.215, 0.610, 0.355, 1.000);
    -o-transition: all .2s cubic-bezier(0.215, 0.610, 0.355, 1.000);
    transition: all .2s cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }
  .full_screen_popup.shown {
    -webkit-transform: translate(0, 0%);
    -moz-transform: translate(0, 0%);
    -ms-transform: translate(0, 0%);
    -o-transform: translate(0, 0%);
    transform: translate(0, 0%);
  }
</style>
<script>
  import utils from '../../../../utils/index'
  import * as types from '../../../../store/mutation-types'
  export default {
    name: 'FrontArticleHeader',
    data () {
      return {
        assets: this.$store.state.assets,
        fullScreenPopup: {
          shown: false
        },
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events,
        action: 'login'
      }
    },
    computed: {
      loginInfo () {
        return this.$store.state.loginInfo
      }
    },
    created () {
      const that = this
      this.eventHub.$on(this.events.frontArticleLogin, function () {
        that.action = 'login'
        that.showPopup()
      })
      this.eventHub.$on(this.events.frontArticleRegister, function () {
        that.action = 'register'
        that.showPopup()
      })
    },
    methods: {
      closePopup () {
        this.fullScreenPopup.shown = false
      },
      showPopup () {
        this.fullScreenPopup.shown = true
      },
      logout () {
        if (!utils.isEmptyObj(this.loginInfo)) {
          utils.storage.clear()
          this.$Message.success('您已经退出')
        }
        this.$store.commit(types.UPDATE_LOGIN_INFO, {})
      }
    },
    components: {
      LoginOrRegister: () => import('./LoginOrRegister.vue')
    }
  }
</script>
