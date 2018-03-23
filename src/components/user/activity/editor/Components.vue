<template>
  <div class="editor_components_wrapper">
    <div class="editor_components_item" v-for="(item, index) in components" :key="item.value" :data-index="index" @click="appendComponent">
      <div class="editor_components_item_icon">
        <Icon :type="item.icon" size="26"></Icon>
      </div>
      <div class="editor_components_item_text">
        <span v-text="item.text"></span>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  @import "../../../../assets/css/theme.scss";
  .editor_components_wrapper {
    width: 100%;
    height: 100%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .editor_components_item {
    width: 50px;
    height: 60px;
    color: #333;
    cursor: pointer;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    -webkit-transition: all .3s ease-in-out;
    -moz-transition: all .3s ease-in-out;
    -ms-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
  }
  .editor_components_item:hover {
    background-color: $theme;
    color: #ffffff;
  }
  .editor_components_item_icon {
    width: 50px;
    height: 30px;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .editor_components_item_text {
    width: 50px;
    height: 20px;
    font-size: 12px;
    font-weight: 500;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
<script>
  import utils from '../../../../utils/index'
  import * as types from '../../../../store/mutation-types'
  export default {
    name: 'EditorComponent',
    data () {
      return {
        components: [
          {
            icon: 'compose',
            text: '文本',
            value: 'text',
            component: () => import('../coms/Button.vue')
          },
          {
            icon: 'image',
            text: '图片',
            value: 'image',
            template: {
              type: 'zpm-image',
              style: {
                backgroundImage: 'url("https://static.dei2.com/plugins_admin/img/127x200.png")'
              }
            },
            component: () => import('../coms/Image.vue')
          },
          {
            icon: 'ios-circle-filled',
            text: '按钮',
            value: 'button',
            template: {
              type: 'zpm-button',
              value: '测试按钮',
              style: {
                left: '100px',
                top: '100px',
                display: 'inline-block',
                textAlign: 'center',
                verticalAlign: 'middle',
                touchAction: 'manipulation',
                cursor: 'pointer',
                backgroundImage: 'none',
                whiteSpace: 'nowrap',
                padding: '12px 30px',
                fontSize: '24px',
                transition: 'color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear',
                userSelect: 'none',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: '#2d8cf0',
                borderRadius: '8px',
                backgroundColor: '#2d8cf0',
                color: '#FFFFFF',
                'webkitAppearance': 'button'
              }
            },
            component: () => import('../coms/Button.vue')
          }
        ]
      }
    },
    computed: {
      currentPageIndex () {
        return this.$store.state.currentPageIndex
      },
      activityInfoChanged () {
        return this.$store.state.activityInfoChanged
      },
      activityInfo () {
        return this.$store.state.activityInfo
      }
    },
    methods: {
      getTemplate (template) {
        let _uuid = utils.getUUID(template.type + '-')
        return Object.assign({}, template, {
          uuid: _uuid
        })
      },
      appendComponent (e) {
        let componentTarget = this.components[Number(e.target.dataset.index)]
        let componentTemplate = this.getTemplate(componentTarget.template)
        this.$store.commit(types.ADD_COMPONENT, componentTemplate)
      }
    },
    components: {}
  }
</script>
