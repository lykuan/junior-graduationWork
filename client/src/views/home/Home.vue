<template>
  <div class="main-container" id="home">
    <header
      v-if="
        $route.name !== 'ariticle' &&
        $route.name !== 'admin' &&
        $route.name != 'adminLogin' &&
        !$route.path.includes('users')
      "
    >
      <Navigator></Navigator>
    </header>

    <main>
      <h1
        v-if="$route.path.includes('login') || $route.path.includes('register')"
        style="
          text-align: center;
          background: #eef;
          margin: 0 0;
          margin-top: 50px;
          color: #fff;
          text-shadow: 1px 1px 2px #000;
          letter-spacing: 2px;
        "
      >
        小小博客登录注册
      </h1>

      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import Navigator from "../../components/common/navigator.vue";
export default {
  name: "Home",
  components: {
    Navigator,
  },

};
</script>

<style lang='less' scoped>
.main-container {
  background: #eef;
  border: 1px solid transparent;
}
</style>