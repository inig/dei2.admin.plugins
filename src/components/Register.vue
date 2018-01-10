<template>
    <transition name="router-transition"
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
    >
        <div class="register_container" @keyup.13="register">
            <Card :bordered="true" class="register_card">
                <p slot="title" v-text="appName"></p>
                <Form :ref="formRef" :model="formItems" :rules="formRules">
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
                <div class="register_bar">
                  <router-link to="/login">
                    <span>已有账号，去登录</span>
                  </router-link>
                </div>
            </Card>
        </div>
    </transition>
</template>
<style>
    .register_container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      background-image: url('https://static.dei2.com/plugins_admin/img/bg.jpg');
      background-size: cover;
      background-attachment: fixed;
      background-position: 50% 50%;
    }
    .register_card {
      width: 320px;
      margin-left: 18%;
    }
    .register_bar {
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
    name: 'Register',
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
        formRef: 'RegisterForm',
        appName: this.$store.state.appName,
        formItems: {
          user: '',
          password: ''
        },
        formRules: {
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
        isRegistering: false
      }
    },
    methods: {
      register () {
        const that = this
        if (this.isRegistering) return
        this.isRegistering = true
        this.$refs[this.formRef].validate((valid) => {
          if (valid) {
            this.isRegistering = false
            global.store.dispatch(types.REGISTER, {
              phonenum: this.formItems.user,
              password: this.formItems.password,
              callback (res) {
                if (Number(res.status) === 200) {
                  // 注册成功
                  that.$Message.success('注册成功!')
                  setTimeout(() => {
                    that.$router.replace('/login')
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
    watch: {
      'isRegistering': function (value) {
        if (value) {
          this.$Message.loading({
            content: '注册中，请稍后...',
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
