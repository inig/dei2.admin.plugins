<template>
  <div id="app">
    <transition name="router-transition"
                enter-active-class="animated zoomInRight"
                leave-active-class="animated fadeOutLeft"
    >
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
  }
  html, body {
    height: 100%;
  }
#app {
  width: 100%;
  height: 100%;
}
</style>
