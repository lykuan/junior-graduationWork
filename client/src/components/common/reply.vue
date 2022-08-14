<template>
  <div class="reply-list-container">
    <div class="avatar_box">
      <a href="" @mouseenter="userDetail"
        ><img
          v-if="replyData.userInfo.avatarURL != 'null'"
          :src="replyData.userInfo.avatarURL"
          alt="" /><img
          v-if="replyData.userInfo.avatarURL == 'null'"
          src="../../assets/img/defaultAvatar.jpg"
          alt=""
      /></a>
    </div>
    <div class="reply-content-main">
      <div class="user_box" style="width: 100%">
        <a
          href=""
          @mouseenter="userDetail"
          style="color: #000; fong-weight: 800; font-size: 12px"
          >{{ replyData.userInfo.nickname
          }}<span v-if="isAuthor" style="margin: 0 5px">(作者)</span></a
        ><a-divider
          type="vertical"
          v-if="replyData.userInfo.position !== ' '"
        /><span
          v-if="replyData.userInfo.position"
          style="font-size: 12px; margin: 0"
          >{{ replyData.userInfo.position }}</span
        ><a-divider type="vertical" /><span
          style="font-size: 12px; margin: 0"
          >{{ commentPublishAt }}</span
        >
      </div>
      <div style="width: 100%; font-size: 12px; margin: 5px 0">
        {{ replyData.replyContent }}
      </div>
      <div class="action_box">
        <div class="action_comment" v-show="replyData.replyLiked.length == 0">
          <a @click="giveReplyLike"> <a-icon type="like"></a-icon> 点赞</a>
        </div>
        <div v-show="replyData.replyLiked.length >= 1">
          <a @click="giveReplyLike">
            <span :class="{ liked: liked }"
              ><a-icon
                type="like"
                theme="filled"
                :class="{ liked: liked }"
              ></a-icon>
              {{ replyData.replyLiked.length }}</span
            ></a
          >
        </div>
        <div class="action_comment">
          <a
            ><i class="el-icon-chat-dot-square"></i>
            <span @click="replyComment"> 回复</span></a
          >
        </div>
      </div>

      <div class="reply_container" :ref="replyData._id">
        <div>
          <input :ref="replyData._id + '1'" id="reply_input" />
        </div>
        <div style="position: relative">
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-top: 5px;
            "
          >
            <a @click="showEmoji"
              ><a-icon
                type="meh"
                style="margin: 0 3px; font-size: 12px; color: #777"
              /><span style="font-size: 12px; color: #777">表情</span></a
            >

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

            <a-button @click="replyMessage">回复</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { likedComment, replyComment, replyLiked } from "../../api/comment";

// Import data/twitter.json to reduce size, all.json contains data for
// all emoji sets.
import data from "emoji-mart-vue-fast/data/all.json";
// Import default CSS
import "emoji-mart-vue-fast/css/emoji-mart.css";

import { Picker, EmojiIndex } from "emoji-mart-vue-fast";

let emojiIndex = new EmojiIndex(data);
export default {
  name: "comment",
  props: ["replyData"],
  data() {
    return {
      commentPublishAt: "",
      presentAvatar: "",
      isAuthor: false,
      commentLiked: [],
      emojiIndex: emojiIndex,
      emojisOutput: "",
    };
  },
  components: {
    Picker,
  },
  methods: {
    replyComment(e) {
      if (
        this.$refs[this.replyData._id].style.display == "" ||
        this.$refs[this.replyData._id].style.display == "none"
      ) {
        e.target.style.color = "#1d7dfa";
        e.target.innerText = "取消回复";
        e.target.previousElementSibling.style.color = "#1d7dfa";
        this.$refs[this.replyData._id].style.display = "block";
      } else {
        this.$refs[this.replyData._id].style.display = "none";
        e.target.previousElementSibling.style.color = "#777";

        e.target.innerText = "回复";
        e.target.style.color = "#777";
      }
    },
    async replyMessage(e) {
      const u_id = this.$store.state.userId;
      const a_id = this.replyData.article_id;
      const c_id = this.replyData._id;
      const id = this.replyData._id + "1";
      console.log(this.$refs[id].value);
      const replyContent = this.$refs[id].value;

      const res = await replyComment(a_id, c_id, u_id, replyContent);
      this.$refs[id].value = "";
      this.replyList = res;
    },
    hideEmoji(e) {
      e.target.style.display = "none";
    },
    addEmoji(emoji) {
      console.log(emoji);
      const id = this.replyData._id + "1";
      this.$refs[id].value += emoji.native;
    },
    showEmoji() {
      this.$refs.emoji_container.style.display = "block";
    },
    userDetail(e) {
      console.log(e);
    },
    async giveReplyLike() {
      const a_id = JSON.parse(sessionStorage.getItem("viewArticle"))._id;
      const u_id = this.$store.state.userId;
      const c_id = this.replyData._id;
      const r_id = this.replyData._id;
      console.log(this.replyData, r_id, u_id, a_id);
      // const res = await replyLiked(u_id, c_id);
      // this.commentLiked = res.likes;
      // console.log(this.commentLiked);
    },
  },
  computed: {
    liked() {
      return this.replyData.replyLiked.includes(this.$store.state.userId);
    },
  },
  mounted() {},
  async created() {
    this.presentAvatar = localStorage.getItem("userAvatar");
    const author = JSON.parse(sessionStorage.getItem("viewArticle"));
    this.isAuthor = author.author_id == this.replyData.user;
    this.commentLiked = this.replyData.commentLiked;
    let NowYear = new Date().getFullYear();
    let NowMonth = new Date().getMonth() + 1;
    let NowDay = new Date().getDate();
    let NowHours = new Date().getHours();
    let NowMinutes = new Date().getMinutes();

    let publishYear = new Date(this.replyData.createTime).getFullYear();
    let publishMonth = new Date(this.replyData.createTime).getMonth() + 1;
    let publishDay = new Date(this.replyData.createTime).getDate();
    let publishHour = new Date(this.replyData.createTime).getHours();
    let publishMinute = new Date(this.replyData.createTime).getMinutes();
    if (NowYear != publishYear) {
      this.commentPublishAt = NowYear - publishYear + "年前";
    } else if (NowHours == publishHour && NowMinutes == publishMinute) {
      this.commentPublishAt = "刚刚";
    } else if (
      NowMonth == publishMonth &&
      NowDay == publishDay &&
      NowHours == publishHour &&
      publishMinute < 60
    ) {
      this.commentPublishAt = NowMinutes - publishMinute + "分前";
    } else if (
      NowMonth == publishMonth &&
      NowHours - publishHour == 1 &&
      60 - publishHour + NowMinutes < 60
    ) {
      this.commentPublishAt = 60 - publishMinute + NowMinutes + "分前";
    } else if (
      NowMonth == publishMonth &&
      NowDay == publishDay &&
      NowHours != publishHour
    ) {
      this.commentPublishAt = NowHours - publishHour + "小时前";
    } else if (
      NowMonth == publishMonth &&
      NowDay != publishDay &&
      NowDay - publishDay == 1 &&
      24 - publishHour + NowHours < 24
    ) {
      this.commentPublishAt = 24 - publishHour + NowHours + "小时前";
    } else if (NowMonth != publishMonth) {
      this.commentPublishAt = 30 - publishDay + NowDay + "天前";
    } else if (NowMonth == publishMonth && NowDay - publishDay >= 1) {
      this.commentPublishAt = NowDay - publishDay + "天前";
    } else if (NowMonth != publishMonth && NowMonth - publishMonth >= 1) {
      this.commentPublishAt = NowMonth - publishMonth + "月前";
    }
  },
};
</script>

<style lang="less" scoped>
.reply-list-container {
  width: 90%;
  // height: 100px;
  padding: 8px 8px 0 8px;
  // margin
  display: flex;
  margin: 0 0 0 0;
  background: #f7f8fa;

  border-bottom: 1px solid #ddd;

  .liked {
    color: #1d7dfa;
    transition: all 0.3s;
    animation: liked 0.5s ease-out;
  }

  @keyframes liked {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1);
    }
  }
  .avatar_box {
    // border: 1px solid red;
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin:  0 10px;
    }
  }
  .reply-content-main {
    flex-grow: 1;
    // border: 1px solid black;
    display: flex;
    margin-left: 5px;
    flex-direction: column;
    justify-content: space-between;
  }
  .user_box {
    span:first-child {
      margin: 0;
    }
    span {
      margin: 0 10px;
    }
  }
  .action_box {
    width: 100%;
    display: flex;
    margin: 5px 0;
    div:last-child {
      margin-left: 10px;
    }
    a {
      font-size: 12px;
      color: #777;
    }
  }
  .reply_container {
    margin: 10px 0;
    width: 100%;
    padding: 10px 5px;
    background: #dfecf7;
    transition: all 0.4s;
    display: none;
    #reply_input {
      width: 100%;
      border: 1px solid #eee;
      height: 32px;
      outline: none;
      transition: all 0.3s;
      font-size: 12px;
    }

    .ant-btn {
      border-radius: 0;
      background: #51bae4;
      color: #fff;
      font-size: 13px;
    }
  }
  #reply_input:focus {
    border: 1px solid #1d7dfa;
  }

  .action_comment {
    :hover {
      color: #1d7dfa;
    }
  }
}
</style>