<template>
  <div class="upload-plugin-container">
    <Upload
        multiple
        type="drag"
        :action="'https://talkapi.dei2.com/Zpm/plugin/uploadPlugin?phonenum=' + loginInfo.phonenum + '&token=' + loginInfo.token + '&ms=' + formData.maxSize + '&accept=' + formData.format.join(';')"
        :max-size="formData.maxSize"
        :format="formData.format"
        :on-exceeded-size="handleMaxSize"
        :on-format-error="handleFormatError"
        :on-success="uploadSuccess"
        :on-error="uploadFail"
        :before-upload="beforeUpload"
        >
        <div class="upload-plugin-area" :style="{height: height + 'px' || '300px', width: width + 'px' || '100%'}">
            <Icon type="plus-round" size="20"></Icon>
            <p class="ml10">新增插件</p>
        </div>
    </Upload>
  </div>
</template>
<style>
    .ml10 {
        margin-left: 10px;
    }
  .upload-plugin-container {
    width: 100%;
    height: 100%;
      border: none;
  }
  .upload-plugin-area {
    width: 100%;
    height: 300px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
  }
  .upload-plugin-container .ivu-upload-drag {
      border: none;
      border-radius: 0;
      background-color: rgba(0, 0, 0, .1);
  }
  .upload-plugin-container .ivu-upload-drag:hover {
      border: none;
  }
</style>
<script>
  // import utils from '../../utils/index'
  export default {
    name: 'UploadPlugin',
    props: ['width', 'height'],
    data () {
      return {
        formData: {
          maxSize: 5 * 1024,
          format: ['zip']
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
      },
      allPlugins () {
        return this.$store.state.allPlugins
      }
    },
    methods: {
      beforeUpload (file) {
//        let _pluginName = file.name.replace(/\.[a-z0-9]+$/i, '')
//        let _pluginIndex = this.findPluginIndexByName(_pluginName)
//        if (Number(_pluginIndex) > -1) {
//          // 已经存在
//          this.$Notice.warning({
//            title: '新增失败',
//            desc: '插件已经存在'
//          })
//        }
//        return false
        return true
      },
      findPluginIndexByName (pluginName) {
        let outPluginIndex = -1
        let allPlugins = this.allPlugins
        let i = 0
        for (i; i < allPlugins.length; i++) {
          if (allPlugins[i].name === pluginName) {
            outPluginIndex = i
            i = allPlugins.length
          }
        }
        return outPluginIndex
      },
      uploadSuccess (event, file, fileList) {
        if (Number(event.status) === 200) {
          this.$Notice.success({
            title: '文件上传成功',
            desc: file.name + '上传成功'
          })
          this.eventHub.$emit(this.events.updatePluginList, {
            plugin: event.data.plugin
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
          desc: file.name + '格式不正确，请上传' + (this.formData.format.join(';')) + '格式的文件'
        })
      }
    },
    created () {
      this.currentPlugin = this.$route.params.pluginName
      this.currentFileName = this.$route.params.fileName
    },
    components: {},
    watch: {
      '$route': function (value) {
        this.currentPlugin = value.params.pluginName
        this.currentFileName = value.params.fileName
      }
    }
  }
</script>
