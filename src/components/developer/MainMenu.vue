<template>
  <Menu theme="dark"
        width="auto"
        class="main_menu_container"
        @on-select="navToPluginView"
        :active-name="`${currentMenu}-${currentPlugin}-${currentFileName}`"
        :data-active-name="`${currentMenu}-${currentPlugin}-${currentFileName}`">
    <div v-for="(menuItem, menuIndex) in menuItems"
         :key="menuIndex">
      <Submenu :name="menuItem.name"
               v-if="!menuFold">
        <template slot="title">
          <Icon :type="menuItem.icon"></Icon>
          {{menuItem.text}}
        </template>
        <!-- 插件目录 -->
        <MenuGroup v-for="(group, groupIndex) in menuItem.children"
                   :key="groupIndex"
                   :title="group.text"
                   v-if="menuItem.name === 'plugin'">
          <Submenu v-for="(item, index) in allPlugins"
                   :key="index"
                   :name="'plugin'"
                   :data-name="'plugin'"
                   v-if="group.name === 'myPlugins' ? (loginInfo.phonenum == item.author && item.name.toLowerCase().indexOf(searchPluginName.toLowerCase()) > -1) : (loginInfo.phonenum != item.author && item.status === 3 && item.name.toLowerCase().indexOf(searchPluginName.toLowerCase()) > -1)">
            <template slot="title">
              <Icon type="stats-bars"></Icon>
              {{item.name}}
              <span class="plugin_status_tag"
                    :class="{'reject': (item.status === 0 || item.status === 2), 'inreview': (item.status === 1), 'passed': (item.status === 3)}">{{item.status | formatStatus}}</span>
            </template>
            <MenuItem v-for="(itm, idx) in item.children"
                      :key="idx"
                      :name="menuItem.name + '-' + item.name + '-' + itm"
                      :data-name="item.name + '-' + itm">
            {{itm}}
            </MenuItem>
          </Submenu>
        </MenuGroup>
        <MenuItem v-for="(subItem, subIndex) in menuItem.children"
                  :key="subIndex"
                  v-if="menuItem.name !== 'plugin'"
                  :name="menuItem.name + '-' + menuItem.name + '-' + subItem.name">{{subItem.text}}</MenuItem>
      </Submenu>
      <a href="javascript:"
         class="np side_menu_item"
         v-else>
        <Poptip trigger="hover"
                :transfer="true"
                class="icon_only"
                placement="right">
          <Icon :type="menuItem.icon"
                size="20"></Icon>
          <div class="api"
               slot="content">
            <div class="menu_dropdown_items">
              <div class="menu_dropdown_item"
                   v-for="(item, idx) in menuItem.children"
                   :key="idx"
                   :name="item.name"
                   v-text="item.text"
                   @click="navToPluginView(menuItem.name + '-' + item.name)"></div>
            </div>
          </div>
        </Poptip>
      </a>
    </div>
  </Menu>
</template>
<style scoped>
  .main_menu_container {
    /*top: 60px;*/
    /*overflow: auto;*/
    height: 100%;
    background-color: transparent;
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

  .side_menu_item {
    display: block;
    padding: 14px 0;
    outline: 0;
    list-style: none;
    font-size: 14px;
    position: relative;
    z-index: 1;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.7);
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }
  .side_menu_item:hover {
    color: rgba(255, 255, 255, 1);
  }

  .icon_only {
    display: inline-block;
    width: 100%;
    text-align: center;
  }
  .icon_only .ivu-poptip-rel {
    width: 100%;
  }
  .ivu-poptip-body {
    padding: 8px 0;
  }
  .np {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .menu_dropdown_items {
    line-height: normal;
    clear: both;
    color: rgb(73, 80, 96);
    white-space: nowrap;
    cursor: pointer;
    font-size: 12px;
    margin: 0px;
    /*padding: 7px 16px;*/
    list-style: none;
    transition: background 0.2s ease-in-out;
  }
  .menu_dropdown_item {
    /*background-color: rgba(169,134,255,0.38);*/
    margin: 0;
    line-height: normal;
    padding: 7px;
    clear: both;
    color: #495060;
    font-size: 12px !important;
    white-space: nowrap;
    list-style: none;
    cursor: pointer;
    -webkit-transition: background 0.2s ease-in-out;
    transition: background 0.2s ease-in-out;
  }
  .menu_dropdown_item:hover {
    background: #f3f3f3;
  }
</style>
<script>
  import * as types from '../../store/mutation-types'
  // import utils from '../../utils/index'
  export default {
    name: 'MainMenu',
    props: ['searchPluginName'],
    data () {
      return {
        allPlugins: [],
        // contentRouterViewLoader: this.$store.state.contentRouterViewLoader,
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events,
        socketEvents: this.$store.state.socketEvents,
        socket: this.$store.state.socket,
        requestInfo: this.$store.state.requestInfo,
        menuItems: [
          // {
          //   name: 'plugin',
          //   text: '插件管理',
          //   icon: 'wrench',
          //   children: [
          //     {
          //       name: 'myPlugins',
          //       text: '我的插件'
          //     },
          //     {
          //       name: 'otherPlugins',
          //       text: '别人的插件'
          //     }
          //   ]
          // },
          {
            name: 'component',
            text: '组件管理',
            icon: 'md-settings',
            children: [
              {
                name: 'index',
                text: '组件列表'
              }
            ]
          },
          {
            name: 'article',
            text: '文章管理',
            icon: 'md-albums',
            children: [
              {
                name: 'index',
                text: '文章列表'
              }
            ]
          }
        ]
      }
    },
    computed: {
      loginInfo () {
        return this.$store.state.loginInfo
      },
      currentMenu () {
        return this.$route.fullPath.split('/')[1]
      },
      contentRouterViewLoader () {
        return this.$store.state.contentRouterViewLoader
      },
      currentPlugin () {
        let _pluginName = this.$route.params.pluginName
        if (!_pluginName) {
          let _pathArr = this.$route.fullPath.split('/')
          if (_pathArr.length <= 3) {
            _pluginName = _pathArr[1]
          } else {
            _pluginName = _pathArr[2]
          }
        }
        return _pluginName
      },
      currentFileName () {
        let _fileName = this.$route.params.fileName
        if (!_fileName) {
          let _pathArr = this.$route.fullPath.split('/')
          if (_pathArr.length <= 3) {
            _fileName = _pathArr[2]
          } else {
            _fileName = _pathArr[3]
          }
        }
        return _fileName
      },
      menuFold () {
        return this.$store.state.menuFold
      }
    },
    async created () {
      // this.eventHub.$on(this.events.updatePluginList, await this.updatePluginList)
      // await this.updatePluginList()
      //      this.allPlugins = await this.getAllPlugins()
      //      this.$store.commit(types.SET_ALL_PLUGINS, {
      //        allPlugins: this.allPlugins
      //      })
      // this.$nextTick(() => {
      //   //        this.socket.client.off(this.socket.event)
      //   !this.socket.ban && this.socket.client.on(this.socket.event, this.getNewMessage)
      // })
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
        //        this.$router.replace(`/${e.split('-')[0]}/${e.split('-')[1]}/${e.split('-')[2]}`)
        let _targetPath = ''
        // if (e.split('-')[0] === 'plugin') {
        //   _targetPath = `/plugin/${e.split('-')[1]}/${e.split('-')[2]}/detail`
        // } else {
        //   _targetPath = `/${e.split('-')[1]}/${e.split('-')[2]}`
        // }
        let _tr = e.split('-').reverse()
        _targetPath += '/' + _tr[1] + '/' + _tr[0]
        if (this.$route.fullPath !== _targetPath) {
          // 跳转目录 跟 当前目录不一样，则跳转
          try {
            this.$store.state.loaders[this.contentRouterViewLoader].show()
          } catch (err) { }
          this.$router.replace(_targetPath)
        } else { }
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
    components: {}
  }
</script>
