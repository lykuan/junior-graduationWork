<template>
  <div id="app">
    <Home></Home>
    <main></main>
  </div>
</template>

<script>
import Home from "./views/home/Home.vue";

export default {
  name: "App",
  components: {
    Home,
    
  },
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
html{
  font-size: 15px;
}
</style>
