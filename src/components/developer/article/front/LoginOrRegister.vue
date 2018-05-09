<template>
  <div class="login_or_register_container">
    <div class="item_container login_container" v-if="actionType === types.LOGIN">
      <Card :bordered="false" dis-hover class="login_card">
        <p slot="title" style="color: #ffffff;" v-text="'登录' + appName"></p>
        <Form :ref="loginFormRef" :model="formItems" :rules="loginFormRules">
          <FormItem prop="user">
            <Input type="text" v-model="formItems.user" placeholder="用户名或手机号">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="formItems.password" placeholder="密码">
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
      </Card>
    </div>
    <div class="item_container register_container" v-if="actionType === types.REGISTER">
      <Card :bordered="false" dis-hover class="register_card">
        <p slot="title" style="color: #ffffff;" v-text="'注册' + appName"></p>
        <Form :ref="registerFormRef" :model="formItems" :rules="registerFormRules">
          <FormItem prop="user">
            <Input type="text" v-model="formItems.user" placeholder="手机号">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="text" v-model="formItems.password" placeholder="密码">
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Button type="primary" :loading="isRegistering" long @click="register">
              <span v-if="!isRegistering">注册</span>
              <span v-else>注册中</span>
            </Button>
          </FormItem>
        </Form>
      </Card>
    </div>
    <div class="close_container" @click="closeContainer">
      <Icon size="36" type="ios-close-empty" style="color: #ffffff;"></Icon>
    </div>
    <div class="action_change_container">
      <div class="go_register" v-if="actionType === types.LOGIN" @click="goRegister">去注册</div>
      <div class="go_login" v-if="actionType === types.REGISTER" @click="goLogin">已有账号，去登录</div>
    </div>
  </div>
</template>
<style scoped>
  .login_or_register_container {
    width: 100%;
    height: 100%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url("https://static.dei2.com/plugins_admin/assets/img/login_bg.jpg");
    background-size: cover;
    background-attachment: fixed;
    background-position: 50% 50%;
  }

  .item_container {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    /*background-color: rgba(255, 255, 255, 1);*/
  }

  .login_card {
    width: 320px;
    margin: 100px auto;
    text-align: center;
    background-color: transparent;
  }
  .login_bar {
    height: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .register_card {
    width: 320px;
    margin: 100px auto;
    text-align: center;
    background-color: transparent;
  }
  .register_bar {
    height: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .close_container {
    position: absolute;
    width: 30px;
    height: 30px;
    left: 10px;
    top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .close_container:active {
    opacity: 0.7;
  }

  .action_change_container {
    position: absolute;
    height: 30px;
    right: 20px;
    top: 10px;
    font-size: 13px;
    line-height: 30px;
    color: #2d8cf0;
    font-weight: bold;
  }
</style>
<script>
  import utils from '../../../../utils/index'
  import * as types from '../../../../store/mutation-types'
  export default {
    name: 'LoginOrRegister',
    props: {
      action: {
        type: String
      }
    },
    data () {
      const validatePhonenum = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'))
        } else {
          if (!value.match(/^1[345789]\d{9}$/)) {
            callback(new Error('手机号格式不正确'))
          }
          callback()
        }
      }
      return {
        types: {
          LOGIN: 'login',
          REGISTER: 'register'
        },
        actionType: this.action,
        loginFormRef: 'LoginForm',
        registerFormRef: 'RegisterForm',
        appName: this.$store.state.appName,
        formItems: {
          user: '',
          password: ''
        },
        loginFormRules: {
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
        registerFormRules: {
          user: [
            {
              validator: validatePhonenum,
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
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
        isLoggingIn: false,
        isRegistering: false
      }
    },
    methods: {
      closeContainer () {
        this.$emit('close')
      },
      goRegister () {
        this.actionType = this.types.REGISTER
      },
      goLogin () {
        this.actionType = this.types.LOGIN
      },
      resetFormItems () {
        this.formItems.password = ''
      },
      login () {
        const that = this
        if (this.isLoggingIn) return
        this.isLoggingIn = true
        this.$refs[this.loginFormRef].validate((valid) => {
          if (valid) {
            this.isLoggingIn = false
            global.store.dispatch(types.LOGIN, {
              username: this.formItems.user,
              password: this.formItems.password,
              callback (res) {
                that.resetFormItems()
                if (Number(res.status) === 200) {
                  // 登录成功
                  if (res.data.status === 1) {
                    that.$Message.success('登录成功!')
                    utils.storage.setItem(that.$store.state.localStorageKeys.userInfo, res.data)
                    that.$store.commit(types.UPDATE_LOGIN_INFO, res.data)
                    that.closeContainer()
                  } else {
                    utils.storage.removeItem(that.$store.state.localStorageKeys.userInfo)
                    that.$Notice.error({
                      title: '登录错误',
                      desc: '您的账号已经被锁定，请联系管理员'
                    })
                  }
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
      },
      register () {
        const that = this
        if (this.isRegistering) return
        this.isRegistering = true
        this.$refs[this.registerFormRef].validate((valid) => {
          if (valid) {
            this.isRegistering = false
            global.store.dispatch(types.REGISTER, {
              phonenum: this.formItems.user,
              password: this.formItems.password,
              callback (res) {
                that.resetFormItems()
                if (Number(res.status) === 200) {
                  // 注册成功
                  that.$Message.success('注册成功!')
                  setTimeout(() => {
                    that.goLogin()
                  }, 800)
                } else {
                  that.$Message.error('注册失败：' + res.message)
                }
              },
              error (err) {
                that.$Message.error('注册失败：' + err)
              }
            })
          } else {
            this.isRegistering = false
            this.$Message.error('表单填写不正确!')
          }
        })
      }
    },
    components: {}
  }
</script>
