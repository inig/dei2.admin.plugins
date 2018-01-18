<template>
  <transition name="router-transition"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
    <div class="personal_center_container">
      <div v-if="editStatus" key="edit" class="personal_center_content personal_center_edit_content">
        <div class="user_avatar_wrap">
          <upload-avatar width="80" height="80">
            <img class="user_avatar" style="opacity: 1!important;" :src="cacheUserInfo.headIcon || (userInfo.gender == 1 ? assets.maleAvatar : assets.femaleAvatar)" alt="头像">
          </upload-avatar>
        </div>
        <Form :ref="userInfoFormRef" class="personal_center_form" :model="cacheUserInfo" label-position="left" :label-width="80">
          <FormItem label="用户名">
            <Input v-model="cacheUserInfo.username" type="text"/>
          </FormItem>
          <FormItem label="昵称">
            <Input v-model="cacheUserInfo.nickname" type="text"/>
          </FormItem>
          <FormItem label="邮箱">
            <Input v-model="cacheUserInfo.email" type="email"/>
          </FormItem>
          <FormItem label="手机">
            <p class="user_info_item">{{cacheUserInfo.phonenum}}</p>
          </FormItem>
          <FormItem label="生日">
            <DatePicker :value="birthdayFormat" @on-change="birthdayChange" format="yyyy-MM-dd" :clearable=false type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem label="性别">
            <RadioGroup v-model="cacheUserInfo.gender">
              <Radio class="user_gender" label="1">男</Radio>
              <Radio class="user_gender" label="2">女</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="个人网站">
            <Input v-model="cacheUserInfo.website"  type="text"/>
          </FormItem>
          <FormItem label="密码">
            <p class="user_info_item modify_password" @click="showModifyPassword">修改密码</p>
          </FormItem>
          <FormItem>
            <Button class="personal_center_cancel_btn" @click="cancelUpdateUserInfo" type="ghost" size="large">取消</Button>
            <Button class="personal_center_sure_btn" @click="updateUserInfo" type="primary" size="large">确定</Button>
          </FormItem>
        </Form>
      </div>
      <div v-else key="preview" class="personal_center_content personal_center_preview_content">
        <div class="personal_center_edit_icon" @click="editUserInfo">
          <Icon type="compose" size=30></Icon>
        </div>
        <div class="user_avatar_wrap">
          <img class="user_avatar" :src="userInfo.headIcon || (userInfo.gender == 1 ? assets.maleAvatar : assets.femaleAvatar)" alt="头像">
        </div>
        <Form class="personal_center_form" label-position="left" :label-width="80">
          <FormItem label="用户名">
            <p class="user_info_item">{{userInfo.username}}</p>
          </FormItem>
          <FormItem label="昵称">
            <p class="user_info_item">{{userInfo.nickname}}</p>
          </FormItem>
          <FormItem label="邮箱">
            <p class="user_info_item">{{userInfo.email}}</p>
          </FormItem>
          <FormItem label="手机">
            <p class="user_info_item">{{userInfo.phonenum}}</p>
          </FormItem>
          <FormItem label="生日">
            <p class="user_info_item">{{birthdayFormat}}</p>
          </FormItem>
          <FormItem label="性别">
            <p class="user_info_item">{{gender}}</p>
          </FormItem>
          <FormItem label="个人网站">
            <p class="user_info_item">{{userInfo.website}}</p>
          </FormItem>
        </Form>
      </div>
      <Modal
        v-model="modifyPasswordModal"
        title="修改密码"
        :closable='false'
        :mask-closable="false">
        <Form class="personal_center_form" :ref="passwordForm" :model="modifyPasswordForm" :rules="passwordValidate" label-position="right" :label-width="90">
          <FormItem label="原密码" prop="oldPass">
            <Input v-model="modifyPasswordForm.oldPass" placeholder="请输入原密码" type="text"/>
          </FormItem>
          <FormItem label="新密码" prop="newPass">
            <Input v-model="modifyPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" type="text"/>
          </FormItem>
          <FormItem label="确认新密码" prop="rePass">
            <Input v-model="modifyPasswordForm.rePass" placeholder="请再次输入新密码" type="text"/>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" @click="cancelModifyPass">取消</Button>
          <Button type="primary" :loading="savePassLoading" @click="saveModifyPass">保存</Button>
        </div>
      </Modal>
    </div>
  </transition>
</template>
<style>
  .personal_center_container {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding-top: 18px;
    padding-bottom: 2px;
    background-color: #fff;
    display: flex;
    justify-content: center;
  }
  .personal_center_content{
    width: 800px;
    height: 100%;
    /*border: 1px solid #eee;*/
    /*border-radius: 4px;*/
    /*box-shadow: 0 1px 6px rgba(0, 0, 0, .2);*/
    overflow: auto;
  }
  .personal_center_preview_content {
    position: relative;
  }
  .personal_center_edit_icon {
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    position: absolute;
    top: 30px;
    right: 30px;
    cursor: pointer;
    color: #909090
  }
  .user_avatar_wrap{
    width: 100%;
    height: 80px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .user_avatar {
    width: 80px;
    height: 80px;
    border-radius: 100%;
    border: 1px solid #ccc;
  }
  .personal_center_form {
    box-sizing: border-box;
    width: 100%;
    padding: 16px 40px 0;
    overflow: hidden;
  }
  .personal_center_sure_btn {
    margin-left: 30px;
  }
  .user_gender {
    margin-right: 30px;
  }
  .user_info_item {
    height: 33px;
    padding-left: 7px;
    font-size: 12px;
    border: 1px solid transparent;
  }
  .modify_password {
    width: 100px;
    color: #2d8cf0;
    cursor: pointer;
  }
</style>
<script>
//  import utils from '../../utils/index'
  import * as types from '../../store/mutation-types'
  import jwt from 'jsonwebtoken'
  import UploadAvatar from './UploadAvatar.vue'
  export default {
    name: 'personal',
    data () {
      const valideRePassword = (rule, value, callback) => {
        if (value !== this.modifyPasswordForm.newPass) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      const valideNewPassword = (rule, value, callback) => {
        if (value === this.modifyPasswordForm.oldPass) {
          callback(new Error('新密码不能和原密码一致'))
        } else {
          callback()
        }
      }
      return {
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events,
        editStatus: false,
        contentRouterViewLoader: this.$store.state.contentRouterViewLoader,
        userInfoFormRef: 'personalCenter',
        passwordForm: 'modifyForm',
        assets: this.$store.state.assets,
        localUserData: {},
        userInfo: {
          username: '',
          nickname: '',
          email: '',
          phonenum: '',
          headIcon: '',
          birthday: '',
          gender: 1,
          website: ''
        },
        cacheUserInfo: {
          username: '',
          nickname: '',
          email: '',
          phonenum: '',
          headIcon: '',
          birthday: '',
          gender: 1,
          website: ''
        },
        modifyPasswordModal: false,
        savePassLoading: false,
        modifyPasswordForm: {
          oldPass: '',
          newPass: '',
          rePass: ''
        },
        passwordValidate: {
          oldPass: [
            { required: true, message: '请输入原密码', trigger: 'blur' }
          ],
          newPass: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
            { validator: valideNewPassword, trigger: 'blur' }
          ],
          rePass: [
            { required: true, message: '请再次输入新密码', trigger: 'blur' },
            { validator: valideRePassword, trigger: 'blur' }
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
      },
      gender () {
        if (this.userInfo.gender) {
          return Number(this.userInfo.gender) === 1 ? '男' : '女'
        } else {
          return ''
        }
      }
    },
    created () {
      this.eventHub.$on(this.events.updateAvatar, this.updateAvatar)
      // 获取本地个人信息
      this.localUserData = this.$store.state.loginInfo
      // 获取数据库个人信息
      this.getUserInfo()
    },
    methods: {
      updateAvatar (args) {
        this.cacheUserInfo.headIcon = args.path
        this.userInfo.headIcon = args.path
        let _userInfo = JSON.parse(JSON.stringify(this.localUserData))
        _userInfo.headIcon = args.path
        this.$store.commit(types.UPDATE_LOGIN_INFO, _userInfo)
      },
      showModifyPassword () {
        this.modifyPasswordModal = true
        this.modifyPasswordForm = {
          oldPass: '',
          newPass: '',
          rePass: ''
        }
      },
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
      editUserInfo () {
        this.editStatus = true
        this.cacheUserInfo = JSON.parse(JSON.stringify(this.userInfo))
      },
      birthdayChange (date) {
        this.userInfo.birthday = +new Date(date)
        this.$Message.info(`birthday已修改为${date}`)
      },
      async getUserInfo () {
        const that = this
        if (!that._checkToken()) {
          that.$Message.error('登录过期，请重新登录!')
          that.$router.replace('/login')
          return false
        }
        await this.$store.dispatch(types.GET_USER_INFO, {
          token: that.localUserData.token,
          phonenum: that.localUserData.phonenum,
          callback (res) {
            if (res.data.needLogin) {
              that.$router.replace('/login')
              return false
            }
            if (res.status === 200) {
              let userDate = res.data
              for (const key in that.userInfo) {
                if (userDate.hasOwnProperty(key)) {
                  that.userInfo[key] = userDate[key]
                }
              }
              that.cacheUserInfo = JSON.parse(JSON.stringify(that.userInfo))
            }
          },
          error (err) {
            console.log('获取个人信息失败：' + err)
          }
        })
      },
      cancelUpdateUserInfo () {
        this.editStatus = false
      },
      async updateUserInfo () {
        const that = this
        if (!that._checkToken()) {
          that.$Message.error('登录过期，请重新登录!')
          that.$router.replace('/login')
          return false
        }
        await this.$store.dispatch(types.UPDATE_USER_INFO,
          Object.assign({}, that.cacheUserInfo, {
            token: that.localUserData.token,
            phonenum: that.localUserData.phonenum,
            callback (res) {
              if (res.data.needLogin) {
                that.$router.replace('/login')
                return false
              }
              if (res.status === 200) {
                let userDate = res.data
                // 更新个人信息后存储本地
                that.$store.commit(types.UPDATE_LOGIN_INFO, res.data)
//                utils.storage.setItem(that.$store.state.localStorageKeys.userInfo, res.data)
                for (const key in that.userInfo) {
                  if (userDate.hasOwnProperty(key)) {
                    that.userInfo[key] = userDate[key]
                  }
                }
                that.editStatus = false
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
      },
      cancelModifyPass () {
        this.modifyPasswordModal = false
        this.savePassLoading = true
      },
      saveModifyPass () {
        const that = this
        this.$refs[this.passwordForm].validate(async (valid) => {
          if (valid) {
            that.savePassLoading = true
            await this.$store.dispatch(types.MODIFY_PASSWORD,
              Object.assign({}, that.modifyPasswordForm, {
                token: that.localUserData.token,
                phonenum: that.localUserData.phonenum,
                callback (res) {
                  if (res.status === 200) {
                    that.modifyPasswordModal = false
                    that.savePassLoading = false
                    that.$Message.success('修改密码成功')
                  } else {
                    that.$Message.error('修改密码失败')
                  }
                },
                error (err) {
                  console.log(err)
                  that.$Message.error('修改密码失败')
                  that.savePassLoading = false
                }
              })
            )
          } else {
            that.$Message.warning('请正确填写每一项')
          }
        })
      }
    },
    components: {
      UploadAvatar
    }
  }
</script>
