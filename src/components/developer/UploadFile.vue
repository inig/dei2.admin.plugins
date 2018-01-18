<template>
  <div class="upload-file-container">
    <Upload
        multiple
        type="drag"
        :action="'https://talkapi.dei2.com/Zpm/plugin/upload?p=' + currentPlugin + '&phonenum=' + loginInfo.phonenum + '&token=' + loginInfo.token + '&ms=' + formData.maxSize + '&accept=' + formData.format.join(';')"
        :max-size="formData.maxSize"
        :format="formData.format"
        :on-exceeded-size="handleMaxSize"
        :on-format-error="handleFormatError"
        :on-success="uploadSuccess"
        :on-error="uploadFail"
        >
        <div class="upload-file-area" :style="{height: height + 'px' || '300px', width: width + 'px' || '100%'}">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或拖拽上传文件 (请上传 <span class="suffix_emphasize" v-text="fileSuffix.toUpperCase()"></span> 格式的文件)</p>
        </div>
    </Upload>
  </div>
</template>
<style scoped>
  .upload-file-container {
    width: 100%;
    height: 100%;
  }
  .upload-file-area {
    width: 100%;
    height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
  }
    .suffix_emphasize {
        color: #ee5500;
        font-size: 16px;
    }
</style>
<script>
  // import utils from '../../utils/index'
  export default {
    name: 'UploadFile',
    props: ['width', 'height'],
    data () {
      return {
        formData: {
          maxSize: 3 * 1024,
          format: []
        },
        currentPlugin: '',
        currentFileName: '',
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events
      }
    },
    computed: {
      loginInfo () {
        return this.$store.state.loginInfo
      },
      fileSuffix () {
        return '.' + this.currentFileName.split('.').pop()
      }
    },
    methods: {
      uploadSuccess (event, file, fileList) {
        if (Number(event.status) === 200) {
          this.$Notice.success({
            title: '文件上传成功',
            desc: file.name + '上传成功'
          })
          this.eventHub.$emit(this.events.updatePluginFileContent, {
            plugin: this.currentPlugin,
            filename: this.currentFileName
          })
        } else {
          this.$Notice.error({
            title: '文件上传失败',
            desc: file.name + '上传失败：' + event.message || ''
          })
          if (event.data.needLogin) {
            // 跳转至登录
            this.$router.replace('/login')
          }
        }
      },
      uploadFail (event, file, fileList) {
        this.$Notice.error({
          title: '文件上传失败',
          desc: file.name + '上传失败：' + event.message
        })
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '文件太大了',
          desc: '文件' + file.name + '太大，请不要超过' + (this.formData.maxSize / 1024) + 'M'
        })
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: file.name + '格式不正确，请上传' + (this.currentFileName.split('.').pop()) + '格式的文件'
        })
      }
    },
    created () {
      this.currentPlugin = this.$route.params.pluginName
      this.currentFileName = this.$route.params.fileName
      this.formData.format = [this.currentFileName.split('.').pop()]
    },
    components: {},
    watch: {
      '$route': function (value) {
        this.currentPlugin = value.params.pluginName
        this.currentFileName = value.params.fileName
        this.formData.format = [this.currentFileName.split('.').pop()]
      }
    }
  }
</script>
