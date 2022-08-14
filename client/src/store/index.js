import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userInfo: "",
    username:"",
    password: "",
    authorization: "",
    userId: "",
    userAvatar: "",
    status: "",
    presentation:"",
    myArticles:[]
  },
  mutations: {
    changeToken(state, data) {
      state.authorization = data;
    },
    changeUserId(state, uId) {
      state.userId = uId;
    },
    changeAvatar(state, avatarURL) {
      state.userAvatar = avatarURL;
    },
    changeUserInfo(state, userDetail) {
      state.userInfo = userDetail;
    },
    changeStatus(state, status) {
      state.status = status;
    },
    changePresentation(state,data){
      state.presentation = data;
    },
    changeMyArticle(state,data){
      state.myArticles = data
    },
    changeUsername(state,data){
      state.username = data
    },
    changePassword(state,data){
      state.password = data
    }
  },
  actions: {},
});

export default store;
