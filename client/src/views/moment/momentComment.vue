<template>
  <div class="comment-list-container">
    <div class="avatar_box" style="cursor: pointer">
      <a-popover>
        <template slot="content">
          <div class="profileCard" style="width: 220px">
            <div class="profileCard-userInfo">
              <img
                :src="momentCommentData.commenterInfo.userInfo.avatarURL"
                alt=""
              />
              <div style="padding 0 20px;">
                <p style="margin: 0 0">
                  {{ momentCommentData.commenterInfo.userInfo.nickname }}
                </p>
                <p
                  style="
                    margin: 5px 0;
                    width: 100px;
                    font-size: 13px;
                    overflow: hidden;
                    color: #aaa;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  "
                >
                  <span>{{
                    momentCommentData.commenterInfo.userInfo.position
                  }}</span>
                  <span>{{
                    momentCommentData.commenterInfo.userInfo.company
                  }}</span>
                </p>
              </div>
            </div>

            <div class="profileCard-actionBox">
              <div style="display: flex; align-items: center; width: 100px">
                <div style="margin-right: 20px">
                  <p
                    style="
                      margin: 0 0;
                      color: #000;
                      font-weight: 600;
                      text-align: center;
                      font-weight:800;
                    "
                  >
                    {{ momentCommentData.commenterInfo.userInfo.follow.length }}
                  </p>
                  <p style="margin: 0 0; font-size: 13px; color: #777">关注</p>
                </div>
                <div>
                  <p
                    style="
                      margin: 0 0;
                      color: #000;
                      font-weight: 800;
                      text-align: center;

                    "
                  >
                    {{
                      momenterFollower.length
                    }}
                  </p>
                  <p style="margin: 0 0; font-size: 13px; color: #777">
                    关注者
                  </p>
                </div>
              </div>
              <a
                v-if="
                  !isFollowed &&
                  momentCommentData.commenter != $store.state.userId
                "
                style="
                  border: 1px solid;
                  width: 50px;
                  height: 25px;
                  line-height: 25px;
                  text-align: center;
                  color: #65bbc8;
                  font-size: 12px;
                "
                @click="followed"
                >关注</a
              >
              <a
                @click="followed"
                v-if="isFollowed"
                style="
                  border: 1px solid;
                  width: 50px;
                  height: 25px;
                  line-height: 25px;
                  text-align: center;
                  color: #fff;
                  background: #65bbc8;
                  font-size: 12px;
                "
                >已关注</a
              >
            </div>
          </div>
        </template>

        <a href=""
          ><img
            v-if="momentCommentData.commenterInfo.userInfo.avatarURL != 'null'"
            :src="momentCommentData.commenterInfo.userInfo.avatarURL"
            alt="" /><img
            v-if="momentCommentData.commenterInfo.userInfo.avatarURL == 'null'"
            src="../../assets/img/defaultAvatar.jpg"
            alt=""
        /></a>
      </a-popover>
    </div>
    <div class="comment-content-main">
      <div class="user_box" style="width: 100%">
        <a
          href=""
          @mouseenter="userDetail"
          style="color: #000; fong-weight: 800; font-size: 12px"
          >{{ momentCommentData.commenterInfo.userInfo.nickname
          }}<span v-if="isAuthor" style="margin: 0 5px">(作者)</span></a
        ><a-divider
          type="vertical"
          v-if="momentCommentData.commenterInfo.userInfo.position !== ' '"
        /><span
          v-if="momentCommentData.commenterInfo.userInfo.position"
          style="font-size: 12px; margin: 0"
          >{{ momentCommentData.commenterInfo.userInfo.position }}</span
        ><a-divider type="vertical" /><span
          style="font-size: 12px; margin: 0"
          >{{ commentPublishAt }}</span
        >
      </div>
      <div style="width: 100%; font-size: 12px; margin: 10px 0">
        {{ momentCommentData.commentContent }}
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
            <span @click="replyComment" :id="commentId" style="width: 50%">
              回复</span
            ><span
              @click="hide"
              style="font-size: 12px; display: none; color: #1d7dfa"
              :ref="momentCommentData.createTime"
              >取消回复</span
            >
            <span
            v-if="this.replyLists.length>0"
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
                style="margin: 0 3px; font-size: 12px; color: #777"
              /><span style="font-size: 12px; color: #777">表情</span></a
            >

            <div
              @mouseleave="hideEmoji"
              class="emoji-container"
              style="display: none; margin: 5px 0"
              ref="emoji_container"
            ></div>
            <a-button @click="replyMessage">回复</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { likedComment, replyComment } from "../../api/comment";
import { followedUser } from "../../api/users";

// Import data/twitter.json to reduce size, all.json contains data for
// all emoji sets.
import data from "emoji-mart-vue-fast/data/all.json";
// Import default CSS
import "emoji-mart-vue-fast/css/emoji-mart.css";

import { Picker, EmojiIndex } from "emoji-mart-vue-fast";

let emojiIndex = new EmojiIndex(data);
export default {
  name: "comment",
  props: ["momentCommentData"],
  data() {
    return {
      commentPublishAt: "",
      presentAvatar: "",
      isAuthor: false,
      commentLiked: [],
      search: "Search",
      notfound: "No Emoji Found",
      replyLists: [],
      singleComment: "",
      commentId: "",
      momenterFollower: [],
      emojiIndex: emojiIndex,
      emojisOutput: "",
    };
  },

  components: {
    Picker,
  },
  methods: {
    showReplyUser(e) {
      e.target.setAttribute(
        "placeholder",
        `回复${this.singleComment.commenterInfo.userInfo.nickname}...`
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
      const res = await likedComment(u_id, c_id);
      this.commentLiked = res.likes;
      console.log(this.commentLiked);
    },

    async followed() {
      const user = this.momentCommentData.commenter;
      const myId = this.$store.state.userId;
      const res = await followedUser(user, myId);
      console.log(res);
      this.momenterFollower = res;
    },

    hide() {},
  },
  computed: {
    liked() {
      return this.commentLiked.includes(this.$store.state.userId);
    },

    isFollowed() {
      const user = this.$store.state.userId;
      return this.momenterFollower.includes(user);
    },
  },
  mounted() {},
  async created() {
    // const author = JSON.parse(sessionStorage.getItem("viewArticle"));
    // this.isAuthor = author.author_id == this.singleComment.commentInfo.user;

    // this.commentLiked = this.singleComment.commentInfo.commentLiked;
    this.momenterFollower =
      this.momentCommentData.commenterInfo.userInfo.follower;
    let NowYear = new Date().getFullYear();
    let NowMonth = new Date().getMonth() + 1;
    let NowDay = new Date().getDate();
    let NowHours = new Date().getHours();
    let NowMinutes = new Date().getMinutes();
    let publishYear = new Date(this.momentCommentData.createTime).getFullYear();
    let publishMonth =
      new Date(this.momentCommentData.createTime).getMonth() + 1;
    let publishDay = new Date(this.momentCommentData.createTime).getDate();
    let publishHour = new Date(this.momentCommentData.createTime).getHours();
    let publishMinute = new Date(
      this.momentCommentData.createTime
    ).getMinutes();

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
      60 - publishMinute + NowMinutes < 60
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
.profileCard {
  padding: 5px 10px;
  width: 200px;

  .profileCard-userInfo {
    display: flex;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }

  .profileCard-actionBox {
    display: flex;
    height: 60px;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
  }
}
.comment-list-container {
  width: 100%;
  // height: 100px;
  padding: 10px 0;
  // margin
  display: flex;
  // margin: 0 0 0 40px;
  padding-left: 20px;

  border-bottom: 1px solid #ddd;
  // border: 1px solid;
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