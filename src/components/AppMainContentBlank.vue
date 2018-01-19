<template>
  <div class="app_main_content_blank_container">
    <div class="app_main_content_blank_wrapper">
      <Card :span="10" class="message_card" :bordered="true">
        <p slot="title">发消息</p>
        <Form :label-width="80">
          <FormItem label="发送给">
            <Select filterable
                    remote
                    :remote-method="getUsers"
                    :loading="getUserLoading"
                    @on-change="chooseUser"
            >
              <Option v-for="(item, index) in users" :key="index" :value="index">{{item.username}}</Option>
            </Select>
          </FormItem>
          <FormItem label="消息正文">
            <Input v-model="formData.message.value" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="想说点什么..."/>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="sendMessage">发送</Button>
            <Button type="ghost" style="margin-left: 8px;">取消</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  </div>
</template>
<style scoped>
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
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .message_card {
    width: 400px;
  }
</style>
<script>
  // import utils from '../utils'
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
