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
                <FormItem label="生日" prop="email">
                  <DatePicker :value="birthdayFormat" format="yyyy-MM-dd" type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="性别" prop="gender">
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
              <Button class="personal_center_cancel_btn" @click="cancelBtn" type="ghost" size="large">取消</Button>
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
  // import * as types from '../store/mutation-types'
  export default {
    name: 'PersonalCenter',
    data () {
      return {
        formRef: 'personalCenter',
        assets: this.$store.state.assets,
        userInfo: {
          username: 'wq',
          nickname: 'wwwww',
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
              required: true,
              message: '此项为必填项',
              trigger: 'blur'
            },
            {
              type: 'email',
              required: true,
              message: '邮箱格式错误',
              trigger: 'blur'
            }
          ],
          gender: [
            {
              required: true,
              message: '此项为必填项',
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
      this.getUserInfo()
    },
    methods: {
      getUserInfo () {
        let userDate = Object.assign({}, utils.storage.getItem(this.$store.state.localStorageKeys.userInfo))
        for (const key in this.userInfo) {
          if (userDate.hasOwnProperty(key)) {
            this.userInfo[key] = userDate[key]
          }
        }
      },
      cancelBtn () {
        this.$router.back(-1)
      },
      updataUserInfo () {
        // console.log(this.userInfo)
        this.$refs[this.formRef].validate((valid) => {
          if (valid) {
            this.$Message.success('Success!')
          } else {
            this.$Message.error('Fail!')
          }
        })
        /* global.store.dispatch(types.UPDATE_USER_INFO, {
          callback (res) {

          },
          error (err) {

          }
        }) */
      }
    },
    watch: {
    },
    components: {}
  }
</script>
