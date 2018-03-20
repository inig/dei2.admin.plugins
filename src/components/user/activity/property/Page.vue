<template>
  <div class="property_page_container">
    <Tabs value="styles">
      <TabPane label="样式" name="styles">
        <Form class="property_form">
          <FormItem label="背景色">
            <ColorPicker v-model="componentData.style['background-color']" :transfer="true"/>
            <Input style="width: 155px;" v-model="componentData.style['background-color']" clearable placeholder="请输入背景色"/>
          </FormItem>
          <FormItem label="背景图">
            <div class="bg_image_container">
              <div class="bg_image_wrapper">
                <upload-image width="150" height="150" icon="camera" @success="uploadBgImageSuccess">
                  <img class="bg_image_prev" :src="componentData.style['background-image'] | imageFilter">
                </upload-image>
              </div>
              <div class="bg_image_path">
                <Input :value="componentData.style['background-image'] | imageFilter" placeholder="请输入图片地址" @on-change="changeBgImage"/>
              </div>
            </div>
          </FormItem>
        </Form>
      </TabPane>
    </Tabs>
  </div>
</template>
<style scoped>
  .property_page_container {
    width: 100%;
    height: 100%;
  }
  .property_form {
    padding: 0 15px;
  }
  .bg_image_container {
    display: inline-flex;
    width: 220px;
    height: 200px;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
  .bg_image_wrapper {
    width: 150px;
    height: 150px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #F5F5FA;
    border-radius: 4px;
    overflow: hidden;
  }
  .bg_image_prev {
    max-width: 150px;
    max-height: 150px;
  }
  .bg_image_path {
    width: 100%;
  }
</style>
<script>
  import * as types from '../../../../store/mutation-types'
  export default {
    name: 'PropertyPage',
    data () {
      return {
      }
    },
    computed: {
      componentData () {
        return this.$store.state.pageData[this.$store.state.currentPageIndex]
      }
    },
    methods: {
      changeBgImage (e) {
        if (e.target.value === '') {
          this.componentData.style['background-image'] = ''
        } else {
          this.componentData.style['background-image'] = 'url("' + e.target.value + '")'
        }
        this.savePageData()
      },
      savePageData () {
        this.$store.commit(types.SAVE_LOCAL_TEMPLATE, {
          type: this.componentData.type,
          uuid: this.componentData.uuid,
          template: this.componentData
        })
      },
      uploadBgImageSuccess (data) {
        this.changeBgImage({
          target: {
            value: data.path
          }
        })
      }
    },
    filters: {
      imageFilter (path) {
        if (path === '') {
          return ''
        }
        return path.replace(/.{5}(http.*).{2}$/, '$1')
      }
    },
    components: {
      UploadImage: () => import('../UploadImage.vue')
    }
  }
</script>
