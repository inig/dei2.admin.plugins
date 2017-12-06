<template>
    <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
        <Row type="flex" class="h100p">
            <Col :span="spanLeft" class="layout-menu-left">
                <div class="layout-logo-left" :class="{'short': (spanLeft < 5)}" v-text="spanLeft < 5 ? shortAppName : appName"></div>
                <Menu active-name="1" theme="dark" width="auto">
                    <MenuItem name="1">
                        <Icon type="ios-navigate" :size="iconSize"></Icon>
                        <span class="layout-text">Option 1</span>
                    </MenuItem>
                    <MenuItem name="2">
                        <Icon type="ios-keypad" :size="iconSize"></Icon>
                        <span class="layout-text">Option 2</span>
                    </MenuItem>
                    <MenuItem name="3">
                        <Icon type="ios-analytics" :size="iconSize"></Icon>
                        <span class="layout-text">Option 3</span>
                    </MenuItem>
                </Menu>
            </Col>
            <Col :span="spanRight">
                <div class="layout-header">
                    <Button type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                    <Badge dot class="user-badge">
                        <Avatar size="large" :src="assets.maleAvatar" class="user-avatar"></Avatar>
                    </Badge>
                </div>
                <div class="layout-breadcrumb">
                    <Breadcrumb>
                        <BreadcrumbItem href="#">Index</BreadcrumbItem>
                        <BreadcrumbItem href="#">Apps</BreadcrumbItem>
                        <BreadcrumbItem>App</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <div class="layout-content">
                    <div class="layout-content-main">Content</div>
                </div>
                <div class="layout-copy">
                    2011-2018 &copy; Keith
                </div>
            </Col>
        </Row>
    </div>
</template>
<style scoped>
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
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
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
        transition: width .2s ease-in-out;
    }
</style>
<script>
  import utils from '../utils'
  export default {
    name: 'Home',
    data () {
      return {
        appName: this.$store.state.appName,
        shortAppName: this.$store.state.shortAppName,
        assets: this.$store.state.assets,
        spanLeft: 5,
        spanRight: 19
      }
    },
    computed: {
      iconSize () {
        return this.spanLeft === 5 ? 14 : 24
      },
      loginInfo () {
        return utils.storage.getItem(this.$store.state.localStorageKeys.userInfo)
      }
    },
    methods: {
      toggleClick () {
        if (this.spanLeft === 5) {
          this.spanLeft = 2
          this.spanRight = 22
        } else {
          this.spanLeft = 5
          this.spanRight = 19
        }
      }
    },
    components: {}
  }
</script>
