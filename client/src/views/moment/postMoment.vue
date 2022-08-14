<template>
  <div class="moment-container" v-loading.fullscreen="loading" element-loading-text="Loading...">
    <main>
      <ul class="circleCategory" ref="">
        <li v-for="item in circleList" :key="item.title" @click="findCategory">
          <img
            style="width: 30px; height: 30px"
            :src="item.cover"
            alt=""
            class="cover"
          /><span class="title">{{ item.title }}</span>
        </li>
        <li @click="loadMore" v-if="circleList.length < topic.length">更多</li>
      </ul>
      <article>
        <div class="edit-container">
          <div class="edit-box">
            <span
              style="
                position: absolute;
                right: 10px;
                bottom: 8px;
                font-size: 12px;
                color: #777;
              "
              >{{ momentContentLimit }}/1000</span
            >
            <div class="momentImage-container">
              <ul class="momentImage-list">
                <li
                  v-for="item in moment.image"
                  v-show="moment.image.length > 0"
                  :key="item"
                >
                  <img :src="item" alt="" />
                </li>
              </ul>
              <p
                ref="tag"
                style="
              bottom: 5px;
              background: #fff;
              width: 110px;
              height: 30px;
              left:20px
              text-align: left;
              border-radius:40px 40px 40px 0;
              display:none;

            "
              >
                <a
                  style="
              margin-left:-70px;
              margin-top:6px;
                font-size: 12px;
                background: #1d7dfa;
                display: inline-block;
                color: #fff;
                width: 16px;
                height: 16px;
                border-radius:45%
                text-align:right;
              "
                  ><a-icon type="number" /></a
                ><span
                  style="
                    position: absolute;
                    top: 22%;
                    font-size: 10px;
                    margin: 0 5px;
                    color: #1d7dfa;
                  "
                  >{{ moment.circle }}</span
                >
              </p>
            </div>
            <textarea
              ref="moment_input"
              @input="available"
              @focus="convert"
              @blur="white"
              v-model="moment.content"
              name=""
              id="moment"
              placeholder="快和大家分享你每日遇到的有趣的故事把，文明交流哦O(∩_∩)O"
            ></textarea>
          </div>

          <div class="action-box">
            <ul>
              <li style="position: relative">
                <a @click="showEmoji" ref="emo"><a-icon type="meh" /> 表情</a>

                <div
                  class="emoji_container"
                  ref="emoji_container"
                  style="
                    border: 1px solid;
                    position: absolute;
                    z-index: 9999;
                    display: none;
                  "
                  @mouseleave="hideEmoji"
                >
                  <Picker :data="emojiIndex" set="twitter" @select="addEmoji" />
                </div>
              </li>
              <li>
                <el-upload
                  :show-file-list="false"
                  :headers="{ authorization: $store.state.authorization }"
                  action="http://localhost:8888/uploads/momentImage"
                  :on-success="handleMomentSuccess"
                  :limit="4"
                  name="momentImage"
                >
                  <a><a-icon type="file-image" /> 图片</a>
                </el-upload>
              </li>
            
              <li>
                <a-dropdown v-model="visible" :trigger="['click']"
                  ><a><i class="el-icon-info"></i> 圈子</a>
                  <a-menu slot="overlay" @click="handleMenuClick">
                    <a-menu-item v-for="item in topic" :key="item.title">
                      <img :src="item.cover" alt="" /><span>{{
                        item.title
                      }}</span>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </li>
            </ul>
            <div>
              <a-button disabled="disabled" class="post" @click="postMoment"
                >发布</a-button
              >
            </div>
          </div>
        </div>
        <ul class="tab">
          <li><a :class="{ active: true }">新鲜</a></li>
          <li><a>热门</a></li>
        </ul>

        <Moment
          v-for="item in momentList"
          :key="item._id"
          :momentData="item"
          @dispatchAllMoments="receiveAllMoments"
        ></Moment>
         <div v-if="momentList.length == 0" class="empty">
            <img
              src="http://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/ed038d31a0ab338af3a27716116e762f.svg"
              alt=""
            />
            <p>这里什么都没有</p>
          </div>
      </article>

      <aside>
        <div class="userMomentInfo">
          <div class="userProfile">
            <img :src="$store.state.userAvatar" alt="" />
            <div>
              <p style="margin: 0 0; font-weight: 800; font-size: 16px">
                {{ $store.state.username }}
              </p>
              <p
                style="
                  margin: 5px 0;
                  font-size: 12px;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                  width: 100px;
                "
              >
                <span>{{ $store.state.userInfo.position }}</span
                ><span>{{ $store.state.userInfo.company }}</span>
              </p>
            </div>
          </div>

          <div class="surfing">
            <ul>
              <li>{{ userMomentNum }}</li>
              <li>{{ $store.state.userInfo.follow.length }}</li>
              <li>{{ $store.state.userInfo.follower.length }}</li>
            </ul>
            <ul>
              <a style="color: #777" @click="toMoment"><li>瞬间</li></a>
              <a style="color: #777"><li>关注</li></a>
              <a style="color: #777"><li>关注者</li></a>
            </ul>
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>

<script>
import Moment from "../../components/content/moment.vue";
import { postMoment, getMoments, getMomentsByCircle } from "../../api/moment";

// Import data/twitter.json to reduce size, all.json contains data for
// all emoji sets.
import data from "emoji-mart-vue-fast/data/all.json";
// Import default CSS
import "emoji-mart-vue-fast/css/emoji-mart.css";

import { Picker, EmojiIndex } from "emoji-mart-vue-fast";

let emojiIndex = new EmojiIndex(data);
export default {
  name: "postMoment",

  computed: {
    momentContentLimit() {
      return this.moment.content.length;
    },
    userMomentNum() {
      return this.momentList.filter(
        (i) => i.momenter == this.$store.state.userId
      ).length;
    },
  },
  data() {
    return {
      moment: {
        userId: "",
        content: "",
        circle: "",
        image: [],
      },
      visible: false,
      previewVisible: false,
      previewImage: "",
      fileList: [],
      momentList: [],
      loading:false,
      circleList: [
        {
          title: "每日读书打卡",
          cover:
            "https://img-operation.csdnimg.cn/csdn/silkroad/img/1635477356855.png",
        },
        {
          title: "小程序交流区",
          cover:
            "https://img-operation.csdnimg.cn/csdn/silkroad/img/1635477601406.png",
        },
        {
          title: "前端交流",
          cover:
            "https://img-operation.csdnimg.cn/csdn/silkroad/img/1634783471519.png",
        },
        {
          title: "后端交流",
          cover: "https://www.runoob.com/wp-content/uploads/2014/03/nodejs.jpg",
        },
        {
          title: "数据库交流",
          cover:
            "https://img-operation.csdnimg.cn/csdn/silkroad/img/1635477444023.png",
        },
      ],

      topic: [
        {
          title: "每日读书打卡",
          cover:
            "https://img-operation.csdnimg.cn/csdn/silkroad/img/1635477356855.png",
        },
        {
          title: "小程序交流区",
          cover:
            "https://img-operation.csdnimg.cn/csdn/silkroad/img/1635477601406.png",
        },
        {
          title: "前端交流",
          cover:
            "https://img-operation.csdnimg.cn/csdn/silkroad/img/1634783471519.png",
        },
        {
          title: "后端交流",
          cover: "https://www.runoob.com/wp-content/uploads/2014/03/nodejs.jpg",
        },
        {
          title: "数据库交流",
          cover:
            "https://img-operation.csdnimg.cn/csdn/silkroad/img/1635477444023.png",
        },
        {
          title: "考研人战区",
          cover:
            "https://img-operation.csdnimg.cn/csdn/silkroad/img/1635477269565.png",
        },
        {
          title: "自拍晒晒",
          cover:
            "https://img-operation.csdnimg.cn/csdn/silkroad/img/1634783688816.png",
        },
        {
          title: "课外阅读",
          cover:
            "https://dss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2513088227,2181010931&fm=83&app=66&f=JPEG?w=267&h=356&s=BD8E377EDB105ACC097E06E40200702B",
        },
        {
          title: "旅游交流",
          cover:
            "https://img-operation.csdnimg.cn/csdn/silkroad/img/1635477203293.png",
        },
        {
          title: "每日emo",
          cover:
            "https://img0.baidu.com/it/u=2715266490,512661766&fm=26&fmt=auto",
        },
        {
          title: "上班摸鱼",
          cover: "https://img-blog.csdnimg.cn/2020092420040652.png",
        },
        {
          title: "打工人日常",
          cover:
            "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1a97d4135844263a337b215dd961401~tplv-k3u1fbpfcp-no-mark:0:0:0:0.image?",
        },
      ],

      emojiIndex: emojiIndex,
      emojisOutput: "",
    };
  },
  methods: {
    toMoment() {
      this.$router.push("/user/" + this.$store.state.userId);
    },
    handleMomentSuccess(response, file, fileList) {
      this.moment.image.push(response);
      console.log(response);
    },
    receiveAllMoments(data) {
      this.momentList = data;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    async findCategory(e) {
      document.getElementsByClassName("title").forEach((i) => {
        i.style.color = "#000";
      });
      setTimeout(() => {
        e.target.style.color = "#1d7dfa";
      }, 20);
      // e.target.style.background = ;

      let circle = /title/.test(e.target.className)
        ? e.target.innerText
        : /cover/.test(e.target.className)
        ? e.target.nextSibling.innerText
        : e.target.children[1].innerText;
      const tagMoments = await getMomentsByCircle(circle);
      this.momentList = tagMoments;
    },
    loadMore() {
      this.circleList.push(...this.topic.slice(5));
    },

    available() {
      const post = document.getElementsByClassName("post")[0];
      if (this.moment.content.length > 0) {
        post.removeAttribute("disabled");
        post.style.backgroundColor = "#1e80ff";
      } else {
        post.setAttribute("disabled", true);
        post.style.backgroundColor = "#eaf2ff";
      }
    },

    white() {
      this.$refs.tag.style.background = "#fff";
    },
    convert() {
      this.$refs.tag.style.background = "#eaf2ff";
    },
    handleMenuClick(e) {
      this.moment.circle = e.key;
      this.$refs.tag.style.display = "block";
    },
    addEmoji(emoji) {
      this.$refs.moment_input.value += emoji.native;
      // this.momentContent += emoji.native;
    },
    hideEmoji(e) {
      this.$refs.emoji_container.style.display = "none";
      this.$refs.emo.style.color = "#777";
    },
    showEmoji(e) {
      e.target.style.color = "rgb(17, 122, 221)";
      this.$refs.emoji_container.style.display = "block";
    },

    async postMoment() {
      this.moment.userId = this.$store.state.userId;
      this.moment.content = this.$refs.moment_input.value;
      if (this.moment.content.length<5){
        this.$message.warn("内容过少");
        return;
      }
      const res = await postMoment(
        this.moment,
        this.$store.state.authorization
      );
      if (res.success) {
        this.moment.image = [];
        this.$message.success("瞬间发布成功");
        this.momentList.push(res.data[0]);
      }
      this.$refs.moment_input.value = "";
      const moment = document.getElementById("moment");
      moment.setAttribute(
        "placeholder",
        "快和大家分享你每日遇到的有趣的故事把，文明交流哦O(∩_∩)O"
      );
      this.$refs.tag.style.display = "none";
      this.moment.content = "";
    },

    async executeGetMoments() {
      const res = await getMoments();
      this.momentList = res;
      console.log(this.momentList);
    },
  },
  components: {
    Moment,
    Picker,
  },

  async created() {
    this.$store.commit(
      "changeUserInfo",
      JSON.parse(localStorage.getItem("userInfo"))
    );

    this.executeGetMoments();
    this.loading = true;
    setTimeout(() => {
    this.loading = false;
    }, 400);
  },

  mounted() {
    const title = document.getElementsByTagName("title")[0];
    title.innerText = "小小博客-瞬间发布";
  },
};
</script>

<style lang="less" scoped>
.empty{
  background: #fff;
  width: 100%;
  text-align: center;
  height: max-content;
  p{
    color: #ddd;
  }
}
.ant-dropdown-menu {
  width: 300px;
  height: 200px;
  overflow: auto;
}
.ant-dropdown-menu-item:hover > span {
  color: rgb(17, 139, 221);
}
.ant-dropdown-menu-item {
  text-align: center;
  display: flex;
  align-items: center;
  height: 60px;
  width: 90%;

  line-height: 40px;
  margin: 10px auto;

  padding: 0 0;
  img {
    width: 60px;
    height: 60px;
  }
  span {
    margin: 0 10px;
    text-align: center;
  }
}
.ant-dropdown-menu-item:hover {
  background: #f4f5f5;
}
main {
  display: flex;
  width: max-content;
  margin: 30px auto;
  align-items: flex-start;
}
.moment-container {
  width: 100vw;
  border: 1px solid transparent;
  background: #f4f5f5;
  justify-content: space-evenly;

  article {
    width: 660px;
    margin: 0 30px;
    background: #f4f5f5;

    .edit-container {
      width: 100%;
      height: 280px;
      border: solid 1px transparent;
      background: #fff;
      margin: 0 auto;
      padding: 0 0 20px 0;
      box-shadow: 0 0 2px #eee;
      .edit-box {
        width: 95%;
        // height: 200px;
        margin: 15px auto 0;
        text-align: center;
        position: relative;
        .momentImage-container {
          position: absolute;
          display: flex;
          width: 100%;
          height: 60px;
          bottom: 10px;
          justify-content: space-between;
          align-items: center;
        }
        .momentImage-list {
          display: flex;
          justify-content: flex-start;
          height: 100%;
          width: 80%;
          li {
            list-style: none;
            margin: 0 10px;
            img {
              width: 60px;
              height: 60px;
              border-radius: 4px;
            }
          }
        }
      }
      .action-box {
        width: 95%;
        margin: 0 auto;
        display: flex;
        height: 60px;
        justify-content: space-between;
        align-items: center;
      }
      textarea {
        resize: none;
        outline: none;
        width: 100%;
        height: 200px;
        border: 1px solid #eee;
        border-radius: 3px;
        transition: 0.4s;
        font-size: 12px;
        padding: 5px 5px;
        background: #f2f3f5;
      }
      textarea:focus {
        border: 1px solid rgb(17, 122, 221);
        background: #fff;
      }
      textarea::placeholder {
        font-size: 13px;
        letter-spacing: 2px;
        color: #ccc;
      }
      .post {
        width: 80px;
        background: #d2e6ff;
        color: #fff;
        border-radius: 0 0;
        border: none;
      }
      ul {
        margin: 0 0;
        width: 240px;
        display: flex;
        height: 40px;
        align-items: center;
        justify-content: space-between;
        li {
          list-style: none;
          a {
            color: #777;
            font-size: 12px;
          }
          a:hover {
            color: rgb(17, 163, 221);
          }
        }
      }
    }

    .tab {
      margin: 10px 0;
      width: 100%;
      height: 60px;
      border: 1px solid transparent;
      display: flex;
      background: #fff;
      align-items: center;
      box-shadow: 0 0 2px #eee;
      .active {
        color: #1d7dfa;
      }
      li {
        list-style: none;
        margin: 20px;
        a {
          color: #777;
        }
      }
    }
  }

  aside {
    width: 120px;
    height: 600px;

    .userMomentInfo {
      width: 240px;
      height: 200px;
      border: 1px solid transparent;
      background: #fff;
      box-shadow: 0 0 2px #eee;

      .userProfile {
        display: flex;
        width: 80%;
        margin: 15px auto;
        height: 60px;
        align-items: center;
        padding: 20px 0;

        img {
          margin: 0 10px;
          width: 45px;
          height: 45px;
          border-radius: 50%;
        }
      }

      .surfing {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 90%;
        border-top: 1px solid #eee;
        margin: 0 auto;
        ul {
          justify-content: space-evenly;
          display: flex;
          align-items: center;
          margin: 0 0;
          height: 35px;
          li {
            list-style: none;
            margin-bottom: 0;
            margin-top: 0;
            font-size: 12px;
          }
        }
        ul:first-child {
          top: 20px;
          li {
            width: 30px;
            text-align: center;
            margin-left: -20px;
            margin-top: 15px;
            li::nth-child(3) {
              color: red;
              margin-left: 20px;
            }
          }
        }
      }
    }
  }

  .circleCategory {
    width: 200px;
    background: #fff;
    li {
      list-style: none;
      padding: 10px 10px;
      text-align: center;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      .title {
        margin-right: 25px;
        width: 120px;
        text-align: left;
        font-size: 12px;
        align-self: center;
      }
    }
    li:hover {
      background: #eef;
      color: #1d7dfa;
    }
  }
}
</style>