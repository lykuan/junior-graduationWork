<template>
  <div class="user-detail-container">
    <main>
      <div class="content-area" style="margin: 20px auto; display: flex">
        <article>
          <div class="userInfo">
            <a class="avatar"
              ><img
                v-show="user.userInfo.avatarURL != 'null'"
                :src="user.userInfo.avatarURL"
              />
              <img
                v-show="user.userInfo.avatarURL == 'null'"
                class="defaultAvatar"
                src="../../assets/img/defaultAvatar.jpg"
                alt=""
              />
            </a>

            <div class="right-detail">
              <div class="nickname">
                {{ user.userInfo.nickname }}
                <span class="gender">
                  <a-icon
                    type="man"
                    class="male"
                    v-show="user.userInfo.gender == 1"
                  />
                  <a-icon
                    type="woman"
                    class="female"
                    v-show="user.userInfo.gender == 0"
                  />
                </span>
              </div>
              <ul class="personal-statistic">
                <li>
                  <p style="height: 30px; line-height: 30px; padding: 0 0">
                    <span
                      ><i
                        class="el-icon-info"
                        style="font-size: 14px; margin-right: 5px"
                      ></i></span
                    ><span>{{ user.userInfo.position }}</span
                    ><a-divider
                      type="vertical"
                      v-if="user.userInfo.personal_company != ''"
                      style="backgroundcolor: #333"
                    /><span>{{ user.userInfo.personal_company }}</span>
                  </p>
                  <p style="height: 30px; line-height: 30px; padding: 0 0">
                    <span
                      ><a-icon
                        type="idcard"
                        theme="filled"
                        style="font-size: 14px; margin-right: 5px" /></span
                    ><span>{{ user.userInfo.personal_presentation }}</span>
                  </p>
                </li>
                <li class="editPersonalDetail" style="padding: 0 10px">
                  <a
                    v-show="user._id != $store.state.userId && !isFollowed"
                    @click="handleFollowed"
                    style="
                      display: inline-block;
                      padding: 8px 20px;
                      background: #fff;
                      color: #65bbc8;
                      border: 1px solid;
                      border-radius: 4px;
                    "
                    >关注</a
                  >
                  <a
                    v-show="isFollowed"
                    @click="handleFollowed"
                    style="
                      display: inline-block;
                      padding: 8px 20px;
                      background: #65bbc8;
                      color: #fff;
                      border: 1px solid;
                      border-radius: 4px;
                    "
                    >已关注</a
                  >
                </li>
              </ul>
            </div>
          </div>

          <nav>
            <a-tabs
              default-active-key="1"
              ref="a_tabs"
              v-model="activeKey"
              :animated="false"
            >
              <a-tab-pane key="1" tab="文章">
                <div class="myArticle" id="myArticle">
                  <div class="essay">
                    <span>文章</span
                    ><a>热门<a-divider type="vertical" /><a></a>最新</a>
                  </div>
                  <div v-if="myArticles.length > 0">
                    <personal-articles
                      v-for="item in myArticles"
                      :key="item._id"
                      :articleLists="item"
                      @handleMyArticles="receiveMyArticles"
                    ></personal-articles>
                  </div>
                  <div class="empty" v-if="myArticles.length == 0">
                    <img
                      src="http://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/ed038d31a0ab338af3a27716116e762f.svg"
                      alt=""
                    />
                    <p>这里什么都没有</p>
                  </div>
                </div>
              </a-tab-pane>

              <a-tab-pane key="2" tab="瞬间">
                <moment
                  v-for="item in myMoments"
                  :key="item._id"
                  :momentData="item"
                ></moment>

                <div class="empty" v-if="myMoments.length == 0">
                  <img
                    src="http://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/ed038d31a0ab338af3a27716116e762f.svg"
                    alt=""
                  />
                  <p>这里什么都没有</p>
                </div>
              </a-tab-pane>
              <a-tab-pane key="3" tab="收藏">
                <div class="empty" v-if="myCollections.length == 0">
                  <img
                    src="http://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/ed038d31a0ab338af3a27716116e762f.svg"
                    alt=""
                  />
                  <p>这里什么都没有</p>
                </div>
              </a-tab-pane>

              <a-tab-pane key="4" tab="关注">
                <div class="follow-wrapper">
                  <div class="follow-tab">
                    <span style="color: #000" id="follow">关注</span>
                    <div class="right-tab">
                      <a
                        @click="handleGetFollow"
                        style="color: #000"
                        ref="follow"
                        >关注</a
                      >
                      <a-divider type="vertical" />
                      <a @click="handleGetFollow" ref="follower">关注者</a>
                    </div>
                  </div>
                  <div style="margin-top: -16px">
                    <follow
                      v-for="item in followsInfo"
                      :key="item.followerInfo._id"
                      :followInfo="item.followerInfo"
                    ></follow>
                  </div>
                  <div class="empty" v-if="followsInfo.length == 0">
                    <img
                      src="http://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/ed038d31a0ab338af3a27716116e762f.svg"
                      alt=""
                    />
                    <p>这里什么都没有</p>
                  </div>
                </div>
              </a-tab-pane>
            </a-tabs>
          </nav>
        </article>

        <aside>
          <ul class="aside">
            <li><p>个人成就</p></li>
            <li>
              <p class="eye"></p>
              文章被阅读<span>{{ 0 }}</span>
            </li>
          </ul>
          <div class="follow-container">
            <section>
              <a
                @click="handleGetFollow"
                style="display: inline-block; padding: 10px 10px; color: #000"
              >
                <div>关注</div>
              </a>
              <div style="font-weight: 600; color: #111">
                {{ user.userInfo.follow.length }}
              </div>
            </section>
            <div>
              <a-divider type="vertical" style="height: 30px; margin: 0 0" />
            </div>

            <section>
              <a
                @click="handleGetFollow"
                style="display: inline-block; padding: 10px 10px; color: #000"
                ><div>关注者</div>
              </a>
              <div style="font-weight: 600; color: #111">
                {{ user.userInfo.follower.length }}
              </div>
            </section>
          </div>

          <ul class="list-card">
            <li>
              收藏集 <span>{{ 0 }}</span>
            </li>
            <li>
              加入于 <span>{{ this.user.createTime }}</span>
            </li>
          </ul>
        </aside>
      </div>
    </main>
  </div>
</template>

<script>
import {
  getUserPost,
  updateProfile,
  getMyMoments,
  getUserFollow,
  followedUser,
  usersInfo,
} from "../../api/users";
import moment from "../../components/content/moment.vue";
import follow from "../../components/content/follows.vue";
// import userArticles from '../../components/content/userArticles.vue'
import personalArticles from "../../components/content/personalArticles.vue";
export default {
  name: "UserDetail",

  methods: {
    async handleGetFollow(e, follow = "关注") {
      if (e) {
        this.activeKey = "4";
        console.log(e.target.innerText);
        if (e.target.innerText == "关注者") {
          setTimeout(() => {
            this.$refs.follow.style.color = "#777";
            this.$refs.follower.style.color = "#000";
          }, 20);
        } else {
          setTimeout(() => {
            this.$refs.follower.style.color = "#777";
            this.$refs.follow.style.color = "#000";
          }, 20);
        }

        // e.target.style.color = "#000";
        const u_id = this.user._id;
        follow = e.target.innerText;
        console.log(u_id);
        const follows = await getUserFollow(u_id, follow);

        this.followsInfo = follows;
      } else {
        const u_id = this.user._id;

        const follows = await getUserFollow(u_id, follow);
        this.followsInfo = follows;
      }
    },
    async handleFollowed(e) {
      const user = this.user._id;
      const myId = this.$store.state.userId;
      const res = await followedUser(user, myId);
      console.log(res);
      this.myFollows = res;
    },
    receiveMyArticles(data) {
      this.myArticles = data;
    },
    async handleProfile() {
      const res = await updateProfile(this.u_id, this.profileContent);
      if (res.modified) {
        localStorage.setItem("presentation", this.profileContent);
        this.$store.commit(
          "changePresentation",
          localStorage.getItem("presentation")
        );
        this.$refs.successE.style.display = "block";
        this.$refs.editArea.style.display = "none";
      }
    },

    async hanldeGetMyMoments() {
      const u_id = this.user._id;

      const moments = await getMyMoments(u_id);
      this.myMoments = moments;
    },

    async handleGetFollow(e, follow = "关注") {
      if (e) {
        this.activeKey = "4";
        console.log(e.target.innerText);
        if (e.target.innerText == "关注者") {
          setTimeout(() => {
            this.$refs.follow.style.color = "#777";
            this.$refs.follower.style.color = "#000";
          }, 20);
        } else {
          setTimeout(() => {
            this.$refs.follower.style.color = "#777";
            this.$refs.follow.style.color = "#000";
          }, 20);
        }

        // e.target.style.color = "#000";
        const u_id = this.user._id;
        follow = e.target.innerText;
        const follows = await getUserFollow(u_id, follow);
        this.followsInfo = follows;
        console.log(this.followsInfo);
      } else {
        const u_id = this.user._id;
        const follows = await getUserFollow(u_id, follow);
        this.followsInfo = follows;
      }
    },
  },

  data() {
    return {
      userAvatar: "",
      defaultAvatarUrl: "../../assets/img/avatar.jpg",
      u_id: "",
      avatar: "",
      user: {},
      random: "",
      myArticles: [],
      profileContent: "",
      createTime: "",
      myMoments: [],
      userFollows: [],
      myCollections: [],
      activeKey: "1",
      myFollows: [],
      followsInfo: [],
      userId: "",
    };
  },

  components: {
    // userArticles,
    moment,
    follow,
    personalArticles,
  },
  computed: {
    isFollowed() {
      return this.myFollows.includes(this.$store.state.userId);
    },
  },
  async created() {
    this.userId = JSON.parse(sessionStorage.getItem("anotherId"));
    const userData = await usersInfo(this.userId);
    this.user = userData.data;
    console.log(this.user);

    this.hanldeGetMyMoments();
    this.myFollows = this.user.userInfo.follower;

    let createTime = new Date(this.user.createTime)
      .toLocaleString()
      .match(/.*(?= \p{sc=Han})/gu)[0]
      .replace("下午", "");

    this.user.createTime = createTime.replace(/\//g, "-");
    const res = await getUserPost(this.user._id);
    sessionStorage.setItem("myArticles", JSON.stringify(res));
    const myEssay = JSON.parse(sessionStorage.getItem("myArticles"));

    this.myArticles = myEssay;
    // this.myArticles.forEach((i) => {
    //   i.authorInfo = this.user;
    // });
    console.log(this.myArticles);
  },

  mounted() {
    this.handleGetFollow();
  },
};
</script>

<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
}

#el-popover-1763 {
  padding: 0;
}

.follow-wrapper {
  width: 100%;

  .follow-tab {
    display: flex;
    justify-content: space-between;
    width: 660px;
    padding: 12px;
    position: relative;
    border-bottom: 1px solid #eee;
    top: -16px;

    .right-tab {
      display: flex;
      align-items: center;
      a {
        color: #777;
        font-size: 12px;
      }
    }
  }
}

.list-card {
  width: 250px;
  margin-left: 15px;
  li {
    padding: 10px 0;
    list-style: none;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    color: #000;
  }
}

main {
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  background: #f4f5f5;
}
.myArticle {
  border: none;
  position: relative;
  margin: 0 auto;
  top: -16px;
  background: #fff;
  height: max-content;
  // height: 1000px;

  span:first-child {
    font-weight: 800;
    font-size: 15px;
  }
  a {
    color: #777;
  }
}
.empty {
  width: 100%;
  height: 180px;
  // border: 1px solid #eee;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  * {
    margin: 2px 0;
    color: #ddd;
  }
}
.essay {
  margin: 0 auto;
  width: 90%;
  top: -16px;
  height: 60px;
  justify-content: space-between;
  align-items: center;
  display: flex;
}

.ant-divider {
  margin: 0 10px;
}
nav {
  width: 660px;
  margin: 15px 0;
  background: #fff;
  border-bottom: none;
}
.information {
  margin: 0;
  padding: 0;
  // border-top: none;
}
.el-button {
  border: none;
  width: 130px;
  padding: 10px;
  box-sizing: border-box;
}
.user-detail-container {
  width: 100vw;
  background: #f4f5f5;
  border: 1px solid #fff;
  height: 100vh;

  .userInfo {
    display: flex;
    width: 660px;
    height: 150px;
    background-color: #fff;
    padding-left: 15px;
    border: none;
    align-items: center;

    .editPersonalDetail {
      .ant-btn {
        height: 35px;
        width: 100px;
        border: 1px solid #0e86e9;
        color: #0e86e9;
      }
      .ant-btn:hover {
        color: #40a9ff;
        border: 1px solid #40a9ff;
      }
    }
    .avatar:hover {
      animation: runner 0.02s 1s infinite ease-in-out;
    }
    .avatar {
      display: block;
      text-decoration: none;
      background: #999;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      position: relative;

      @keyframes runner {
        from {
          transform: rotate(0);
        }
        to {
          transform: rotate(360deg);
        }
      }

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-size: cover;
      }

      img.defaultAvatar {
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      .edit {
        left: -10px;
        bottom: 2px;
        display: block;
        width: fit-content;
        height: 25px;
        position: absolute;
        background-color: #fff;
        border: 1px solid #ddd;
        text-decoration: none;
        border-radius: 5px;
        font-size: 10px;
        color: #000;
        padding: 0 2px;
        box-sizing: border-box;
        z-index: 11;

        i {
          font-size: 10px;
          margin-right: 4px;
          line-height: 25px;
          color: #333;
        }
      }
    }

    .right-detail {
      flex-grow: 1;
      width: auto;
      background: #fff;
      padding: 15px 0;
      box-sizing: border-box;

      .nickname {
        color: #000;
        height: 35px;
        line-height: 35px;
        padding-right: 10px;
        position: relative;
        letter-spacing: 2px;
        font-size: 22px;
        font-weight: 600;
        padding: 0 20px;
      }
      .gender {
        margin-left: 10px;
        padding: 10px;
        height: 30px;
        position: relative;
      }
      i.male {
        position: absolute;
        left: 0;
        color: rgb(0, 140, 255);
        font-size: 14px;
        line-height: 35px;
      }
      i.female {
        position: absolute;
        left: 0;
        color: rgb(255, 0, 111);
        font-size: 14px;
        line-height: 35px;
      }

      .personal-statistic {
        display: flex;
        width: 100%;
        height: calc(100% - 15px);
        // background: blue;
        align-items: center;
        position: relative;
        padding: 0 20px;
        .ant-btn {
          margin-right: 10px;
        }
        li {
          list-style: none;
          // background: pink;
          border: none;
          // border-left: 1px solid #eee;
          box-sizing: border-box;
          font-size: 12px;
          padding: 10px 0;

          p {
            width: 100%;
            padding: 0 12px;
          }
          a {
            color: #aaa;
            width: 100%;
            display: inline-block;
            text-align: center;
            // background: aqua;
            box-sizing: border-box;
            padding: 0 10px;
            text-decoration: none;
            i.el-icon-arrow-right {
              font-size: 5px;
            }
          }
        }
      }

      .personal-statistic li:last-child {
        position: absolute;
        right: 0;
        border-left: none;
        align-self: center;
        justify-self: flex-end;
      }
    }
  }

  .aside {
    margin-left: 15px;
    width: 250px;
    height: 150px;
    border: none;
    background: #fff;

    a {
      text-decoration: none;
      color: #777;
    }
    li {
      list-style: none;
      width: 100%;
      height: 50px;
      border: none;
      border-bottom: 1px solid #eee;
      padding-left: 15px;
      line-height: 50px;
      box-sizing: border-box;
    }
    li:first-child {
      font-weight: 800;
      font-size: 16px;
      letter-spacing: 4px;
    }
    li:nth-child(3) {
      border: none;
    }
    li:nth-child(4) {
      border: none;
      margin: 0;
      color: #777;
      font-family: Verdana, Geneva, Tahoma, sans-serif;
    }

    :nth-child(2) {
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 2px;
    }

    .presentation {
      display: flex;
      height: auto;
      justify-content: space-between;
      position: relative;

      span {
        font-size: 13px;
      }
      a {
        font-size: 12px;
        :hover {
          color: #40a9ff;
        }
      }

      .editArea {
        width: 100%;
        position: absolute;
        left: 0;
        top: 50px;
        opacity: 0;
        transition: 0.5s;
        text-align: center;
        p {
          text-align: left;
          position: relative;
          top: -15px;
          .ant-btn {
            margin: 0 20px 0 5px;
            width: 60px;
            outline: none;
          }
          a {
            font-size: 14px;
          }
          a:hover {
            color: #40a9ff;
          }
        }
        textarea {
          outline: none;
          border-radius: 5px;
          transition: all 0.3s;
          background: #fff;
          border: 1px solid #ddd;
          padding: 0 0;
          margin: 0 0;
          text-indent: 11px;
        }
        textarea:focus {
          box-shadow: 0 0 2px #148cee, 0 0 5px #0e86e9;
        }
      }
    }
  }

  .follow-container {
    width: 250px;
    margin-left: 15px;
    margin-top: 15px;
    display: flex;
    background: #fff;
    height: 80px;
    justify-content: space-around;
    align-items: center;

    section {
      text-align: center;
      color: #777;
      width: 100px;
    }
  }
}
</style>