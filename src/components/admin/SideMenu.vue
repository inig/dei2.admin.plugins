<template>
    <div class="admin_side_menu_container">
        <!--<Menu theme="dark" width="auto" :active-name="activeName" @on-select="navToPage">-->
            <!--<MenuItem name="Plugins">-->
                <!--<Icon type="briefcase"></Icon>-->
                <!--插件管理-->
            <!--</MenuItem>-->
        <!--</Menu>-->
        <Menu theme="dark" width="auto" class="main_menu_container" @on-select="navToPluginView" :active-name="mainMenu + '-' + subMenu">
            <div v-for="(mainItem, index) in menuItems" :key="index">
                <Submenu :name="mainItem.name" v-if="!menuFold">
                    <template slot="title">
                        <Icon :type="mainItem.icon"></Icon>
                        <span v-text="mainItem.text"></span>
                    </template>
                    <MenuItem v-for="(item, idx) in mainItem.children" :key="idx" :name="mainItem.name + '-' + item.name" v-text="item.text"></MenuItem>
                </Submenu>
                <a href="javascript:" class="np side_menu_item" v-else>
                    <Poptip trigger="hover" :transfer="true" class="icon_only" placement="right">
                        <Icon :type="mainItem.icon" size="28"></Icon>
                        <div class="api" slot="content">
                            <div class="menu_dropdown_items">
                                <div class="menu_dropdown_item" v-for="(item, idx) in mainItem.children" :key="idx" :name="item.name" v-text="item.text" @click="navToPluginView(mainItem.name + '-' + item.name)"></div>
                            </div>
                        </div>
                    </Poptip>
                </a>
            </div>
        </Menu>
    </div>
</template>
<style scoped>
    .admin_side_menu_container {
        width: 100%;
        height: 100%;
        background-color: transparent;
    }
    .main_menu_container {
        height: 100%;
        overflow-y: auto;
    }
    .admin_side_menu_container .icon_only {
        display: inline-block;
        width: 100%;
        text-align: center;
    }
    .admin_side_menu_container .icon_only .ivu-poptip-rel {
        width: 100%;
    }
    .admin_side_menu_container .ivu-poptip-body {
        padding: 8px 0;
    }
    .admin_side_menu_container .np {
        padding-left: 0!important;
        padding-right: 0!important;
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
        font-size: 12px!important;
        white-space: nowrap;
        list-style: none;
        cursor: pointer;
        -webkit-transition: background .2s ease-in-out;
        transition: background .2s ease-in-out;
    }
    .menu_dropdown_item:hover {
        background: #f3f3f3;
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
        color: rgba(255, 255, 255, .7);
        -webkit-transition: all .2s ease-in-out;
        transition: all .2s ease-in-out;
    }
    .side_menu_item:hover {
        color: rgba(255, 255, 255, 1);
    }
</style>
<script>
  export default {
    name: 'SideMenu',
    data () {
      return {
        menuItems: [
          {
            name: 'plugins',
            text: '插件',
            icon: 'briefcase',
            children: [
              {
                name: 'index',
                text: '插件管理'
              }
            ]
          }
        ]
      }
    },
    computed: {
      activeName () {
        return this.$route.name || ''
      },
      mainMenu () {
        return this.$route.path.split('/')[1]
      },
      subMenu () {
        return this.$route.path.split('/')[2]
      },
      menuFold () {
        return this.$store.state.menuFold
      }
    },
    methods: {
      navToPage (evt) {
        this.$router.replace(evt)
      },
      navToPluginView (e) {
        this.$router.replace(`/${e.split('-')[0]}/${e.split('-')[1]}`)
      }
    },
    components: {}
  }
</script>
