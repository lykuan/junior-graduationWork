<template>
  <div class="comment-list-container">
    <div class="avatar_box">
      <a href="" @mouseenter="userDetail"
        ><img
          v-if="singleComment.commenterInfo[0].userInfo.avatarURL != 'null'"
          :src="singleComment.commenterInfo[0].userInfo.avatarURL"
          alt="" /><img
          v-if="singleComment.commenterInfo[0].userInfo.avatarURL == 'null'"
          src="../../assets/img/defaultAvatar.jpg"
          alt=""
      /></a>
    </div>
    <div class="comment-content-main">
      <div class="user_box" style="width: 100%">
        <a
          href=""
          @mouseenter="userDetail"
          style="color: #000; fong-weight: 800; font-size: 12px"
          >{{ singleComment.commenterInfo[0].userInfo.nickname
          }}<span v-if="isAuthor" style="margin: 0 5px">(作者)</span></a
        ><a-divider
          type="vertical"
          v-if="singleComment.commenterInfo[0].userInfo.position !== ' '"
        /><span
          v-if="singleComment.commenterInfo[0].userInfo.position"
          style="font-size: 12px; margin: 0"
          >{{ singleComment.commenterInfo[0].userInfo.position }}</span
        ><a-divider type="vertical" /><span
          style="font-size: 12px; margin: 0"
          >{{ commentPublishAt }}</span
        >
      </div>
      <div style="width: 100%; font-size: 12px; margin: 10px 0">
        {{ singleComment.commentInfo.commentContent }}
      </div>
      <div class="action_box">
        <div class="action_comment" v-show="commentLiked == 0">
          <a @click="giveLike"> <a-icon type="like"></a-icon> 点赞</a>
        </div>
        <div v-show="commentLiked.length >= 1">
          <a @click="giveLike">
            <span :class="{ liked: liked }"
              ><a-icon
                type="like"
                theme="filled"
                :class="{ liked: liked }"
              ></a-icon>
              {{ commentLiked.length }}</span
            ></a
          >
        </div>
        <div class="action_comment" style="width: 80px">
          <a
            ><i class="el-icon-chat-dot-square" :class="commentId"></i>
            <span
              @click="replyComment"
              :id="commentId"
              v-if="singleComment.commentInfo.reply.length == 0"
              style="width: 50%;margin:0 2px"
            >
              回复</span
            ><span
              @click="hide"
              style="font-size: 12px; display: none; color: #1d7dfa"
              :ref="singleComment.createTime"
              >取消回复</span
            >
            <span
              v-show="singleComment.commentInfo.reply.length > 0"
              @click="replyComment"
              style="margin: 0 2px; display: inline-block; width: 30px"
              ref="commentNum"
              >{{ this.replyLists.length }}</span
            ></a
          >
        </div>
      </div>

      <div class="reply_container" :ref="commentId">
        <div>
          <input
            @focus="showReplyUser"
            :ref="commentId + '1'"
            id="reply_input"
            style="padding: 0 8px; letter-spacing: 1px"
          />
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
                style="margin: 0 3px; font-size: 12px; color: #777" /><span
                style="font-size: 12px; color: #777"
                >表情
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
                  <Picker
                    :data="emojiIndex"
                    set="twitter"
                    @select="addEmoji"
                  /></div></span
            ></a>

            <a-button @click="replyMessage">回复</a-button>
          </div>
        </div>
      </div>
      <reply
        v-for="item in replyLists"
        :key="item._id"
        :replyData="item"
      ></reply>
    </div>
  </div>
</template>

<script>
import { likedComment, replyComment } from "../../api/comment";
// Import data/twitter.json to reduce size, all.json contains data for
// all emoji sets.
import data from "emoji-mart-vue-fast/data/all.json";
// Import default CSS
import "emoji-mart-vue-fast/css/emoji-mart.css";

import { Picker, EmojiIndex } from "emoji-mart-vue-fast";

let emojiIndex = new EmojiIndex(data);
import reply from "./reply.vue";
export default {
  name: "comment",
  props: ["commentData"],
  data() {
    return {
      commentPublishAt: "",
      presentAvatar: "",
      isAuthor: false,
      commentLiked: [],
      emojiIndex: emojiIndex,
      emojisOutput: "",
      replyLists: "",
      singleComment: "",
      commentId: "",
    };
  },
  components: {
    reply,
    Picker,
  },
  methods: {
    showReplyUser(e) {
      e.target.setAttribute(
        "placeholder",
        `回复${this.singleComment.commenterInfo[0].userInfo.nickname}...`
      );
    },
    replyComment(e) {
      if (
        this.$refs[this.commentId].style.display == "" ||
        this.$refs[this.commentId].style.display == "none"
      ) {
        e.target.style.display = "none";
        document.getElementsByClassName(this.commentId)[0].style.color =
          "#1d7dfa";
        this.$refs[this.singleComment.createTime].style.display =
          "inline-block";
        this.$refs.commentNum.style.display = "none";
        this.$refs[this.commentId].style.display = "block";
      } else {
        document.getElementsByClassName(this.commentId)[0].style.color = "#777";
      }
    },
    async replyMessage(e) {
      const u_id = this.$store.state.userId;
      const c_id = this.commentId;
      const id = this.commentId + "1";
      const replyContent = this.$refs[id].value;

      const res = await replyComment(c_id, u_id, replyContent);
      console.log(res);
      this.$refs[id].value = "";
      // for(let i of res){
      //   i.reply_id = this.commentData._id;
      // }
      this.replyLists = res;
      console.log(this.replyLists.length);
      this.$refs[this.commentId].style.display = "none";

      const i = document.getElementsByClassName(this.commentId)[0];
      this.$refs[this.singleComment.createTime].style.display = "none";
      this.$refs.commentNum.style.display = "inline-block";
      i.style.color = "#777";
    },
    hideEmoji(e) {
      e.target.style.display = "none";
      this.$refs.commentNum.style.display = "inline-block";
      this.$refs[this.commentId].style.display = "none";
    },
    addEmoji(emoji) {
      console.log(emoji);
      const id = this.commentId + "1";
      this.$refs[id].value += emoji.native;
    },
    showEmoji() {
      this.$refs.emoji_container.style.display = "block";
    },
    userDetail(e) {
      console.log(e);
    },
    async giveLike() {
      const u_id = this.$store.state.userId;
      const c_id = this.commentId;
      console.log(this.commentData.data);
      console.log(u_id, c_id);
      const res = await likedComment(u_id, c_id);
      console.log(res);
      this.commentLiked = res.likes;
      // console.log(this.commentLiked);
    },
    hide(e) {
      e.target.style.display = "none";
      document.getElementsByClassName(this.commentId)[0].style.color = "#777";
      if (this.replyLists.length > 0) {
        this.$refs.commentNum.style.display = "inline-block";
      } else {
        document.getElementById(this.commentId).style.display = "inline-block";
      }
      this.$refs[this.commentId].style.display = "none";
    },
  },
  computed: {
    liked() {
      return this.commentLiked.includes(this.$store.state.userId);
    },
  },
  mounted() {},
  async created() {
    console.log(this.commentData);
    this.singleComment = this.commentData.data[0];

    this.commentId = this.commentData._id;
    this.replyLists = this.singleComment.commentInfo.reply;
    this.presentAvatar = localStorage.getItem("userAvatar");
    const author = JSON.parse(sessionStorage.getItem("viewArticle"));
    this.isAuthor = author.author_id == this.singleComment.commentInfo.user;

    this.commentLiked = this.singleComment.commentInfo.commentLiked;

    let NowYear = new Date().getFullYear();
    let NowMonth = new Date().getMonth() + 1;
    let NowDay = new Date().getDate();
    let NowHours = new Date().getHours();
    let NowMinutes = new Date().getMinutes();

    let publishYear = new Date(this.singleComment.createTime).getFullYear();
    let publishMonth = new Date(this.singleComment.createTime).getMonth() + 1;
    let publishDay = new Date(this.singleComment.createTime).getDate();
    let publishHour = new Date(this.singleComment.createTime).getHours();
    let publishMinute = new Date(this.singleComment.createTime).getMinutes();
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
.comment-list-container {
  width: 90%;
  // height: 100px;
  padding: 5px 0;
  // margin
  display: flex;
  margin: 0 auto;
  border-bottom: 1px solid #ddd;
  .liked {
    color: #1d7dfa;
    transition: all 0.3s;
    animation: liked 0.5s ease-out;
  }
  .el-icon-chat-dot-square:hover {
    color: #1d7dfa;
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
      width: 35px;
      height: 35px;
      border-radius: 50%;
    }
  }
  .comment-content-main {
    flex-grow: 1;
    // border: 1px solid black;
    display: flex;
    margin-left: 10px;
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