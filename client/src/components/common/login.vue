<template>
  <div class="login-container">
    <section class="login">
      <el-form>
        <div class="users-title">
          <a target="_blank" @click="register">注册</a>
          <a target="_blank" @click="login">登录</a>
        </div>
        <el-form-item label="用户名:">
          <el-input
            type="text"
            placeholder="邮箱或用户名"
            v-model="username"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码:">
          <el-input type="password" v-model="password"></el-input>
        </el-form-item>
        <el-button
          style="
            background: #2364dd;
            width: 100%;
            border-radius: 0 0;
            color: #fff;
          "
          @click.enter="signIn"
          :loading="loginLoading"
          >登录</el-button
        >

        <div style="margin: 10px 0; font-size: 12px">
          <a @click="$router.push('/adminLogin')">超级管理员</a>
        </div>
      </el-form>
    </section>
  </div>
</template>

<script>
import { userLogin } from "../../api/users";
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      loginLoading: false,
    };
  },
  watch: {},
  methods: {
    register() {
      this.$router.push("/users/register");
    },
    login() {
      this.$router.replace("/users/login");
    },
    async signIn() {
      this.loginLoading = true;
      let users = { username: this.username, password: this.password };
      const {
        message,
        token,
        username,
        password,
        id,
        userInfo,
        login,
        status,
      } = await userLogin(users);
      console.log(password);
      if (!message) {
        this.$message.error(message);
        this.loginLoading = false;

        return;
      } else if (!login) {
        this.$message.error(message);
        this.loginLoading = false;

        return;
      } else {
        this.loginLoading = false;
        this.$message.success(`${message},欢迎您:${username}`);
        localStorage.setItem("username", username);
        // this.$store.state.userInfo.username = localStorage.getItem('username');

        // const userAvatar = await getUserAvatar(id);
        const random = Date.now();
        const avatar =
          userInfo.avatarURL == "null"
            ? "null"
            : userInfo.avatarURL + `?random=${random}`;

        localStorage.setItem("userAvatar", avatar);
        localStorage.setItem("status", status);
        // this.$store.commit("changeStatus",localStorage.getItem("status"))
        localStorage.setItem("userToken", token);
        localStorage.setItem("userId", id);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        sessionStorage.setItem("pwd", password);

        this.$store.commit("changeUserInfo", localStorage.getItem("userInfo"));
        this.$store.commit("changeUsername", username);
        this.$store.commit("changeToken", localStorage.getItem("userToken"));
        this.$store.commit("changeUserId", localStorage.getItem("userId"));
        this.$store.commit("changePassword", password);

        this.$router.replace("/articleCommunity");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  padding: 50px 0;
  height: 100vh;
  background: #eef;

  .login {
    border-radius: 10px;
    border: 1px solid #ddd;
    box-shadow: 1px 2px 3px #777;
    margin: 0 auto;
    padding: 50px;
    background: #fff;
    width: 390px;
    opacity: 0.7;
    outline: none;

    .el-input__inner {
      margin-bottom: 50px;
      width: 200px;
      height: 30px;
      outline: none;
      border: none;
      color: #999;
    }
    .el-form-item__content {
      color: #999;
    }
  }

  .users-title {
    width: 100%;
    height: 30px;
    text-align: center;
    box-sizing: border-box;
    margin-bottom: 20px;
    a {
      font-size: 20px;
      text-decoration: none;
      color: #999;
      margin: 0 20px;
      letter-spacing: 2px;
      cursor: pointer;
    }
    a:hover {
      color: #65bbc8;
    }
  }
  .submit {
    width: 100%;
    text-align: center;
    background: #2364dd;
    a {
      display: block;
      text-decoration: none;
      color: #fff;
      width: 100px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      border-radius: 3px;
      cursor: pointer;
      margin: 0 auto;
    }
  }
}
</style>