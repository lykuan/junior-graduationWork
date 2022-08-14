<template>
  <div class="avatar-container">
    <section class="personalFun">
      <el-dropdown :show-timeout="10" trigger="click">
        <a>
          <img
            ref="avatar"
            v-show="
              $store.state.userAvatar != 'null' &&
              $store.state.status == 200 &&
              $store.state.userAvatar != ''
            "
            :src="$store.state.userAvatar"
            alt=""
            class="miniAvatar"
          />

          <img
            v-show="
              $store.state.userAvatar == 'null' && $store.state.status == 200
            "
            class="defaultMiniAvatar"
            src="../../assets/img/defaultAvatar.jpg"
            alt=""
          />
        </a>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <a-icon type="user" /><a href="#"
              >登陆中,<em
                ><strong>{{ $store.state.username }}</strong></em
              ></a
            >
          </el-dropdown-item>
          <hr />
          <el-dropdown-item
            ><a-icon type="home" /><a @click="toProfile">
              我的主页</a
            ></el-dropdown-item
          >
          <el-dropdown-item>
            <a-icon type="star" />
            <a href="/">收藏的文章</a></el-dropdown-item
          >
          <el-dropdown-item
            ><a-icon type="like" /><a href="#"> 喜欢的文章</a></el-dropdown-item
          >
          <el-dropdown-item
            ><a-icon type="question" />
            <a href="/"> 我的提问</a></el-dropdown-item
          >
          <el-dropdown-item
            ><a-icon type="ordered-list" />
            <a href="/"> 我的任务</a></el-dropdown-item
          >
          <hr />
          <el-dropdown-item class="cancelLogin">
            <a-icon type="logout" /><a href="" @click="cancelLogin">退出</a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </section>
  </div>
</template>

<script>
import { usersInfo } from "../../api/users";
export default {
  name: "Avatar",
  data() {
    return {
      navigationAvatar: "",
    };
  },
  watch: {
    navigationAvatar(val) {},
  },
  methods: {
    post() {
      this.$router.push("/users/post");
    },
    cancelLogin() {
      localStorage.setItem("userToken", "");
      localStorage.setItem("status", "403");
      localStorage.setItem("username", "");
      localStorage.setItem("userAvatar", "");
      localStorage.setItem("userId", "");
      this.$store.commit("changeStatus", localStorage.getItem("status"));
    },
    getInnerHtml(e) {
      const reg = /前端攻略/gi;
      if (reg.test(e.target.innerText)) {
        this.activeItem = "前端攻略";
        return;
      }
      this.activeItem = e.target.innerText;
    },

    toProfile() {
      this.$router.push(`/user/${this.$store.state.userId}`);
    },
  },
  async created() {
    if (localStorage.getItem("userToken") == "") return;
    const res = await usersInfo(
      localStorage.getItem("userId"),
      localStorage.getItem("userToken")
    );
    if (res.message == "jwt expired" || res.message == "jwt malformed") {
      localStorage.setItem("status", res.status);
      this.$store.commit(
        "changeStatus",
        localStorage.setItem("status", res.status)
      );
      return;
    }

    // localStorage.setItem("userAvatar", res.data.userInfo.avatarURL);
    this.$store.commit("changeToken", localStorage.getItem("userToken"));
    if (!localStorage.getItem("userToken")) {
      this.$store.commit("changeStatus", localStorage.setItem("status", 403));
      localStorage.setItem("status", 403);
    } else {
      // localStorage.setItem("status", 200);
      this.$store.commit("changeStatus", 200);
      this.$store.commit("changeUsername", localStorage.getItem("username"));
    }
    this.$store.commit("changeAvatar", localStorage.getItem("userAvatar"));

    this.$store.commit("changeUserId", localStorage.getItem("userId"));
  },
};
</script>

<style lang="less" scoped>
.el-dropdown-menu {
  display: flex;
  flex-direction: column;
  align-items: space-between;
  justify-content: space-between;
  width: 180px;
  box-shadow: 0 0 3px silver;
  box-sizing: border-box;
  padding: 0 0;

  .el-dropdown-menu__item {
    padding: 0 0;
  }

  a {
    padding: 5px 0;
    display: inline-block;
    text-decoration: none;
    color: #777;
    font-size: 12px;
  }
}
.el-icon-caret-bottom::before {
  color: #ccc;
}
.avatar-container {
  height: 40px;
  line-height: 40px;

  .personalFun {
    cursor: pointer;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 66px;
    line-height: 100%;
  }

  .personalFun .defaultMiniAvatar {
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }

  .personalFun .miniAvatar {
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }
  .cancelLogin {
    position: absolute;
    right: 45px;
  }

  .cancelLogin a {
    text-decoration: none;
    font-size: 12px;
    color: #ddd;
    letter-spacing: 2px;
  }

  .user {
    box-sizing: border-box;
    position: relative;
    right: 0;
    background: transparent;

    span {
      font-size: 12px;
      letter-spacing: 2px;
      a {
        color: #eee;
      }
    }
  }
}
</style>