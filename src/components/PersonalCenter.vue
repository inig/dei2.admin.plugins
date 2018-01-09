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
          <Form class="personal_center_form" :model="formLeft" label-position="left" :label-width="70">
            <FormItem label="用户名">
              <Input v-model="userInfo.username" type="text"></Input>
            </FormItem>
            <FormItem label="昵称">
              <Input v-model="userInfo.nickname" type="text"></Input>
            </FormItem>
            <FormItem label="邮箱">
              <Input v-model="userInfo.email" type="email"></Input>
            </FormItem>
            <FormItem label="手机">
              <Input v-model="userInfo.phonenum" disabled type="text"></Input>
            </FormItem>
            <FormItem label="生日" type="text">
              <Input v-model="birthdayFormat"></Input>
            </FormItem>
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
</style>
<script>
  import utils from '../utils/index'
  // import * as types from '../store/mutation-types'
  export default {
    name: 'PersonalCenter',
    data () {
      return {
        assets: this.$store.state.assets,
        userInfo: {
          name: 'wq',
          nickname: 'wwwww',
          email: 'test@email.com',
          phonenum: '15634839020',
          headIcon: '',
          birthday: '',
          website: 'http://plugins.admin.dei2.com'
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
          let D = date.getDate()
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
        this.userInfo = utils.storage.getItem(this.$store.state.localStorageKeys.userInfo)
      },
      cancelBtn () {
        this.$router.back(-1)
      },
      updataUserInfo () {

      }
    },
    watch: {
    },
    components: {}
  }
</script>
