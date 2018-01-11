<template>
    <transition name="router-transition"
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div class="personal_center_container">
        <div class="personal_center_content">
          <div class="user_avatar_wrap">
            <img class="user_avatar" :src="userInfo.headIcon || (userInfo.gender == 1 ? assets.maleAvatar : assets.femaleAvatar)" alt="头像">
          </div>
          <Form :ref="formRef" class="personal_center_form" :model="userInfo" :rules="userInfoValidate" label-position="left" :label-width="70">
            <FormItem label="用户名" prop="username">
              <Input v-model="userInfo.username" type="text"></Input>
            </FormItem>
            <FormItem label="昵称" prop="nickname">
              <Input v-model="userInfo.nickname" type="text"></Input>
            </FormItem>
            <FormItem label="邮箱" prop="email">
              <Input v-model="userInfo.email" type="email"></Input>
            </FormItem>
            <FormItem label="手机">
              <p>{{userInfo.phonenum}}</p>
              <!-- <Input v-model="userInfo.phonenum" disabled type="text"></Input> -->
            </FormItem>
            <Row>
              <Col span="12">
                <FormItem label="生日">
                  <DatePicker :value="birthdayFormat" @on-change="birthdayChange" format="yyyy-MM-dd" :clearable=false type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="性别">
                  <RadioGroup v-model="userInfo.gender">
                    <Radio class="user_gender" label="1">男</Radio>
                    <Radio class="user_gender" label="2">女</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <FormItem label="个人网站">
              <Input v-model="userInfo.website"  type="text"></Input>
            </FormItem>
            <FormItem>
              <Button class="personal_center_cancel_btn" @click="cancelUpdataUserInfo" type="ghost" size="large">取消</Button>
              <Button class="personal_center_sure_btn" @click="updataUserInfo" type="primary" size="large">确定</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </transition>
</template>
<style>
    .personal_center_container {
      width: 100%;
      height: 100%;
      padding-top: 20px;
      overflow-y: auto;
      background-color: #fff;
      display: flex;
      justify-content: center;
    }
    .personal_center_content{
      width: 800px;
      height: 800px;
      border: 1px solid #eee;
      border-radius: 4px;
      box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .user_avatar_wrap{
      width: 80px;
      height: 80px;
      margin-top: 30px;
      border-radius: 100%;
      border: 1px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .user_avatar {
      width: 80px;
      height: 80px;
    }
    .personal_center_form {
      width: 100%;
      padding: 30px 40px;
    }
    .personal_center_sure_btn {
      margin-left: 30px;
    }
    .user_gender {
      margin-right: 30px;
    }
</style>
<script>
  import utils from '../utils/index'
  import * as types from '../store/mutation-types'
  import jwt from 'jsonwebtoken'
  export default {
    name: 'PersonalCenter',
    data () {
      return {
        contentRouterViewLoader: this.$store.state.contentRouterViewLoader,
        formRef: 'personalCenter',
        assets: this.$store.state.assets,
        localUserData: {},
        userInfo: {
          username: 'wq',
          nickname: 'www',
          email: 'test@email.com',
          phonenum: '15634839020',
          headIcon: '',
          birthday: '',
          gender: 1,
          website: 'http://plugins.admin.dei2.com'
        },
        userInfoValidate: {
          username: [
            {
              required: true,
              message: '此项为必填项',
              trigger: 'blur'
            }
          ],
          nickname: [
            {
              required: true,
              message: '此项为必填项',
              trigger: 'blur'
            }
          ],
          email: [
            {
              type: 'email',
              required: true,
              message: '邮箱格式错误',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    computed: {
      birthdayFormat () {
        let outData = ''
        if (this.userInfo.birthday) {
          let date = new Date(Number(this.userInfo.birthday))
          let Y = date.getFullYear()
          let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
          let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
          outData = `${Y}-${M}-${D}`
        }
        return outData
      }
    },
    created () {
      this.$Message.config({
        top: 50,
        duration: 2.5
      })
      // 获取本地个人信息
      this.localUserData = utils.storage.getItem(this.$store.state.localStorageKeys.userInfo)
      // 获取数据库个人信息
      this.getUserInfo()
    },
    methods: {
      _checkToken () {
        const that = this
        const secret = 'com.dei2'
        let tokenStatus = jwt.verify(that.localUserData.token, secret, function (err, decoded) {
          return err || {}
        })
        if (tokenStatus.name === 'TokenExpiredError') {
          return false
        } else {
          return true
        }
      },
      birthdayChange (date) {
        this.userInfo.birthday = +new Date(date)
        console.log(this.userInfo.birthday)
        this.$Message.info(`birthday已修改为${date}`)
      },
      async getUserInfo () {
        const that = this
        if (!that._checkToken()) {
          that.$Message.error('登录过期，请重新登录!')
          return false
        }
        await global.store.dispatch(types.GET_USER_INFO, {
          token: that.localUserData.token,
          phonenum: that.localUserData.phonenum,
          callback (res) {
            if (res.status === 200) {
              let userDate = res.data
              for (const key in that.userInfo) {
                if (userDate.hasOwnProperty(key)) {
                  that.userInfo[key] = userDate[key]
                }
              }
            }
          },
          error (err) {
            console.log('获取个人信息失败：' + err)
          }
        })
      },
      cancelUpdataUserInfo () {
        this.$router.back(-1)
      },
      updataUserInfo () {
        const that = this
        that.$refs[that.formRef].validate(async (valid) => {
          console.log('表单数据：', that.userInfo)
          if (valid) {
            if (!that._checkToken()) {
              that.$Message.error('登录过期，请重新登录!')
              return false
            }
            await global.store.dispatch(types.UPDATE_USER_INFO,
              Object.assign({}, that.userInfo, {
                token: that.localUserData.token,
                phonenum: that.localUserData.phonenum,
                callback (res) {
                  console.log('更新：', res)
                  if (res.status === 200) {
                    let userDate = res.data
                    // 更新个人信息后存储本地
                    utils.storage.setItem(that.$store.state.localStorageKeys.userInfo, res.data)
                    for (const key in that.userInfo) {
                      if (userDate.hasOwnProperty(key)) {
                        that.userInfo[key] = userDate[key]
                      }
                    }
                    that.$Message.success('修改成功')
                  } else {
                    that.$Message.error('修改失败')
                  }
                },
                error (err) {
                  console.log(err)
                  that.$Message.error('修改失败')
                }
              })
            )
          } else {
            that.$Message.warning('请正确填写每一项')
          }
        })
      }
    },
    watch: {
      /* '$route': function (value) {
        this.$store.state.loaders[this.contentRouterViewLoader].hide()
      } */
    },
    components: {}
  }
</script>
