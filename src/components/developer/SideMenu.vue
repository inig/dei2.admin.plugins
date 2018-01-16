<template>
  <div class="developer_side_menu_container">
    <Menu theme="dark" width="auto" class="main_menu_container" @on-select="navToPluginView" :active-name="`${currentPlugin}-${currentFileName}`">
      <MenuGroup title="我的插件">
        <Submenu v-for="(item, index) in allPlugins" :key="index" :name="item.name" v-if="loginInfo.phonenum == item.author">
          <template slot="title">
            <Icon type="ios-paper"></Icon>
            {{item.name}}
            <span class="plugin_status_tag" :class="{'reject': (item.status === 0 || item.status === 2), 'inreview': (item.status === 1), 'passed': (item.status === 3)}">{{item.status | formatStatus}}</span>
          </template>
          <MenuItem v-for="(itm, idx) in item.children" :key="idx" :name="item.name + '-' + itm">
            {{itm}}
          </MenuItem>
        </Submenu>
      </MenuGroup>
      <MenuGroup title="别人家的插件" style="border-top: 1px solid rgba(30, 36, 50, 0.1);">
        <Submenu v-for="(item, index) in allPlugins" :key="index" :name="item.name" v-if="loginInfo.phonenum != item.author && item.status === 3">
          <template slot="title">
            <Icon type="ios-paper"></Icon>
            {{item.name}}
          </template>
          <MenuItem v-for="(itm, idx) in item.children" :key="idx" :name="item.name + '-' + itm">
            {{itm}}
          </MenuItem>
        </Submenu>
      </MenuGroup>
    </Menu>
    <div class="add_new_plugin_container">
      <Tooltip class="tooltip_container" content="上传一个插件（*.zip）" placement="top">
        <upload-plugin height="60"></upload-plugin>
      </Tooltip>
    </div>
  </div>
</template>
<style>
  .developer_side_menu_container {
    width: 100%;
    height: 100%;
    background-color: transparent;
  }
    .main_menu_container {
      height: calc(100% - 60px);
      overflow-y: auto;
    }
    .plugin_status_tag {
        position: absolute;
        right: 50px;
        display: inline-block;
        padding: 0 5px;
        font-size: 10px;
        border-radius: 3px;
    }
    .plugin_status_tag.inreview {
        background-color: #ff9900;
    }
    .plugin_status_tag.passed {
        background-color: #19be6b;
    }
    .plugin_status_tag.reject {
        background-color: #ed3f14;
    }
  .add_new_plugin_container {
    position: absolute;
    width: 100%;
    bottom: 0;
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
</style>
<script>
  import * as types from '../../store/mutation-types'
  import utils from '../../utils/index'
  import UploadPlugin from './UploadPlugin.vue'
  export default {
    name: 'SideMenu',
    data () {
      return {
        allPlugins: [],
        contentRouterViewLoader: this.$store.state.contentRouterViewLoader,
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events
      }
    },
    computed: {
      loginInfo () {
        return utils.storage.getItem(this.$store.state.localStorageKeys.userInfo)
      },
      currentPlugin () {
        return this.$route.params.pluginName
      },
      currentFileName () {
        return this.$route.params.fileName
      }
    },
    async created () {
      this.eventHub.$on(this.events.updatePluginList, await this.updatePluginList)
      await this.updatePluginList()
//      this.allPlugins = await this.getAllPlugins()
//      this.$store.commit(types.SET_ALL_PLUGINS, {
//        allPlugins: this.allPlugins
//      })
    },
    methods: {
      async getAllPlugins () {
        let pluginData = await this.$store.dispatch(types.LIST_PLUGINS, {
          phonenum: this.loginInfo.phonenum,
          token: this.loginInfo.token,
          type: 'all'
        })
        let _otherPlugins = []
        if (Number(pluginData.status) === 200) {
          let i = 0
          for (i; i < pluginData.data.length; i++) {
            _otherPlugins.push({
              name: pluginData.data[i].name,
              author: pluginData.data[i].author,
              status: pluginData.data[i].status,
              children: ['index.vue', 'package.json', 'README.md']
            })
          }
        }
        return _otherPlugins
      },
      navToPluginView (e) {
        try {
          this.$store.state.loaders[this.contentRouterViewLoader].show()
        } catch (err) {}
        this.$router.replace(`/plugin/${e.split('-')[0]}/${e.split('-')[1]}`)
//        this.$router.replace({
//          path: 'Plugin',
//          params: {
//            pluginName: e.split('-')[0],
//            fileName: e.split('-')[1]
//          }
//        })
      },
      async updatePluginList (args) {
        this.allPlugins = await this.getAllPlugins()
        this.$store.commit(types.SET_ALL_PLUGINS, {
          allPlugins: this.allPlugins
        })
      }
    },
    filters: {
      formatStatus: function (value) {
        let outText = ''
        switch (String(value)) {
          case '0':
            // 不可用
            outText = '不可用'
            break
          case '1':
            // 已经提交审核
            outText = '审核中'
            break
          case '2':
            // 已拒绝
            outText = '已拒绝'
            break
          case '3':
            outText = '已通过'
            break
          default:
            break
        }
        return outText
      }
    },
    components: {
      UploadPlugin
    }
  }
</script>
