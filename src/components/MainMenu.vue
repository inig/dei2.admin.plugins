<template>
    <Menu theme="dark" width="auto" @on-select="navToPluginView" :active-name="currentPlugin">
      <MenuGroup title="我的插件">
        <Submenu v-for="(item, index) in myPlugins" :key="index" :name="item.name">
          <template slot="title">
            <Icon type="ios-paper"></Icon>
            {{item.name}}
          </template>
          <MenuItem v-for="(itm, idx) in item.children" :key="idx" :name="item.name + '-' + itm">
            {{itm}}
          </MenuItem>
        </Submenu>
      </MenuGroup>
      <MenuGroup title="别人家的插件">
        <Submenu v-for="(item, index) in otherPlugins" :key="index" :name="item.name">
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

</style>
<script>
  import * as types from '../store/mutation-types'
  import utils from '../utils'
  export default {
    props: ['plugins'],
    name: 'MainMenu',
    data () {
      return {
        otherPlugins: []
      }
    },
    computed: {
      loginInfo () {
        return utils.storage.getItem(this.$store.state.localStorageKeys.userInfo)
      },
      myPlugins () {
        if (this.plugins === '') {
          return []
        }
        let _plugins = this.plugins.split(';')
        let _myPlugins = []
        let i = 0
        for (i; i < _plugins.length; i++) {
          _myPlugins.push({
            name: _plugins[i],
            children: ['index.vue', 'package.json', 'README.md']
          })
        }
        return _myPlugins
      }
    },
    async created () {
      this.otherPlugins = await this.getOtherPlugins()
    },
    methods: {
      async getOtherPlugins () {
        let pluginData = await this.$store.dispatch(types.LIST_PLUGINS, {
          phonenum: this.loginInfo.phonenum,
          token: this.loginInfo.token,
          type: 'other'
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
        this.$router.replace(`/plugin/${e.split('-')[0]}/${e.split('-')[1]}`)
      }
    },
    components: {}
  }
</script>
