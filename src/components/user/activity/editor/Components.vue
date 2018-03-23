<template>
  <div class="editor_components_wrapper" :class="{shown: shown}">
    <div class="editor_components_inner_open" v-if="shown"></div>
    <div class="editor_components_inner_close" v-else></div>
  </div>
</template>
<style scoped>
  .editor_components_wrapper {
    width: 100%;
    height: 100%;
    background-color: transparent;
    -webkit-transition: all .3s ease-in-out;
    -moz-transition: all .3s ease-in-out;
    -ms-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
  }
  .editor_components_wrapper.shown {
    background-color: darkred;
  }
</style>
<script>
  export default {
    name: 'EditorComponent',
    props: {
      shown: {
        type: Boolean
      }
    },
    data () {
      return {
      }
    },
    components: {}
  }
</script>
