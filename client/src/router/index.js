import Router from "vue-router";
import Vue from "vue";

import Users from "../components/common/users.vue";
import Login from "../components/common/login.vue";
import UserDetail from "../views/user/userDetail.vue";
import UserSetting from "../views/user/userSetting.vue";
import UserProfile from "../views/user/userProfile.vue";
import UserAccoutSecurity from "../views/user/userAccoutSecurity.vue";
import AnotherUserInfo from "../views/user/anotherUser.vue";

import PostArticle from "../views/article/postArticle.vue";

import ArticleCommunity from "../views/article/articleCommunity.vue";
import Article from "../components/content/articles.vue";
import ArticleContent from "../views/article/articleContent.vue";

import Css from "../views/knowledge/css.vue";
import Javascript from "../views/knowledge/javascript.vue";
import PostMoment from "../views/moment/postMoment.vue";

import QuestionHome from "../views/questions/questionHome.vue";
import PostQuestion from "../views/questions/postQuestion.vue";
import QuestionContent from "../views/questions/questionContent.vue";

import Search from "../views/search/search.vue";
import AdminHome from '../views/admin/home/home.vue'
import adminLogin from '../views/admin/login/index.vue'
Vue.use(Router);

const vueRouter = new Router({
  mode: "history",

  routes: [
    { path: "/", redirect: { name: "articleCommunity" } },
    { path: "/users/register", component: Users },
    { name: "login", path: "/users/login", component: Login },
    { path: "/user/:uid", component: UserDetail },
    { path: "/user/anotherUser/:uid", component: AnotherUserInfo },

    { path: "/user/:a_id/post", component: ArticleContent },
    {
      path: "/user/:uid/setting",
      component: UserSetting,
      children: [
        { path: "profile", component: UserProfile },
        { path: "accountSecurity", component: UserAccoutSecurity },
      ],
    },
    { name: "ariticle", path: "/users/post", component: PostArticle },
    {
      name: "articleCommunity",
      path: "/articleCommunity",
      component: ArticleCommunity,
      children: [{ path: "hotestArticles", component: Article }],
    },
    { path: "/front/css", component: Css },
    { path: "/front/javascript", component: Javascript },
    { path: "/shareMoment", component: PostMoment },
    {
      path: "/question",
      component: QuestionHome,
    },
    { path: "/question/post", component: PostQuestion },
    { path: "/question/:q_id", component: QuestionContent },
    { path: "/search", component: Search },
    { name: 'admin' , path: "/admin", component: AdminHome },
    { name: 'adminLogin' , path: "/adminLogin", component: adminLogin},




  ],

  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    return { x: 0, y: 0 };
  },
});

export default vueRouter;
