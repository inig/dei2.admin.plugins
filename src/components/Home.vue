<template>
    <div class="layout" :class="{'layout-hide-text': spanLeft < 6}">
        <Row type="flex" class="h100p">
            <Col :span="spanLeft" class="layout-menu-left" :class="{'long': (spanLeft >= 6)}">
                <div class="layout-logo-left" :class="{'short': (spanLeft < 6)}" v-text="spanLeft < 6 ? shortAppName : appName"></div>
                <main-menu :plugins="loginInfo.plugins"></main-menu>
            </Col>
            <Col :span="spanRight">
                <div class="layout-header">
                    <!--<Button type="text" @click="toggleClick">-->
                        <!--<Icon type="navicon" size="32"></Icon>-->
                    <!--</Button>-->
                    <Poptip trigger="click" placement="bottom-end" width="200" class="user-badge">
                        <Badge dot>
                            <Avatar size="large" :src="loginInfo.gender == 1 ? assets.maleAvatar : assets.femaleAvatar" class="user-avatar"></Avatar>
                        </Badge>
                        <div class="api" slot="content">
                            <Card :bordered="false" :padding="0">
                                <p slot="title" v-text="loginInfo.username"></p>
                                <a href="#" slot="extra" @click.prevent="logout">
                                    退出
                                    <Icon type="log-out"></Icon>
                                </a>
                                <Menu width="200">
                                    <MenuItem name="1">
                                        <Icon type="clipboard"></Icon>
                                        个人中心
                                    </MenuItem>
                                    <MenuItem name="2">
                                        <Icon type="settings"></Icon>
                                        设置
                                    </MenuItem>
                                </Menu>
                            </Card>
                        </div>
                    </Poptip>
                </div>
                <div class="layout-breadcrumb" style="line-height: 32px;">
                    <Breadcrumb>
                        <BreadcrumbItem href="#">Index</BreadcrumbItem>
                        <BreadcrumbItem href="#">Apps</BreadcrumbItem>
                        <BreadcrumbItem>App</BreadcrumbItem>
                    </Breadcrumb>
                    <Input class="plugin-search"
                           :class="{'plugin-search-active': (pluginSearch.active || pluginSearch.text.trim() !== ''), 'plugin-search-inactive': (!pluginSearch.active && pluginSearch.text.trim() === '')}"
                           v-model="pluginSearch.text"
                           placeholder="插件搜索"
                           @on-focus="focusPluginSearch"
                           @on-blur="blurPluginSearch"
                           icon="ios-search-strong"/>
                </div>
                <div class="layout-content">
                    <transition name="content-router-transition"
                                enter-active-class="animated fadeIn"
                                leave-active-class="animated fadeOut"
                    >
                        <keep-alive>
                            <router-view class="content_router_view" name="ContentRouter"/>
                        </keep-alive>
                    </transition>
                </div>
                <div class="layout-copy">
                    2011-2018 &copy; {{author}}
                </div>
            </Col>
        </Row>
    </div>
</template>
<style>
    .h100p {
        height: 100%;
    }
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        height: 100%;
        width: 100%;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 200px;
        height: calc(100% - 165px);
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
        text-shadow: 0 1px 0 #ffffff;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        position: absolute;
        width: 100%;
        bottom: 0;
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        background: #464c5b;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
        display: flex;
        align-items: center;
    }
    .plugin-search {
        -webkit-tap-highlight-color: transparent;
        -webkit-user-select: none;
        -webkit-transition: width .3s cubic-bezier(.215,1.21,.355,1);
        -moz-transition: width .3s cubic-bezier(.215,1.21,.355,1);
        -ms-transition: width .3s cubic-bezier(.215,1.21,.355,1);
        -o-transition: width .3s cubic-bezier(.215,1.21,.355,1);
        transition: width .3s cubic-bezier(.215,1.21,.355,1);
        transform-origin: 0 50%;
        position: absolute;
        right: 15px;
        margin-top: -32px;
    }
    .plugin-search .ivu-input {
        border: none;
        /*border-radius: 0;*/
        /*border-bottom: 1px solid #dddee1;*/
    }
    .plugin-search-active {
        width: 200px;
    }
    .plugin-search-active .ivu-input:focus {
        border-color: #dddee1;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
    }
    .plugin-search-active .ivu-input:hover {
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
    }
    .plugin-search-inactive {
        width: 100px;
    }
    .plugin-search-inactive .ivu-input {
        border: none;
    }
    .plugin-search-inactive .ivu-input:hover {
        border-color: #dddee1;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
    }
    .user-badge {
        position: absolute;
        right: 30px;
        cursor: pointer;
    }
    .user-avatar {
        background-color: #87d068;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .layout-logo-left {
        width: 90%;
        height: 30px;
        /*background: #5b6270;*/
        border-radius: 3px;
        margin: 15px auto;
        color: #FFFFFF;
        line-height: 30px;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        text-shadow: 0 0 10px #ffffff;
        overflow: hidden;
    }
    .layout-logo-left.short {
        font-size: 12px;
    }

    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .layout-hide-text .layout-text{
        display: none;
    }
    .ivu-col{
        transition: width .2s cubic-bezier(.215,.61,.355,1);
    }
    .user-badge .ivu-poptip-body {
        padding: 0!important;
    }

    .content_router_view {
        width: 100%;
        height: 100%;
    }
</style>
<script>
  import utils from '../utils'
  import MainMenu from './MainMenu.vue'
  export default {
    name: 'Home',
    data () {
      return {
        author: this.$store.state.author,
        appName: this.$store.state.appName,
        shortAppName: this.$store.state.shortAppName,
        assets: this.$store.state.assets,
        pluginSearch: {
          text: '',
          active: false
        },
        spanLeft: 6,
        spanRight: 18
      }
    },
    computed: {
      iconSize () {
        return this.spanLeft === 6 ? 14 : 24
      },
      loginInfo () {
        return utils.storage.getItem(this.$store.state.localStorageKeys.userInfo)
      },
      currentPlugin () {
        return this.$route.params ? this.$route.params.pluginName : ''
      }
    },
    created () {
    },
    methods: {
      toggleClick () {
        if (this.spanLeft === 6) {
          this.spanLeft = 2
          this.spanRight = 22
        } else {
          this.spanLeft = 6
          this.spanRight = 18
        }
      },
      logout () {
        if (!utils.isEmptyObj(this.loginInfo)) {
          utils.storage.clear()
          this.$Message.success('您已经退出')
          this.$router.replace('/login')
        }
      },
      focusPluginSearch () {
        this.pluginSearch.active = true
      },
      blurPluginSearch () {
        this.pluginSearch.active = false
      },
      navToPluginView (e) {
        this.$router.replace(`/plugin/${e}`)
      }
    },
    components: {
      MainMenu
    }
  }
</script>
