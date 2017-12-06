<template>
    <transition name="router-transition"
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
    >
        <div class="login_container" @keyup.13="login">
            <Card :bordered="true" class="login_card">
                <p slot="title">ZPM_PLUGINS后台管理系统</p>
                <Form :ref="formRef" :model="formItems" :rules="formRules">
                    <FormItem prop="user">
                        <Input type="text" v-model="formItems.user" placeholder="用户名">
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
        justify-content: center;
    }
    .login_card {
        min-width: 320px;
    }
</style>
<script>
  export default {
    name: 'Login',
    data () {
      return {
        formRef: 'LoginForm',
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
        return (this.formItems.user === 'ls' && this.formItems.password === '123123')
      },
      login () {
        if (this.isLoggingIn) return
        this.isLoggingIn = true
        this.$refs[this.formRef].validate((valid) => {
          if (valid) {
            setTimeout(() => {
              this.isLoggingIn = false
              if (this.verifyUser()) {
                this.$Notice.success({
                  title: '登录成功!',
                  desc: ''
                })
                this.$Message.success('登录成功!')
                this.$router.push('/ss')
              } else {
                this.$Message.error('账号或密码不正确，请重试!')
              }
            }, 3000)
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
    },
    components: {}
  }
</script>
