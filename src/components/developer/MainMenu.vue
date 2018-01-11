<template>
    <Menu theme="dark" width="auto" class="main_menu_container" @on-select="navToPluginView" :active-name="`${currentPlugin}-${currentFileName}`">
      <MenuGroup title="我的插件">
        <Submenu v-for="(item, index) in allPlugins" :key="index" :name="item.name" v-if="loginInfo.phonenum == item.author">
          <template slot="title">
            <Icon type="ios-paper"></Icon>
            {{item.name}}
          </template>
          <MenuItem v-for="(itm, idx) in item.children" :key="idx" :name="item.name + '-' + itm">
            {{itm}}
          </MenuItem>
        </Submenu>
      </MenuGroup>
      <MenuGroup title="别人家的插件" style="border-top: 1px solid rgba(30, 36, 50, 0.1);">
        <Submenu v-for="(item, index) in allPlugins" :key="index" :name="item.name" v-if="loginInfo.phonenum != item.author">
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
</template>
<style>
.main_menu_container {
  /*top: 60px;*/
  /*overflow: auto;*/
}
</style>
<script>
  import * as types from '../../store/mutation-types'
  import utils from '../../utils/index'
  export default {
    name: 'MainMenu',
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
        this.$store.state.loaders[this.contentRouterViewLoader].show()
        this.$router.replace(`/plugin/${e.split('-')[0]}/${e.split('-')[1]}`)
      },
      async updatePluginList (args) {
        this.allPlugins = await this.getAllPlugins()
        this.$store.commit(types.SET_ALL_PLUGINS, {
          allPlugins: this.allPlugins
        })
      }
    },
    components: {}
  }
</script>
