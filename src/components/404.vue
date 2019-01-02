<template>
  <div class="not_found_container">
    <transition name="page-in-transition"
                enter-active-class="animated jackInTheBox"
                leave-active-class="animated fadeOut">
      <div class="logo"
           v-if="loaded">
        <p>OOOOOPS! - Could not Find it</p>
        <img src="../assets/404/404.png" />
        <div class="sub">
          <p><a href="/">回首页</a></p>
        </div>
      </div>
    </transition>
  </div>
</template>
<style scoped>
@font-face {
  font-family: "Love Ya Like A Sister";
  src: url(../assets/404/R70EjzUBlOqPeouhFDfR80-0FhOqJubN-BeL9XxdkmKicQ.woff2)
    format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+FEFF, U+FFFD;
  font-style: normal;
  font-weight: 400;
}
.not_found_container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eaeaea;
  -webkit-user-select: none;
  font-family: "Love Ya Like A Sister", cursive;
  pointer-events: none;
}
.logo {
  text-align: center;
}
.logo img {
  width: 350px;
}
.logo p {
  color: #272727;
  font-size: 40px;
  margin-top: 1px;
  margin-bottom: 10px;
}
.logo p span {
  color: lightgreen;
}
.sub a {
  color: #fff;
  background: #272727;
  text-decoration: none;
  padding: 10px 20px;
  font-size: 13px;
  font-family: arial, serif;
  font-weight: bold;
  -border-radius: 0.5em;
  border-radius: 4px;
  pointer-events: auto;
}
</style>
<script>
export default {
  name: 'notFound',
  data () {
    return {
      loaded: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.loaded = true
    })
  }
}
</script>
