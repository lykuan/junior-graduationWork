import Vue from "vue";
import App from "./App.vue";
import store from "./store/index";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import hljs from "highlight.js";

import "highlight.js/styles/monokai-sublime.css";

import router from "./router/index";
import vueRouter from "./router/index";

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(Antd);
Vue.use(hljs)

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
