<template>
  <div class="developer_side_menu_container">
    <div class="developer_side_menu_search_container">
      <Input class="developer_side_menu_search" placeholder="搜索插件名" v-model="searchPluginName"/>
    </div>
    <Menu theme="dark" width="auto" class="main_menu_container" @on-select="navToPluginView" :active-name="`${currentPlugin}-${currentFileName}`">
      <MenuGroup title="我的插件">
        <Submenu v-for="(item, index) in allPlugins" :key="index" :name="item.name" v-if="loginInfo.phonenum == item.author && item.name.toLowerCase().indexOf(searchPluginName.toLowerCase()) > -1">
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
        <Submenu v-for="(item, index) in allPlugins" :key="index" :name="item.name" v-if="loginInfo.phonenum != item.author && item.status === 3 && item.name.toLowerCase().indexOf(searchPluginName.toLowerCase()) > -1">
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
  .developer_side_menu_search_container {
    height: 48px;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .developer_side_menu_search {
    width: 80%;
  }
  .developer_side_menu_search .ivu-input {
    background-color: #363e4f;
    color: #ffffff;
    border: 1px solid #363e4f;
  }
    .main_menu_container {
      height: calc(100% - 60px - 48px);
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
  // import utils from '../../utils/index'
  import UploadPlugin from './UploadPlugin.vue'
  export default {
    name: 'SideMenu',
    data () {
      return {
        allPlugins: [],
        contentRouterViewLoader: this.$store.state.contentRouterViewLoader,
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events,
        socketEvents: this.$store.state.socketEvents,
        socket: this.$store.state.socket,
        requestInfo: this.$store.state.requestInfo,
        searchPluginName: ''
      }
    },
    computed: {
      loginInfo () {
        return this.$store.state.loginInfo
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
      this.$nextTick(() => {
//        this.socket.client.off(this.socket.event)
        this.socket.client.on(this.socket.event, this.getNewMessage)
      })
    },
    methods: {
      findPluginIndexByName (pluginName) {
        let _allPlugins = JSON.parse(JSON.stringify(this.allPlugins))
        let i = 0
        let outIndex = -1
        for (i; i < _allPlugins.length; i++) {
          if (String(_allPlugins[i].name) === String(pluginName)) {
            outIndex = i
            i = _allPlugins.length
          }
        }
        return outIndex
      },
      getNewMessage (args) {
        if (args.message.type === this.socketEvents.reviewPlugin) {
          let _newPluginInfo = JSON.parse(JSON.stringify(args.message.data))
          let _pluginIndex = this.findPluginIndexByName(_newPluginInfo.name)
          _newPluginInfo.children = [
            'index.vue',
            'package.json',
            'README.md'
          ]
          if (_pluginIndex > -1) {
            this.allPlugins.splice(_pluginIndex, 1, _newPluginInfo)
          }
          if (args.to.phonenum === this.loginInfo.phonenum) {
            if (args.message.data.status === 0 || args.message.data.status === 2) {
              this.$Notice.error({
                title: `插件${args.message.data.name}审核结果`,
                desc: `<span style="color: #ed3f14; font-weight: bolder; margin-left: -8px;">【${args.message.data.status === 0 ? '不可用' : '已拒绝'}】</span><br>${args.message.data.remarks || ''}`
              })
            } else if (args.message.data.status === 1) {
              this.$Notice.warning({
                desc: `插件${args.message.data.name}正在审核中，请耐心等待`
              })
            } else if (args.message.data.status === 3) {
              this.$Notice.success({
                title: `插件${args.message.data.name}审核结果`,
                desc: `<span style="color: #19be6b; font-weight: bolder; margin-left: -8px;">【已通过】</span>`
              })
            }
          }
        }
      },
      async getAllPlugins () {
        let pluginData = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.listPlugins,
          data: {
            type: 'all'
          }
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
