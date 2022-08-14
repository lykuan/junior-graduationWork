<template>
  <div class="nav-container">
    <nav id="navigator">
      <ul>
        <div class="profile"></div>

        <li @click="toArticleCommunity">
          <span :class="{ active: $route.path == '/articleCommunity' }"
            >文章社区</span
          >
        </li>
        <li @click="toQuestion">
          <span :class="{ active: $route.path.includes('question') }"
            >你问我答</span
          >
        </li>
        <li>
          <span :class="{ active: $route.path.includes('front') }"
            >前端攻略<i class="el-icon-arrow-down el-icon--right"></i>
            <section class="select">
              <p @click="toCSS">CSS</p>
              <p @click="toJavascript">JAVASCRIPT</p>
            </section></span
          >
        </li>
        <li>
          <span
            @click="toMoment"
            :class="{ active: $route.path.includes('Moment') }"
            >瞬间</span
          >
        </li>
   
        <section class="parentIcon">
          <div style="display: flex">
            <input
              type="text"
              placeholder="搜索小小博客"
              v-model="searchInfo.query"
              @keyup.enter="search"
              @focus="tip"
              @blur="hide"
            />

            <span class="icon fas fa-search" @click="search"> </span>
          </div>
        </section>

        <li>
          <section
            class="user"
            v-show="
              $store.state.status == 403 ||
              !$store.state.authorization ||
              $store.state.status == ' '
            "
          >
            <span><a @click="users">登录/注册</a></span>
          </section>

          <div v-if="avatar != ' '" class="avatar"><Avatar></Avatar></div>
        </li>

        <li v-show="$store.state.status == 200 || $store.state.authorization">
          <a-button @click="post">写文章</a-button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
// import { usersInfo } from "../../api/users";
import Avatar from "./avatar.vue";
export default {
  name: "navigator",
  data() {
    return {
      activeItem: "文章社区",
      avatar: "",
      searchInfo: { query: "" },
    };
  },
  components: {
    Avatar,
  },

  // async created() {
  //   setTimeout(() => {
  //     this.avatar = localStorage.getItem("userAvatar");
  //   }, 0);
  //   const res = await usersInfo(
  //     localStorage.getItem("userId"),
  //     localStorage.getItem("userToken")
  //   );

  //   if (
  //     (res != "undefined" && res.message == "jwt expired") ||
  //     res.message == "jwt malformed"
  //   ) {
  //     localStorage.setItem("status", res.status);
  //     this.$store.commit(
  //       "changeStatus",
  //       localStorage.setItem("status", res.status)
  //     );
  //     localStorage.setItem("username", " ");
  //     localStorage.setItem("userAvatar", " ");
  //     localStorage.setItem("userId", " ");
  //     localStorage.setItem("userToken", " ");
  //     return;
  //   }

  //   // localStorage.setItem("userAvatar", res.data.userInfo.avatarURL);
  //   this.$store.commit("changeToken", localStorage.getItem("userToken"));
  //   if (!localStorage.getItem("userToken")) {
  //     this.$store.commit("changeStatus", localStorage.setItem("status", 403));
  //     localStorage.setItem("status", 403);
  //     localStorage.setItem("userToken", " ");
  //     localStorage.setItem("userId", " ");
  //   } else {
  //     // localStorage.setItem("status", 200);
  //     this.$store.commit("changeStatus", 200);
  //     this.$store.state.username = localStorage.getItem("username");
  //   }
  //   this.$store.commit("changeAvatar", localStorage.getItem("userAvatar"));

  //   this.$store.commit("changeUserId", localStorage.getItem("userId"));
  // },

  updated() {
    setTimeout(() => {
      this.avatar = localStorage.getItem("userAvatar");
    }, 0);
  },
  methods: {
    hide(e) {
      e.target.placeholder = "搜索小小论坛";
    },
    tip(e) {
      e.target.placeholder = "搜索文章/用户/提问";
    },
    search(e) {
      this.$router
        .push({ path: "/search", query: this.searchInfo })
        .catch((err) => {});
    },
    toQuestion() {
      this.$router.push("/question").catch((e) => {});
    },
    toMoment() {
      this.$router.push("/shareMoment").catch((e) => {});
    },

    toArticleCommunity() {
      this.$router.push("/articleCommunity").catch((e) => {});
    },
    toJavascript() {
      this.$router.push("/front/javascript").catch((e) => {});
    },
    toCSS() {
      this.$router.push("/front/css").catch((e) => {});
    },
    post() {
      this.$router.push("/users/post");
    },
    users() {
      this.$router.replace("/users/login");
    },
    getInnerHtml(e) {
      const reg = /前端攻略/gi;
      if (reg.test(e.target.innerText)) {
        this.activeItem = "前端攻略";
        return;
      }
      this.activeItem = e.target.innerText;
    },
  },
};
</script>

<style lang='less'  scoped>
@import url(../../assets/icon/fontAwesome/css/all.css);
@import url(../../assets/icon/graduation/iconfont.css);
* {
  margin: 0;
  padding: 0;
}

.nav-container {
  #navigator {
    background: #fff;
    height: 61px;
    border: none;
    .active {
      color: #65bbc8;
      transition: all 0.3s;
    }
    .profile {
      width: 3rem;
      height: 3rem;
      margin-left: 3rem;
      // background-image: url(../../assets/img/avatar.jpg);
      background-size: cover;
      border-radius: 50%;
      cursor: pointer;
    }
    ul {
      height: 66px;
      display: flex;
      border: none;
      justify-content: center;
      align-items: center;
      background: rgba(255, 255, 255, 0.1);
      box-sizing: border-box;
      box-shadow: 0 5px 2px #777;

      a {
        color: #777;
        font-size: 12px;
        text-decoration: none;
      }

      :nth-of-type(3) {
        span {
          position: relative;
          display: block;
          box-sizing: border-box;
          height: 40px;
          line-height: 40px;
        }
        i {
          transition: all 0.5s;
        }
        span:hover .select {
          display: block;
        }
        span:hover i {
          transform: rotate(180deg);
        }
      }

      .select {
        top: 40px;
        position: absolute;
        background: #fff;
        color: #777;
        border-radius: 3px;
        box-shadow: 0 0 2px silver, 0 0 4px silver;
        z-index: 999;
        transition: all 0.1s;
        display: none;
        right: -50%;
        border-radius: 5px;
        p {
          font-size: 12px;
          padding: 0 10px;
          transition: all 0.2s;
          color: #777;
        }

        p:hover {
          background: #65bbc8;
          color: #000;
          opacity: 1;
        }
      }
      .select::before {
        content: "";
        display: block;
        position: absolute;
        width: 0%;
        height: 0%;
        border: 6px solid transparent;
        border-bottom-color: #ddd;
        top: -12px;
        left: 50%;
        transform: translate(-50%);
        z-index: 999;
      }

      li {
        list-style: none;
        height: 100%;
        padding: 35px;
        letter-spacing: 0.2rem;
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          cursor: pointer;
          display: block;
          width: max-content;
          box-sizing: border-box;
          height: 40px;
          line-height: 40px;
          font-size: 12px;
          color: #777;
        }
        span:hover {
          color: #78cbe6;
        }
      }
      .parentIcon {
        width: 16rem;
      }
      .icon {
        // background: red;
        position: relative;
      }
      .icon::before {
        display: none;
      }
      .icon::after {
        content: "\f002 ";
        display: block;
        width: 2rem;
        height: 2rem;
        position: absolute;
        top: 0;
        right: 0;
        opacity: 0.4;
        border-radius: 50%;
        font-size: 0.9rem;
        line-height: 2rem;
        letter-spacing: 2px;
        color: #777;
        cursor: pointer;
        text-align: center;
      }
      input {
        // border: none;
        outline: none;
        width: 10rem;
        height: 2rem;
        font-size: 12px;
        padding-left: 1rem;
        background: #f4f5f5;
        box-sizing: border-box;
        overflow: hidden;
        transition: all 0.4s;
        box-sizing: border-box;
        border: none;
        padding-right: 30px;
      }
      input::placeholder {
        color: #aaa;
      }
      input:focus {
        width: 16rem;
        color: #86909c;
        border: 1px solid #348afc;
      }

     
    }
  }
}
</style>