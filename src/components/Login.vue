<template>
    <transition name="router-transition"
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
    >
        <div class="login_container" @keyup.13="login">
            <Card :bordered="true" class="login_card">
                <p slot="title" v-text="appName"></p>
                <Form :ref="formRef" :model="formItems" :rules="formRules">
                    <FormItem prop="user">
                        <Input type="text" v-model="formItems.user" placeholder="用户名或手机号">
                            <Icon type="ios-person-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="password">
                        <Input type="text" v-model="formItems.password" placeholder="密码">
                            <Icon type="ios-locked-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" :loading="isLoggingIn" long @click="login">
                            <span v-if="!isLoggingIn">登录</span>
                            <span v-else>登录中</span>
                        </Button>
                    </FormItem>
                </Form>
                <div class="login_bar">
                  <!-- <router-link to="/register">
                    <span>忘记密码</span>
                  </router-link> -->
                  <router-link to="/register">
                    <span>注册</span>
                  </router-link>
                </div>
            </Card>
        </div>
    </transition>
</template>
<style>
    .login_container {
        width: 100%;
        height: 100%;
        background-color: #f5f5f5;
        display: flex;
        align-items: center;
        background-image: url('https://static.dei2.com/plugins_admin/img/bg.jpg');
        background-size: cover;
        background-attachment: fixed;
        background-position: 50% 50%;
    }
    .login_card {
        width: 320px;
        margin-left: 18%;
    }
    .login_bar {
      height: 20px;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
</style>
<script>
  import utils from '../utils/index'
  import * as types from '../store/mutation-types'
  export default {
    name: 'Login',
    data () {
      return {
        formRef: 'LoginForm',
        appName: this.$store.state.appName,
        formItems: {
          user: '',
          password: ''
        },
        formRules: {
          user: [
            {
              required: true,
              message: '请输入您的用户名',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入您的密码',
              trigger: 'blur'
            },
            {
              type: 'string',
              min: 6,
              message: '密码最少6位',
              trigger: 'blur'
            }
          ]
        },
        isLoggingIn: false
      }
    },
    methods: {
      verifyUser () {
        return (this.formItems.user === this.$store.state.username && this.formItems.password === this.$store.state.password)
      },
      login () {
        const that = this
        if (this.isLoggingIn) return
        this.isLoggingIn = true
        this.$refs[this.formRef].validate((valid) => {
          if (valid) {
            this.isLoggingIn = false
            global.store.dispatch(types.LOGIN, {
              username: this.formItems.user,
              password: this.formItems.password,
              callback (res) {
                if (Number(res.status) === 200) {
                  // 登录成功
                  that.$Message.success('登录成功!')
                  that.$router.replace('/')
                  utils.storage.setItem(that.$store.state.localStorageKeys.userInfo, res.data)
                } else {
                  that.$Message.error('登录失败：' + res.message)
                }
              },
              error (err) {
                that.$Message.error('登录失败：' + err)
              }
            })
          } else {
            this.isLoggingIn = false
            this.$Message.error('表单填写不正确!')
          }
        })
      }
    },
    watch: {
      'isLoggingIn': function (value) {
        if (value) {
          this.$Message.loading({
            content: '登录中，请稍后...',
            duration: 2
          })
        } else {
        }
      }
    },
    created () {
      let _localUserInfo = utils.storage.getItem(this.$store.state.localStorageKeys.userInfo)
      if (!utils.isEmptyObj(_localUserInfo)) {
        this.formItems.user = _localUserInfo.username
      }
    },
    components: {}
  }
</script>
