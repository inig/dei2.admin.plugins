<template>
    <div class="layout" :class="{'layout-hide-text': spanLeft < 6}">
        <Row type="flex" class="h100p">
            <Col :span="spanLeft" class="layout-menu-left" :class="{'long': (spanLeft >= 6)}">
                <router-link :to="{path: '/'}">
                    <div class="layout-logo-left" :class="{'short': (spanLeft < 6)}" v-text="spanLeft < 6 ? shortAppName : appName"></div>
                </router-link>
                <div class="main_menu_wrapper">
                    <main-menu></main-menu>
                </div>
                <div class="add_new_plugin_container">
                    <Tooltip class="tooltip_container" content="上传一个插件（*.zip）" placement="top">
                        <upload-plugin height="60"></upload-plugin>
                    </Tooltip>
                </div>
            </Col>
            <Col :span="spanRight">
                <div class="layout-header">
                    <!--<Button type="text" @click="toggleClick">-->
                        <!--<Icon type="navicon" size="32"></Icon>-->
                    <!--</Button>-->
                    <Poptip trigger="click" placement="bottom-end" width="200" class="user-badge">
                        <Badge dot>
                            <Avatar size="large" :src="newAvatar || loginInfo.headIcon || (loginInfo.gender == 1 ? assets.maleAvatar : assets.femaleAvatar)" class="user-avatar"></Avatar>
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
                <!--<div class="layout-breadcrumb" style="line-height: 32px;">-->
                    <!--<Breadcrumb>-->
                        <!--<BreadcrumbItem href="#">Index</BreadcrumbItem>-->
                        <!--<BreadcrumbItem href="#">Apps</BreadcrumbItem>-->
                        <!--<BreadcrumbItem>App</BreadcrumbItem>-->
                    <!--</Breadcrumb>-->
                    <!--<Input class="plugin-search"-->
                           <!--:class="{'plugin-search-active': (pluginSearch.active || pluginSearch.text.trim() !== ''), 'plugin-search-inactive': (!pluginSearch.active && pluginSearch.text.trim() === '')}"-->
                           <!--v-model="pluginSearch.text"-->
                           <!--placeholder="插件搜索"-->
                           <!--@on-focus="focusPluginSearch"-->
                           <!--@on-blur="blurPluginSearch"-->
                           <!--icon="ios-search-strong"/>-->
                <!--</div>-->
                <div class="layout-content">
                    <transition
                            name="file-upload-transition"
                            enter-active-class="animated fadeIn"
                            leave-active-class="animated fadeOut"
                    >
                        <div class="file_uploader_container" v-if="showFileUploader">
                            <upload-file height="100"></upload-file>
                        </div>
                    </transition>
                    <transition name="content-router-transition"
                                enter-active-class="animated fadeIn"
                                leave-active-class="animated fadeOut"
                    >
                        <keep-alive>
                            <router-view class="content_router_view" :style="{height: showFileUploader ? 'calc(100% - 100px)' : '100%'}" name="ContentRouter"/>
                        </keep-alive>
                    </transition>
                    <loading class="layout-content-loader" :data-ref="contentRouterViewLoader"></loading>
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
        position: relative;
        min-height: 200px;
        height: calc(100% - 90px);
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
        text-shadow: 0 1px 0 #ffffff;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-content-loader {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 999;
        background-color: rgba(0, 0, 0, 0.8);
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
    .layout-logo-left.short {
        font-size: 12px;
    }
    .main_menu_wrapper {
        height: calc(100% - 60px - 60px);
        overflow-y: auto;
    }
    .add_new_plugin_container {
        height: 60px;
        cursor: pointer;
        border-top: 1px solid rgba(0, 0, 0, .1);
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.7);
    }
    .tooltip_container {
        width: 100%;
        height: 60px;
    }
    .tooltip_container .ivu-tooltip-rel {
        width: 100%;
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

    .file_uploader_container {
        width: 100%;
        height: 102px;
    }
    .content_router_view {
        width: 100%;
    }
</style>
<script>
  import utils from '../../utils'
  import MainMenu from './MainMenu.vue'
  import UploadFile from './UploadFile.vue'
  import UploadPlugin from './UploadPlugin.vue'
  import Loading from '../Loading.vue'
  export default {
    name: 'Home',
    data () {
      return {
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events,
        contentRouterViewLoader: this.$store.state.contentRouterViewLoader,
        author: this.$store.state.author,
        appName: this.$store.state.appName,
        shortAppName: this.$store.state.shortAppName,
        assets: this.$store.state.assets,
        pluginSearch: {
          text: '',
          active: false
        },
        showFileUploader: false, // 是否显示文件上传控件
        spanLeft: 6,
        spanRight: 18,
        currentPlugin: '',
        currentFileName: '',
        newAvatar: ''
      }
    },
    computed: {
      iconSize () {
        return this.spanLeft === 6 ? 14 : 24
      },
      loginInfo () {
        return utils.storage.getItem(this.$store.state.localStorageKeys.userInfo)
      },
      allPlugins () {
        return this.$store.state.allPlugins
      }
    },
    created () {
      this.eventHub.$on(this.events.updateAvatar, this.updateAvatar)
    },
    methods: {
      updateAvatar (args) {
        this.newAvatar = args.path
      },
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
      },
      findPluginInfoByName (pluginName) {
        let outPlugin = {}
        let allPlugins = this.allPlugins
        let i = 0
        for (i; i < allPlugins.length; i++) {
          if (allPlugins[i].name === pluginName) {
            outPlugin = allPlugins[i]
            i = allPlugins.length
          }
        }
        return outPlugin
      },
      navToUserSet (e) {
        this.$router.push(`/${e}`)
      }
    },
    components: {
      MainMenu,
      UploadFile,
      Loading,
      UploadPlugin
    },
    watch: {
      '$route': function (value) {
        this.currentPlugin = value.params.pluginName
        this.currentFileName = value.params.fileName
        let pluginInfo = this.findPluginInfoByName(this.currentPlugin)
        this.showFileUploader = (String(pluginInfo.author) === String(this.loginInfo.phonenum))
      }
    }
  }
</script>
