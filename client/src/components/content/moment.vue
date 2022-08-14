<template>
  <div class="moment" @blur="hideActionBox">
    <div class="content-area" style="display: flex">
      <div class="avatar_box">
        <a-popover>
          <template slot="content">
            <div class="momenter-profileCard">
              <div class="profile-presentation">
                <img
                  :src="momentData.momenterInfo[0].userInfo.avatarURL"
                  alt=""
                />
                <div style="margin-left: 10px">
                  <div style="color: #000; font-size: 15px">
                    {{ momentData.momenterInfo[0].userInfo.nickname }}
                  </div>
                  <div>
                    <span
                      style="
                        font-size: 12px;
                        color: #777;
                        display: inline-block;
                        width: 100px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                      "
                      >{{ momentData.momenterInfo[0].userInfo.position }}</span
                    ><span style="font-size: 13px; color: #777">{{
                      momentData.momenterInfo[0].userInfo.company
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="follow-action">
                <a-button
                  @click="followed"
                  v-if="
                    momentData.momenter != $store.state.userId && !isFollowed
                  "
                  ><a-icon type="plus" />关注</a-button
                >
                <a-button
                  @click="followed"
                  v-if="isFollowed"
                  style="background: #eef; color: #1d7dfa"
                  ><a-icon type="check" />取消关注</a-button
                >
              </div>
              <div class="followData">
                <section>
                  <p style="margin: 0 0; text-align: center; color: #000">
                    {{ momentData.momenterInfo[0].userInfo.follow.length }}
                  </p>
                  <p style="margin: 2px 0; text-align: center; font-size: 13px">
                    关注
                  </p>
                </section>
                <div><a-divider type="vertical" style="height: 30px" /></div>
                <section>
                  <p style="margin: 0 0; text-align: center; color: #000">
                    {{ momentData.momenterInfo[0].userInfo.follower.length }}
                  </p>
                  <p style="margin: 2px 0; text-align: center; font-size: 13px">
                    关注者
                  </p>
                </section>
              </div>
            </div>
          </template>

          <a @mouseenter="showUserProfileCard">
            <img :src="momentData.momenterInfo[0].userInfo.avatarURL" alt=""
          /></a>
        </a-popover>
      </div>

      <div class="main_content">
        <div style="transform: translateY(-30%)">
          <p style="margin: 0 0; font-size: 16px; color: #000">
            {{ momentData.momenterInfo[0].userInfo.nickname }}
          </p>
        </div>
        <div
          style="
            font-size: 12px;
            transform: translateY(-80%);
            margin: 0 0;
            color: #777;
            position: relative;
          "
        >
          {{ momentData.momenterInfo[0].userInfo.position }}

          <span v-if="momentData.momenterInfo[0].userInfo.company">@</span
          >{{ momentData.momenterInfo[0].userInfo.company }}
          <span style="margin: 0 3px">· </span>
          <span>{{ momentPublishDate }}</span>

          <span style="position: absolute; right: 0">
            <el-dropdown size="medium" placement="bottom">
              <a-icon
                type="ellipsis"
                style="font-size: 16px; cursor: pointer"
                v-show="momentData.momenter == $store.state.userId"
              />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  ><a
                    @click="confirmDelete"
                    style="
                      display: inline-block;
                      width: 50px;
                      height: 30px;
                      text-align: center;
                      color: #777;
                    "
                    >删除</a
                  >
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>

        <div class="moment_content">
          {{ momentData.content }}
        </div>
        <div class="showLargerImage" :ref="'larger-container' + momentData._id">
          <ul>
            <li>
              <a @click="concealLarger"
                ><i class="el-icon-zoom-out"></i> 收起</a
              >
            </li>
            <li>
              <a @click="checkLargerPicture"
                ><i class="el-icon-zoom-in"></i> 查看大图</a
              >
            </li>
            <li>
              <a @click="turnLeft"
                ><i class="el-icon-refresh-left"></i> 向左旋转</a
              >
            </li>
            <li>
              <a @click="turnRight"
                ><i class="el-icon-refresh-right"></i> 向右旋转</a
              >
            </li>
          </ul>
          <div :ref="'largerImage-case' + momentData._id">
          <img
            :src="largerImage"
            alt=""
            :ref="'largerImage' + momentData._id"
            style="width: 100%; height: 100%"
          />
          </div>
        </div>
        <ul class="image-list" v-show="momentData.momentImage.length > 0">
          <li v-for="item in momentData.momentImage" :key="item">
            <img
              class="image"
              @click.stop="showLargerPicture"
              :src="item"
              alt=""
            />
          </li>
        </ul>
        <p
          v-if="momentData.circle"
          ref="tag"
          style="
              position:relative;
              margin-top:10px;
              background: #eaf2ff;
              width: 110px;
              height: 30px;
              bottom:-20px;
              left:0
              text-align: left;
              border-radius:40px 40px 40px 0;
              
            "
        >
          <a
            style="
              margin-top:6px;
                font-size: 12px;
                background: #1d7dfa;
                display: inline-block;
                color: #fff;
                width: 16px;
                height: 16px;
                border-radius:45%
                text-align:right;
                margin-left:10px;
                padding-left:2px;
              "
            ><a-icon type="number" /></a
          ><span
            style="top: 6px; font-size: 12px; margin: 0 5px; color: #1d7dfa"
            >{{ momentData.circle }}</span
          >
        </p>
      </div>
    </div>

    <ul class="action_box" :id="'action_box' + momentData._id">
      <li>
        <a><a-icon type="share-alt" /> 转发</a>
      </li>
      <a-divider type="vertical" />
      <li>
        <a @click="showComment"
          ><i class="el-icon-chat-round"></i>
          <span
            style="margin: 0 2px"
            v-show="momentData.momentComments.length == 0"
            >评论</span
          ><span
            v-show="momentData.momentComments.length > 0"
            style="margin: 0 2px"
            >{{ allComments }}</span
          ></a
        >
      </li>
      <a-divider type="vertical" />
      <li>
        <a @click="handlelikedMoment"
          ><a-icon type="like" v-show="momentLiked.length == 0" />
          <a-icon
            type="like"
            theme="filled"
            v-show="momentLiked.length > 0"
            :class="{ liked: userLiked }"
          />
          <span v-show="momentLiked.length == 0" style="margin: 0 2px"
            >点赞</span
          ><span
            v-show="momentLiked.length > 0"
            :class="{ liked: userLiked }"
            style="margin: 0 2px"
            >{{ momentLiked.length }}</span
          ></a
        >
      </li>
    </ul>

    <div class="reviewMoment" :ref="momentData._id">
      <img :src="$store.state.userAvatar" alt="" />
      <div class="reply_container">
        <div>
          <input
            id="reply_input"
            :ref="'reply_input' + momentData._id"
            style="padding: 0 8px; letter-spacing: 1px"
            autocomplete="off"
            @focus="showActionBox"
            placeholder="请发表评论(Enter 换行)"
          />
        </div>
        <div style="position: relative; display: none" :id="momentData._id">
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
                  :ref="'emoji_container' + momentData._id"
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

            <a-button @click="reviewMoment">回复</a-button>
          </div>
        </div>
      </div>
    </div>

    <ul class="commentShowcase" :id="'commentShowcase' + momentData._id">
      <div class="title" v-show="momentCommentList.length > 0">
        <div>全部评论 （{{ allComments }}）</div>
        <div>
          <a @click="showNew(commentList, $event)"
            ><span ref="new">最新</span></a
          ><a-divider type="vertical" /><a @click="showHot(commentList, $event)"
            ><span ref="hot">最热</span></a
          >
        </div>
      </div>
      <li
        style="list-style: none"
        v-for="item in momentCommentList"
        :key="item._id"
      >
        <momentComment :momentCommentData="item"></momentComment>
      </li>
    </ul>
  </div>
</template>

<script>
import { likedMoment, deleteMoment, reviewMoment } from "../../api/moment";

import { followedUser } from "../../api/users";
import momentComment from "../../views/moment/momentComment.vue";

// Import data/twitter.json to reduce size, all.json contains data for
// all emoji sets.
import data from "emoji-mart-vue-fast/data/all.json";
// Import default CSS
import "emoji-mart-vue-fast/css/emoji-mart.css";

import { Picker, EmojiIndex } from "emoji-mart-vue-fast";

let emojiIndex = new EmojiIndex(data);
export default {
  name: "Moment",
  props: ["momentData"],
  data() {
    return {
      momentPublishDate: "",
      momentLiked: [],
      momentCommentList: [],
      momenterFollower: [],
      emojiIndex: emojiIndex,
      emojisOutput: "",
      largerImage: "",
      angle: 0,
    };
  },
  components: {
    momentComment,
    Picker,
  },
  computed: {
    userLiked() {
      const user = this.$store.state.userId;
      return this.momentLiked.includes(user);
    },
    allComments() {
      return this.momentData.momentComments.length;
    },

    isFollowed() {
      const user = this.$store.state.userId;
      return this.momenterFollower.includes(user);
    },
  },
  methods: {
    checkLargerPicture() {
      window.open(this.$refs["largerImage" + this.momentData._id].src);
    },
    turnLeft() {
      this.angle -= 90;
      this.$refs[
        "largerImage-case" + this.momentData._id
      ].style.transform = `rotate(${this.angle}deg)`;
    },
    turnRight() {
      this.angle += 90;
      this.$refs[
        "largerImage-case" + this.momentData._id
      ].style.transform = `rotate(${this.angle}deg)`;
    },
    concealLarger() {
      this.$refs["larger-container" + this.momentData._id].style.display =
        "none";
      const images = document.getElementsByClassName("image");
      images.forEach((i) => {
        i.style.width = "80px";
        i.style.height = "80px";
        i.style.opacity = "1";
        i.style.border = "none";
      });
    },
    potentialShow(e) {
      console.log(e);
      e.target.opacity = 1;
      e.target.border = "2px solid #1d7dfa";
    },
    showLargerPicture(e) {
      const images = document.getElementsByClassName("image");
      images.forEach((i) => {
        i.style.width = "60px";
        i.style.height = "60px";
        i.style.opacity = ".5";
        i.style.border = "none";
      });
      e.target.style.border = "2px solid #1d7dfa";
      e.target.style.opacity = 1;
      this.largerImage = e.target.src;

      this.$refs["larger-container" + this.momentData._id].style.display =
        "block";
    },
    confirmDelete() {
      this.$confirm({
        title: "删除瞬间",
        content: "删除瞬间后不可恢复,是否删除?",
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk: () => {
          this.handledeleteMoment();
          this.openNotification();
        },
        onCancel() {},
      });
    },
    async handledeleteMoment() {
      const m_id = this.momentData._id;
      const res = await deleteMoment(m_id);
      this.$emit("dispatchAllMoments", res);
    },
    openNotification() {
      this.$notification.success({
        message: "删除瞬间成功",
        style: {
          width: "220px",
          height: "60px",
          marginTop: "50px",
          marginLeft: "150px",
        },
        placement: "topRight",
        duration: 2.5,
      });
    },

    async handlelikedMoment() {
      const u_id = this.$store.state.userId;
      const token = this.$store.state.authorization;
      const m_id = this.momentData._id;
      const res = await likedMoment(u_id, token, m_id);
      this.momentLiked = res.momentLikes.likes;
    },

    addEmoji(emoji) {
      const id = "reply_input" + this.momentData._id;
      this.$refs[id].value += emoji.native;
    },
    showEmoji() {
      this.$refs["emoji_container" + this.momentData._id].style.display =
        "block";
    },

    async reviewMoment(e) {
      this.$refs["emoji_container" + this.momentData._id].style.display =
        "none";
      const reply_input = "reply_input" + this.momentData._id;
      const u_id = this.$store.state.userId;
      const m_id = this.momentData._id;
      const reviewMomentContent = this.$refs[reply_input].value;

      const res = await reviewMoment(m_id, u_id, reviewMomentContent);
      res.commenterInfo = res.commenterInfo[0];
      this.momentCommentList.push(res);
      this.$refs[reply_input].value = "";
      // this.$refs[id].value = "";
      // for(let i of res){
      //   i.reply_id = this.commentData._id;
      // }
    },

    showActionBox() {
      document.getElementById(this.momentData._id).style.display = "block";
      this.$refs["emoji_container" + this.momentData._id].style.display =
        "none";
    },
    hideActionBox() {
      document.getElementById(this.momentData._id).style.display = "none";
      console.log("2");
    },
    async showComment(e) {
      let flag = this.$refs[this.momentData._id].style.display;
      let commentList = document.getElementById(
        "commentShowcase" + this.momentData._id
      );
      let action_box = document.getElementById(
        "action_box" + this.momentData._id
      );
      if (!flag || flag == "none") {
        this.$refs[this.momentData._id].style.display = "flex";
        action_box.style.borderBottom = "1px solid #ddd";
        commentList.style.display = "block";
      } else {
        this.$refs[this.momentData._id].style.display = "none";
        commentList.style.display = "none";
      }
    },
    hideEmoji(e) {},

    showUserProfileCard() {
      console.log(this.momentData);
    },

    async followed(e) {
      const follower = this.momentData.momenter;
      const myId = this.$store.state.userId;
      const res = await followedUser(follower, myId);
      this.momenterFollower = res;
    },
  },
  created() {
    this.momenterFollower = this.momentData.momenterInfo[0].userInfo.follower;
    for (let i = 0; i < this.momentData.momentComments.length; ++i) {
      let j = 0;
      while (j < this.momentData.commenterInfo.length) {
        if (
          this.momentData.momentComments[i].commenter ==
          this.momentData.commenterInfo[j]._id
        ) {
          this.momentData.momentComments[i].commenterInfo =
            this.momentData.commenterInfo[j];
        }
        ++j;
      }
    }

    this.momentCommentList = this.momentData.momentComments;
    let NowYear = new Date().getFullYear();
    let NowMonth = new Date().getMonth() + 1;
    let NowDay = new Date().getDate();
    let NowHours = new Date().getHours();
    let NowMinutes = new Date().getMinutes();

    let publishYear = new Date(this.momentData.createTime).getFullYear();
    let publishMonth = new Date(this.momentData.createTime).getMonth() + 1;
    let publishDay = new Date(this.momentData.createTime).getDate();
    let publishHour = new Date(this.momentData.createTime).getHours();
    let publishMinute = new Date(this.momentData.createTime).getMinutes();
     if (NowYear != publishYear) {
      this.momentPublishDate = NowYear - publishYear + "年前";
    } else if (NowHours == publishHour && NowMinutes == publishMinute) {
      this.momentPublishDate = "刚刚";
    } else if (
      NowMonth == publishMonth &&
      NowDay == publishDay &&
      NowHours == publishHour &&
      publishMinute < 60
    ) {
      this.momentPublishDate = NowMinutes - publishMinute + "分前";
    } else if (
      NowMonth == publishMonth &&
      NowDay - publishDay > 1 &&
      NowHours - publishHour == 1 &&
      60 - publishHour + NowMinutes < 60
    ) {
      this.momentPublishDate = 60 - publishMinute + NowMinutes + "分前";
    } else if (
      NowMonth == publishMonth &&
      NowDay == publishDay &&
      NowHours != publishHour
    ) {
      this.momentPublishDate = NowHours - publishHour + "小时前";
    } else if (
      NowMonth == publishMonth &&
      NowDay != publishDay &&
      NowDay - publishDay == 1 &&
      24 - publishHour + NowHours < 24
    ) {
      this.momentPublishDate = 24 - publishHour + NowHours + "小时前";
    } else if (NowMonth != publishMonth && (31 - publishDay) + NowDay <= 31) {
      this.momentPublishDate = 30 - publishDay + NowDay + "天前";
    } else if (NowMonth == publishMonth && NowDay - publishDay >= 1) {
      this.momentPublishDate = NowDay - publishDay + "天前";
    } else if (NowMonth - publishMonth == 1 && 31 - publishDay + NowDay >= 31) {
      this.momentPublishDate = NowMonth - publishMonth + "月前";
    } else if (NowMonth != publishMonth && NowMonth - publishMonth >= 1) {
      this.momentPublishDate = NowMonth - publishMonth + "月前";
    }
    this.momentLiked = this.momentData.momentLiked;
  },
};
</script>

<style lang="less" scoped>
.liked {
  color: #1d7dfa;
  animation: liked 0.5s ease-out;
}

.momenter-profileCard {
  width: 220px;
  // height: 100px;
  padding: 10px 10px;
  .profile-presentation {
    display: flex;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }

  .follow-action {
    width: 100%;
    margin: 15px 0;
    .ant-btn {
      width: 100%;
      color: #fff;
      background: #1d7dfa;
      padding: 5px 0;
      border: none;
      font-size: 13px;
      border-radius: 0 0;
    }
  }
  .followData {
    display: flex;
    width: 100%;
    margin: 5px 0;
    justify-content: space-around;
    align-items: center;
  }
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
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  // padding: 30px;
  // border: 1px solid #000;
  height: 50px;
  align-items: center;
  // margin: 5px auto;
  font-family: "行体";
  margin-top: 15px;
  padding-left: 20px;
  a {
    color: #777;
    font-size: 13px;
  }
}

.moment {
  width: 658px;
  background: #fff;
  padding: 20px 20px;
  position: relative;
  margin: 10px auto;
  box-sizing: border-box;

  .avatar_box {
    height: 100%;
    width: 60px;
    img {
      width: 45px;
      height: 45px;
      border-radius: 50%;
    }
  }

  .main_content {
    width: 90%;
    position: relative;
    background: "#ffffff";
    div {
      margin-bottom: 10px;
    }
  }
  .showLargerImage {
    width: 100%;
    display: none;
    ul {
      display: flex;
      height: 26px;
      background: #eee;
      align-items: center;
      margin: 0 0;

      li {
        list-style: none;
        margin: 0 15px;

        a {
          color: #777;
          font-size: 12px;
        }
      }
      li:hover > a {
        color: #1d7dfa;
      }
    }
  }
  .image-list {
    display: flex;
    height: 100px;
    align-items: center;
    li:first-child {
      margin: 0 0;
    }
    li {
      list-style: none;
      margin: 0 10px;
      cursor: pointer;
      padding: 4px 4px;

      img {
        width: 80px;
        height: 80px;
        border: 2px solid transparent;
      }
    }
  }
  .action_box {
    height: 40px;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    border-top: 1px solid #ddd;
    position: relative;
    bottom: -20px;
    margin: 0 auto;
    // margin: 0 0 0 40px;
    // margin-bottom: 20px;
    // border: 1px solid;
    li {
      // border: 1px solid red;
      width: 30%;
      text-align: center;
      list-style: none;
      a {
        color: #777;
        font-size: 14px;
      }
      a:hover {
        color: #1d7dfa;
      }
    }
  }

  .reviewMoment {
    display: flex;
    width: 100%;
    justify-content: space-between;
    display: none;
    margin: 30px 0 0 0;
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-top: 10px;
      margin-left: 20px;
    }
    .reply_container {
      margin: 0 auto;
      width: 90%;
      padding: 10px 5px;
      margin: 0 0;
      transition: all 0.4s;
      #reply_input {
        width: 100%;
        border: 1px solid #eee;
        height: 32px;
        outline: none;
        transition: all 0.3s;
        font-size: 12px;
        background: #eee;
      }
      #reply_input:focus {
        border: 1px solid #1d7dfa;
        background: #fff;
      }

      .ant-btn {
        border-radius: 0;
        background: #51bae4;
        color: #fff;
        font-size: 13px;
      }
    }
  }
  .commentShowcase {
    display: none;
    li:nth-child(1) {
      width: 658px;
      // border: 1px solid;
      border-top: 1px solid #ddd;
      margin-left: -20px;
      padding-left: 20px;
    }
  }
}
</style>
