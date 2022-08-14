<template>
  <div class="userSetting-container">
    <article>
      <div class="head">
        <section class="left">
          <img
            v-show="$store.state.userAvatar != 'null'"
            :src="$store.state.userAvatar"
            @click="backPersonalPage"
          />
          <img
            v-show="$store.state.userAvatar == 'null'"
            src="../../assets/img/defaultAvatar.jpg"
            @click="backPersonalPage"
          />
          <ul>
            <li>
              <a href="">{{ this.$store.state.userInfo.username }}</a>
            </li>
            <li style="margin: 0 0;line-height:66px"><span>你的个人账户</span></li>
          </ul>
        </section>
        <section class="right">
          <a-button @click="backPersonalPage" style="font-size: 12px"
            >回到个人主页</a-button
          >
        </section>
      </div>

      <a-layout id="components-layout-demo-responsive">
        <a-layout-sider breakpoint="lg" collapsed-width="0">
          <p class="accoutTitle">账号设置</p>
          <a-menu theme="light" mode="inline" :default-selected-keys="['1']">
            <a-menu-item key="1" @click="toProfile">
              <span class="nav-text">个人资料</span>
            </a-menu-item>
       
            <a-menu-item key="3" @click="toAccountSecurity">
              <span class="nav-text">账号安全</span>
            </a-menu-item>
  
          </a-menu>
        </a-layout-sider>
        <a-layout>
          <div class="layout-main">
            <router-view></router-view>
          </div>
        </a-layout>
      </a-layout>
    </article>
  </div>
</template>
<script>
import UserProfile from "./userProfile.vue";
export default {
  name: "userProfile",

  created() {
  },

  methods: {
    toProfile() {
      this.$router.push(`/user/${this.$store.state.userId}/setting/profile`);
    },
    toAccountSecurity() {
      this.$router.push(
        `/user/${this.$store.state.userId}/setting/accountSecurity`
      );
    },
    backPersonalPage() {
      this.$router.push(`/user/${this.$store.state.userId}`);
    },
  },
  components: {
    UserProfile,
  },

  mounted(){
    const title = document.getElementsByTagName("title")[0];
    title.innerText = "个人主页-小小博客";
  }
};
</script>

<style lang="less" scoped>
.accoutTitle {
  width: 200px;
  height: 40px;
  text-align: left;
  line-height: 35px;
  padding: 0 16px 0 24px;
  color: #000;
  font-weight: 500;
}

.content {
  position: absolute;
  width: calc(1012px - 220px);
  // top: 0;
}
#profile {
  z-index: 5;
}

.ant-layout-sider {
  background: #ffffff;
  margin-right: 20px;
  height: 700px;
  box-sizing: border-box;
}
// .ant-layout-sider-zero-width-trigger{
//     background:#fff;
// }

.userSetting-container {
  width: 100vw;
  height: 1000px;
  border: 1px solid #fff;
  background: #f4f5f5;

  article {
    margin: 0 auto;
    width: 1012px;
    height: 100vh;

    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px auto 20px;
      width: 1012px;
      height: 66px;
      background: #fff;

      .left {
        margin-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        img {
          width: 50px;
          height: 50px;
          margin-right: 20px;
          border-radius: 50%;
        }
        ul {
          margin: 0 0;
          align-self: center;
          height: 66px;
          li {
            margin-top: 3px;
            list-style: none;

            a {
              font-size: 16px;
              text-decoration: none;
              color: #000;
              font-weight: 600;
            }
            span {
              font-size: 12px;
            }
          }
        }
      }

      .right {
        margin-right: 30px;
      }
    }
  }
}
</style>
