<template>
  <div class="app_main_content_blank_container">
    <div class="app_main_content_blank_wrapper">
      <p class="title">
        zpm_cli脚手架
        <span class="a_item">
          <a href="https://www.npmjs.com/package/zpm_cli">
            <svg viewBox="0 0 18 7">
              <path fill="#CB3837"
                    d="M0,0v6h5v1h4v-1h9v-6"></path>
              <path fill="#FFF"
                    d="M1,1v4h2v-3h1v3h1v-4h1v5h2v-4h1v2h-1v1h2v-4h1v4h2v-3h1v3h1v-3h1v3h1v-4"></path>
            </svg>
          </a>
        </span>
        <a class="a_item"
           style="color: #ffffff;"
           href="https://github.com/lsliangshan/zpm_cli">
          <Icon type="social-github"
                size="20">
          </Icon>
        </a>
      </p>
      <p class="sub_title">1. 全局安装zpm_cli</p>
      <pre class="beauty_code"><code>
sudo npm install zpm_cli -g
      </code></pre>
      <p class="sub_title">2. 创建新weex项目</p>
      <pre class="beauty_code"><code>
zpm init [, project_template] [, project_name] [, project_path]
      </code></pre>
      <!-- <button style="padding: 4px 20px; margin-top: 50px; background-color: transparent; color: #fff; border-radius: 5px;"
              @click="sm">发送消息</button> -->
    </div>
  </div>
</template>
<style scoped>
.a_item {
  display: inline-block;
  width: 40px;
  margin-left: 15px;
}
.app_main_content_blank_container {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: transparent;
}
.app_main_content_blank_wrapper {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: #464c5b;
  padding: 20px;
  color: #ffffff;
  overflow-y: auto;
}
.beauty_code {
  background-color: #363e4f;
  border-radius: 5px;
  overflow-x: auto;
  padding: 0 15px;
}
.title {
  font-size: 16px;
  font-weight: bold;
  line-height: 32px;
  margin-bottom: 16px;
}
.sub_title {
  font-size: 14px;
  font-weight: bold;
  line-height: 28px;
  margin-bottom: 8px;
  margin-top: 8px;
}
</style>
<script>
// import utils from '../utils'
import axios from 'axios'
import querystring from 'querystring'
import * as types from '../store/mutation-types'
export default {
  name: 'AppMainContentBlank',
  data () {
    return {
      users: [],
      getUserLoading: false,
      eventHub: this.$store.state.eventHub,
      events: this.$store.state.events,
      formData: {
        //          from: {
        //            username: '',
        //            phonenum: '',
        //            role: -1
        //          },
        to: {
          username: '',
          phonenum: '',
          role: -1
        },
        message: {
          title: '新消息',
          value: ''
        }
      },
      requestInfo: this.$store.state.requestInfo
    }
  },
  computed: {
    loginInfo () {
      //        let _loginInfo = this.$store.state.loginInfo
      //        this.formData.from = {
      //          username: _loginInfo.username,
      //          phonenum: _loginInfo.phonenum,
      //          role: _loginInfo.role
      //        }
      return this.$store.state.loginInfo
    },
    currentMainContent () {
      let _role = this.loginInfo.role
      let _currentMainContent = ''
      switch (_role) {
        case 1:
          _currentMainContent = 'RootMainContent'
          break
        case 2:
          _currentMainContent = 'AdminMainContent'
          break
        case 3:
          _currentMainContent = 'DeveloperMainContent'
          break
        case 4:
          _currentMainContent = 'UserMainContent'
          break
        default:
          break
      }
      return _currentMainContent
    }
  },
  created () {
    this.$nextTick(() => {
      this.eventHub.$off(this.events.getNewMessage)
      this.eventHub.$on(this.events.getNewMessage, this.getNewMessage)
    })
  },
  methods: {
    sm () {
      axios({
        method: 'post',
        baseURL: 'http://192.168.0.101:3000',
        url: '/enkel/index/sse',
        data: querystring.stringify({
          id: 'all',
          type: 'notification',
          data: JSON.stringify({
            name: 'ls',
            age: 30
          })
        })
      }).then(({ data }) => {
        console.log('response: ', data)
      })
    },
    chooseUser (evt) {
      if (evt > -1) {
        let chosenUser = this.users[Number(evt)]
        this.formData.to = {
          username: chosenUser.username,
          phonenum: chosenUser.phonenum,
          role: Number(chosenUser.role)
        }
      } else {
        this.formData.to = {
          username: '',
          phonenum: '',
          role: -1
        }
      }
    },
    findUserByPhonenum (phonenum) {
      let i = 0
      let outUser = {}
      let users = JSON.parse(JSON.stringify(this.users))
      for (i; i < users.length; i++) {
        if (String(users[i].phonenum) === String(phonenum)) {
          outUser = users[i]
          i = users.length
        }
      }
      return outUser
    },
    async getUsers (query) {
      if (query !== '') {
        this.getUserLoading = true
        let _queryData = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.queryUsers,
          data: {
            queryUsername: query.trim()
          }
        })
        this.users = _queryData.data.list || []
        this.getUserLoading = false
      } else {
        this.formData.to.phonenum = ''
        this.users = []
      }
    },
    async sendMessage () {
      console.log('发送消息: ', this.formData)
      //        let _formData = JSON.parse(JSON.stringify(this.formData))
      //        _formData.token = this.loginInfo.token
      //        _formData.phonenum = this.loginInfo.phonenum
      //        if (_formData.from) {
      //          _formData.from = JSON.stringify(_formData.from)
      //        }
      //        if (_formData.to) {
      //          _formData.to = JSON.stringify(_formData.to)
      //        }
      //        if (_formData.message) {
      //          _formData.message = JSON.stringify(_formData.message)
      //        }
      //        await this.$store.dispatch(types.SAVE_MESSAGE, _formData)
      this.$store.dispatch(types.SEND_MESSAGE, this.formData)
    },
    getNewMessage (evt) {
      //        console.log('.......获取到新消息：', evt)
      //        if (String(evt.to.phonenum) === String(this.loginInfo.phonenum)) {
      //          this.$Notice.success({
      //            title: evt.message.title || `来自于 ${evt.from.username} 的消息`,
      //            desc: evt.message.value
      //          })
      //        }
    }
  },
  components: {
    RootMainContent: () => import('./root/MainContent.vue'),
    AdminMainContent: () => import('./admin/MainContent.vue'),
    DeveloperMainContent: () => import('./developer/MainContent.vue')
  }
}
</script>
