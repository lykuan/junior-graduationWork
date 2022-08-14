<template >
  <div
    class="articleContent-container"
    v-loading.fullscreen="loading"
    element-loading-text="加载中"
  >
    <div class="content-area">
      <aside class="articleFun">
        <section style="position: relative">
          <a @click="handleLikedArticle"
            ><a-icon
              type="like"
              theme="filled"
              :class="{ icon_liked: iconLiked }"
          /></a>
          <div class="showData" :class="{ liked: isLiked }">
            <span> {{ allLikesOfArticle.length }}</span>
          </div>
        </section>
        <section style="position: relative" @click="comment">
          <a><i class="el-icon-s-comment"></i></a>
          <div class="showData">
            <span>{{ commentList.length }}</span>
          </div>
        </section>
        <section>
          <a><a-icon type="star" theme="filled" /></a>
        </section>
        <section>
          <a><a-icon type="warning" theme="filled" /></a>
        </section>
        <div style="font-size: 13px; margin: 10px 0; color: #ccc">分享</div>
        <section>
          <a><a-icon type="qq" /></a>
        </section>
        <section>
          <a><a-icon type="wechat" /></a>
        </section>
      </aside>
      <main>
        <div class="article-content-container">
          <ul>
            <li>
              <img
                v-if="
                  $store.state.authorization != ' ' && authorAvatar !== 'null'
                "
                :src="watchingArticle.articleUser[0].userInfo.avatarURL"
                alt=""
              />
              <img
                v-if="
                  $store.state.authorization != ' ' && authorAvatar == 'null'
                "
                src="../../assets/img/defaultAvatar.jpg"
                alt=""
              />
              <div>
                <p class="author" style="margin: 0 0">
                  {{ watchingArticle.articleUser[0].userInfo.nickname }}
                </p>
                <p style="font-size: 13px; margin: 0 0; color: #000">
                  <span
                    v-if="!watchingArticle.updated"
                    style="margin: 0; color: #777"
                    >{{ articleCreate }}</span
                  >
                  <span
                    v-if="watchingArticle.updated"
                    style="margin: 0; color: #777"
                    >{{ articleUpateAt }}</span
                  >
                  <span style="margin: 0 5px; color: #777"
                    >阅读 {{ watchingArticle.article_watched }}</span
                  >
                  <span
                    ><a
                      v-if="
                        watchingArticle.author_id == $store.state.userId &&
                        watchingArticle.updated == false
                      "
                      @click="updateArticle"
                      >编辑</a
                    ></span
                  >
                  <span
                    ><a
                      style="color: #ccc; font-size: 12px"
                      v-if="
                        watchingArticle.author_id == $store.state.userId &&
                        watchingArticle.updated == true
                      "
                      @click="updateArticle"
                      >已编辑</a
                    ></span
                  >
                </p>
              </div>
            </li>
            <li>
              <el-button
                v-show="
                  watchingArticle.author_id != $store.state.userId &&
                  !isFollowed
                "
                type="primary"
                size="mini"
                :loading="author"
                @click="handleFollowedAuthor"
                >关注</el-button
              >
              <div
                class="followed"
                v-show="isFollowed"
                @click="handleFollowedAuthor"
              >
                已关注
              </div>
            </li>
          </ul>
          <h1 style="width: 90%; margin: 30px auto">
            {{ watchingArticle.article_title }}
          </h1>

          <div
            class="article_cover"
            style="width: 90%; text-align: center; margin: 30px auto"
          >
            <img
              v-if="watchingArticle.article_coverUrl"
              style="width: 100%; height: 300px; margin: 0 auto"
              :src="watchingArticle.article_coverUrl"
              alt=""
            />
          </div>
          <div
            class="article-content"
            v-html="watchingArticle.article_contentHtml"
          >
            {{ watchingArticle.article_contentHtml }}
          </div>

          <div class="article-tag-box">
            <span> 文章分类 </span
            ><button>{{ watchingArticle.article_category }}</button
            ><span>文章标签</span
            ><button v-for="item in watchingArticle.article_labels" :key="item">
              {{ item }}
            </button>
          </div>
          <div class="author_info">
            <div>
              <a href=""
                ><img
                  v-if="
                    $store.state.authorization != ' ' && authorAvatar !== 'null'
                  "
                  :src="watchingArticle.articleUser[0].userInfo.avatarURL"
                  alt=""
              /></a>
              <img
                v-if="
                  $store.state.authorization != ' ' && authorAvatar == 'null'
                "
                src="../../assets/img/defaultAvatar.jpg"
                alt=""
              />
            </div>
            <div class="userInfo_main_box">
              <div class="profile_box">
                <strong style="font-size: 16px">{{
                  watchingArticle.articleUser[0].userInfo.nickname
                }}</strong
                ><span style="margin: 0 5px; color: #777; font-size: 12px">{{
                  watchingArticle.articleUser[0].userInfo.position
                }}</span
                ><span style="color: #777; font-size: 12px">{{
                  watchingArticle.articleUser[0].userInfo.personal_presentation
                }}</span>
              </div>
              <div class="achievement_box">
                <span style="margin: 0 5px; color: #777; font-size: 12px"
                  >共发布了{{ authorArticleInfo.articleNum }}篇文章,</span
                ><span style="margin: 0 5px; color: #777; font-size: 12px"
                  >总共收到了{{ authorArticleInfo.allLikes }}个赞,</span
                ><span style="color: #777; font-size: 12px"
                  >被浏览{{ authorArticleInfo.allWatched }}</span
                >
              </div>
            </div>
            <div style="margin-right: 10px">
              <el-button
                v-if="
                  watchingArticle.author_id != $store.state.userId &&
                  !isFollowed
                "
                type="primary"
                size="mini"
                :loading="author"
                @click="handleFollowedAuthor"
                >关注</el-button
              >
              <div
                class="followed"
                v-show="isFollowed"
                @click="handleFollowedAuthor"
              >
                已关注
              </div>
            </div>
          </div>
        </div>
        <div class="comment" id="comment">
          <div class="avatar_box">
            <img
              v-if="$store.state.authorization == ''"
              src="https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/e30559a8dc5b1a0ea4b8b2a485d34018.svg"
            />
            <img
              v-if="
                $store.state.authorization != '' &&
                $store.state.userAvatar != 'null'
              "
              :src="$store.state.userAvatar"
            /><img
              v-if="
                $store.state.authorization != ' ' &&
                $store.state.userAvatar == 'null'
              "
              src="../../assets/img/defaultAvatar.jpg"
              alt=""
            />
          </div>
          <div>
            <textarea
              @focus="warn"
              style="resize: none"
              ref="comment_input"
              name=""
              id="comment_input"
              cols="80"
              rows="3"
              placeholder="  输入评论 (Enter 换行)"
              v-model="commentContent"
            ></textarea>
            <div class="action_box">
              <div>
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
              </div>

              <a-button @click="postComment" style="margin: 5px 0"
                >发表评论</a-button
              >
            </div>
          </div>
        </div>

        <div class="title" v-show="commentList.length > 0">
          <div style="font-weight: 600">全部评论 （{{ allComments }}）</div>
          <div>
            <a @click="showNew(commentList, $event)"
              ><span ref="new">最新</span></a
            ><a-divider type="vertical" /><a
              @click="showHot(commentList, $event)"
              ><span ref="hot">最热</span></a
            >
          </div>
        </div>
        <div class="comment-list" style="background: #fff">
          <comment
            v-for="item in commentList"
            :key="item._id"
            :commentData="item"
          ></comment>
        </div>
      </main>
      <aside>
        <div class="slide-block">
          <div class="about-author">关于作者</div>
          <div class="userInfo_box">
            <a href=""
              ><div>
                <img
                  v-if="
                    $store.state.authorization != ' ' && authorAvatar !== 'null'
                  "
                  :src="watchingArticle.articleUser[0].userInfo.avatarURL"
                  alt=""
                />
                <img
                  v-if="
                    $store.state.authorization != ' ' && authorAvatar == 'null'
                  "
                  src="../../assets/img/defaultAvatar.jpg"
                  alt=""
                />
              </div>
              <div class="author_panel">
                <span style="font-weight: 600">
                  {{ watchingArticle.articleUser[0].userInfo.nickname }}</span
                >

                <div class="author_position">
                  {{ watchingArticle.articleUser[0].userInfo.position }}
                </div>
              </div>
            </a>
          </div>
          <div style="display: flex; margin: 12px 0">
            <span
              style="
                border-radius: 50%;
                background: rgba(29, 125, 250, 0.3);
                display: block;
                width: 20px;
                height: 20px;
                text-align: center;
                line-height: 20px;
                margin: 0 12px;
              "
              ><a-icon
                type="like"
                theme="filled"
                style="color: #1d7dfa" /></span
            >获得点赞 {{ authorArticleInfo.allLikes }}
          </div>
          <div style="display: flex">
            <span
              style="
                border-radius: 50%;
                background: rgba(29, 125, 250, 0.3);
                display: block;
                width: 20px;
                height: 20px;
                text-align: center;
                line-height: 20px;
                margin: 0 12px;
              "
              ><a-icon type="eye" theme="filled" style="color: #1d7dfa" /></span
            >文章被阅读 {{ authorArticleInfo.allWatched }}
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script  src="highlight.js"></script>
<script>
import comment from "../../components/common/comment.vue";
// import hljs from "highlight.js";

import "highlight.js/styles/monokai-sublime.css";
import {
  articleComment,
  getArticleComment,
  getAuthorInfo,
  likedArticle,
} from "../../api/article";

import { followedUser } from "../../api/users";
// Import data/twitter.json to reduce size, all.json contains data for
// all emoji sets.
import data from "emoji-mart-vue-fast/data/all.json";
// Import default CSS
import "emoji-mart-vue-fast/css/emoji-mart.css";

import { Picker, EmojiIndex } from "emoji-mart-vue-fast";

let emojiIndex = new EmojiIndex(data);
export default {
  name: "ArticleContent",
  components: {
    comment,
    Picker,
  },
  data() {
    return {
      commentList: [],
      emojiIndex: emojiIndex,
      emojisOutput: "",
      articleCreate: "",
      commentContent: "",
      authorAvatar: "",
      loading: true,
      authorArticleInfo: {},
      articleUpateAt: "",
      author: false,
      authorFollower: [],
      allLikesOfArticle: [],
    };
  },
  computed: {
    isFollowed() {
      return this.authorFollower.includes(this.$store.state.userId);
    },
    isLiked() {
      const articleLike = this.allLikesOfArticle;
      const user = this.$store.state.userId;
      return articleLike.includes(user);
    },
    iconLiked() {
      const articleLike = this.allLikesOfArticle;
      const user = this.$store.state.userId;
      return articleLike.includes(user);
    },
    allComments() {
      let comments = this.commentList.length;
      let allReplys = 0;
      for (let i of this.commentList) {
        allReplys += i.data[0].commentInfo.reply.length;
      }
      return comments + allReplys;
    },
  },
  methods: {
    handleLikedArticle() {
      const article_id = this.watchingArticle._id;
      const user = this.$store.state.userId;
      likedArticle(article_id, user).then((res) => {
        this.allLikesOfArticle = res.articleLikeNum;
        sessionStorage.setItem(
          "article_like",
          JSON.stringify(res.articleLikeNum)
        );
      });
    },
    handleFollowedAuthor() {
      const author_id = this.watchingArticle.author_id;
      const u_id = this.$store.state.userId;
      this.author = true;
      followedUser(author_id, u_id).then((res) => {
        console.log(res);
        setTimeout(() => {
          this.authorFollower = res;
          this.author = false;
        }, 300);
      });
    },
    updateArticle() {
      const {
        article_contentHtml,
        _id,
        article_labels,
        article_category,
        article_title,
        article_coverUrl,
        author_id,
      } = this.watchingArticle;
      let editData = {
        article_contentHtml,
        _id,
        article_labels,
        article_category,
        article_title,
        article_coverUrl,
        author_id,
        article_contentText: undefined,
        updated: false,
      };

      const url = this.$router.resolve({
        path: "/users/post",
        query: editData,
      });
      window.open(url.href, "文章编辑");
    },
    handleGetAuthorInfo() {
      getAuthorInfo(this.watchingArticle.author_id).then((res) => {
        console.log(res);
        if (res.length == 1) {
          this.authorArticleInfo.articleNum == res.length;
          this.authorArticleInfo.allLikes = res[0].article_like.length;
          this.authorArticleInfo.allWatched = res[0].article_watched;
        }
        const achievement = res.reduce((acc, cur, index, arr) => {
          let articleNum = arr.length;
          let allLikes = acc.article_like.length + cur.article_like.length;
          let allWatched = acc.article_watched + cur.article_watched;
          return { articleNum, allLikes, allWatched };
        });
        this.authorArticleInfo = achievement;
      });
    },
    comment() {
      location.href = "#comment_input";
    },
    warn() {
      if (this.$store.state.authorization == "") {
        this.$message.error("请先登录");
        this.$router.push("/users/login");
        return;
      }
    },
    showHot(arr, e) {
      if (typeof e == "object") {
        e.target.style.color = "#1d7dfa";
        this.$refs.new.style.color = "#777";
        this.flag = 1;
      }
      arr.sort((a, b) => {
        console.log(b);
        if (
          b.data[0].commentInfo.reply.length ==
          a.data[0].commentInfo.reply.length
        ) {
          return (
            b.data[0].commentInfo.commentLiked.length -
            a.data[0].commentInfo.commentLiked.length
          );
        } else {
          return (
            b.data[0].commentInfo.reply.length -
            a.data[0].commentInfo.reply.length
          );
        }
      });
    },
    showNew(arr, e) {
      arr.sort((a, b) => {
        return (
          new Date(b.data[0].createTime).valueOf() -
          new Date(a.data[0].createTime).valueOf()
        );
      });
      if (typeof e == "object") {
        e.target.style.color = "#1d7dfa";
        this.$refs.hot.style.color = "#777";
        this.flag = 2;
      }
    },
    hideEmoji(e) {
      e.target.style.display = "none";
    },
    addEmoji(emoji) {
      this.$refs.comment_input.value += emoji.native;
    },
    showEmoji() {
      this.$refs.emoji_container.style.display = "block";
    },
    async loadMore(e) {
      setTimeout(async () => {
        const a_id = this.watchingArticle._id;
        console.log(this.commentList.length);

        const res = await getArticleComment(a_id, this.commentList.length);
        if (res.commentData.length == 0) {
          e.target.innerText = "已经到底了,别再刷啦/(ㄒoㄒ)/~~";
          e.target.style.backgroundColor = "#f4f5f5";
          e.target.style.color = "#555";
        }
        this.commentList = [...this.commentList, ...res.commentData];
        if (this.flag == 1) {
          this.showHot(this.commentList);
        } else if (this.flag == 2) {
          this.showNew(this.commentList);
        }
      }, 1000);
    },

    async postComment() {
      const article_id = this.watchingArticle._id;
      const u_id = this.$store.state.userId;
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const commentContent = this.$refs.comment_input.value;
      if (commentContent == "") {
        this.$message.warn("评论不能为空");
        return;
      }

      const res = await articleComment(
        article_id,
        u_id,
        userInfo,
        commentContent
      );
      console.log(res);
      this.$refs.comment_input.value = "";
      this.commentContent = " ";
      let obj = {
        data: [],
      };
      obj.data.push(res.commentData);
      obj._id = obj.data[0]._id;
      this.commentList.push(obj);
    },
  },
  async created() {
    (function () {})();
    {
      this.watchingArticle = JSON.parse(sessionStorage.getItem("viewArticle"));
      console.log(this.watchingArticle);
      this.allLikesOfArticle =
        JSON.parse(sessionStorage.getItem("article_like")) ||
        JSON.parse(sessionStorage.getItem("viewArticle")).article_like;
      console.log(this.allLikesOfArticle);
      const a_id = this.watchingArticle._id;
      this.loading = true;
      const res = await getArticleComment(a_id, this.commentList.length);
      if (res) {
      }
      res.commentData.forEach((i) => {
        i.data[0]._id = i._id;
        i.data[0].commentInfo.replyerInfo = i.data[0].replyerInfo;
      });
      this.commentList = res.commentData;
      for (let i of this.commentList) {
        if (i.data[0].commentInfo.reply.length > 0) {
          i.data[0].commentInfo.reply.forEach((k) => {
            let j = 0;
            while (j < i.data[0].commentInfo.replyerInfo.length) {
              if (k.user == i.data[0].commentInfo.replyerInfo[j]._id) {
                k.userInfo = i.data[0].commentInfo.replyerInfo[j].userInfo;
              }
              ++j;
            }
          });
        }
      }
      this.loading = false;

      sessionStorage.removeItem("commentList");
      if (this.commentList.length == 0) {
        sessionStorage.removeItem("commentList");
      } else if (sessionStorage.getItem("commentList") == null) {
        sessionStorage.setItem(
          "commentList",
          JSON.stringify(this.commentList.commentData)
        );
      }
      this.userAvatar = localStorage.getItem("userAvatar");

      this.showNew(this.commentList);
      sessionStorage.setItem("commentList", JSON.stringify(res.commentData));
      const hour = new Date(this.watchingArticle.createTime).getHours();

      this.articleCreate = new Date(this.watchingArticle.createTime)
        .toLocaleString()
        .replace(/\p{sc=Han}/gu, " ");
      const chinese = new Date(this.watchingArticle.createTime)
        .toLocaleString()
        .match(/\p{sc=Han}/gu)
        .join("");
      this.articleUpateAt = new Date(this.watchingArticle.updateTime)
        .toLocaleString()
        .replace(/\p{sc=Han}/gu, " ");
      console.log(this.articleUpateAt);
      const updatedchinese = new Date(this.watchingArticle.updateTime)
        .toLocaleString()
        .match(/\p{sc=Han}/gu)
        .join("");
      const updateHour = new Date(this.watchingArticle.updateTime).getHours();
      if (chinese == "下午" || chinese == "上午") {
        this.articleCreate = this.articleCreate.replace(/\d+(?=:)/, hour);
      }
      if (updatedchinese == "下午" || updatedchinese == "上午") {
        this.articleUpateAt = this.articleUpateAt.replace(
          /\d+(?=:)/,
          updateHour
        );
      }
      if (this.watchingArticle.article_category == "client") {
        this.watchingArticle.article_category = "前端";
      }

      if (this.watchingArticle.article_category == "server") {
        this.watchingArticle.article_category = "后端";
      }
      if (this.watchingArticle.article_category == "http") {
        this.watchingArticle.article_category = "网络";
      }
      if (this.watchingArticle.article_category == "reading") {
        this.watchingArticle.article_category = "阅读";
        console.log(this.watchingArticle.article_category);
      }
    }

    this.authorAvatar = JSON.parse(
      sessionStorage.getItem("viewArticle")
    ).articleUser[0].userInfo.avatarURL;

    this.handleGetAuthorInfo();
  },

  mounted() {
    setTimeout(() => {
      this.$refs["new"].style.color = "#1d7dfa";
    }, 100);
    const title = document.getElementsByTagName("title")[0];
    title.innerText = this.watchingArticle.article_title;
  },
};
</script>


<style lang="less" scoped>
/deep/ pre code {
  display: block;
  overflow-x: auto;
  padding: 1em;
  background: #fff5f5;
  color: #ff502c;
  code {
    padding: 3px 5px;
  }
  .hljs {
    background: #23241f;
    color: #f8f8f2;
  }
  .hljs-subst,
  .hljs-tag {
    color: #f8f8f2;
  }
  .hljs-emphasis,
  .hljs-strong {
    color: #a8a8a2;
  }
  .hljs-bullet,
  .hljs-link,
  .hljs-literal,
  .hljs-number,
  .hljs-quote,
  .hljs-regexp {
    color: #ae81ff;
  }
  .hljs-code,
  .hljs-section,
  .hljs-selector-class,
  .hljs-title {
    color: #a6e22e;
  }
  .hljs-strong {
    font-weight: 700;
  }
  .hljs-emphasis {
    font-style: italic;
  }
  .hljs-attr,
  .hljs-keyword,
  .hljs-name,
  .hljs-selector-tag {
    color: #f92672;
  }
  .hljs-attribute,
  .hljs-symbol {
    color: #66d9ef;
  }
  .hljs-class .hljs-title,
  .hljs-params,
  .hljs-title.class_ {
    color: #f8f8f2;
  }
  .hljs-addition,
  .hljs-built_in,
  .hljs-selector-attr,
  .hljs-selector-id,
  .hljs-selector-pseudo,
  .hljs-string,
  .hljs-template-variable,
  .hljs-type,
  .hljs-variable {
    color: #e6db74;
  }
  .hljs-comment,
  .hljs-deletion,
  .hljs-meta {
    color: #75715e;
  }
}
.followed {
  background: #eef;
  color: #1d7dfa;
  padding: 5px 8px;
  text-align: center;
  font-size: 12px;
  border-radius: 3px;
  cursor: pointer;
}

.showData {
  background: #b2bac2;
  width: min-content;
  font-size: 5px !important;
  height: 10px;
  color: #fff;
  text-align: center;
  line-height: 10px;
  border-radius: 5px;
  width: 10px;
  position: absolute;
  top: 12px;
  right: -2px;
  transform: scale(1.2);
}

.author_position {
  margin: 5px 0;
  width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.articleContent-container {
  width: 100vw;
  background: #f6f8fa;
  border: 1px solid transparent;
  .icon_liked {
    color: #1d7dfa !important;
    transition: all 0.3s;
    animation: liked 0.8s;
  }
}
.content-area {
  margin: 20px auto;
  // width: 1020px;
  display: flex;
  justify-content: center;
}
.liked {
  // color: #1d7dfa;
  background: #1d7dfa;
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
.article-content {
  width: 90%;
  margin: 0 auto;
  overflow: hidden;
}
.slide-block {
  width: 200px;
  background: #fff;
  // border: 1px solid #eee;
  margin: 0 10px;
  padding: 12px 0;
  box-shadow: 1px 1px 1px #ddd;
  .about-author {
    text-indent: 10px;
    height: 35px;
    justify-content: flex;
    border-bottom: 1px solid #eee;
  }

  .userInfo_box {
    padding: 0 10px;
    a {
      display: block;
      width: 100%;
      height: 80px;
      display: flex;
      align-items: center;
      color: #777;
      // background: green;
    }
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 12px;
    }
  }
}
.article-tag-box {
  display: flex;
  width: 90%;
  height: 60px;
  margin: 0 auto;
  align-items: center;
  // line-height: 60px;
  button {
    background: #fafafa;
    padding: 5px 5px;
    outline: none;
    border: none;
    margin: 0 12px;
    cursor: pointer;
  }
  button:last-child {
    margin: 0;
  }
  button:hover {
    background: #f5f5f5;
  }
}
.articleFun {
  height: 270px;
  width: 50px;
  display: flex;
  width: max-content;
  flex-direction: column;
  justify-content: space-evenly;
  background: #f6f8fa;
  margin-right: 20px;
  margin-top: 80px;

  a {
    height: 45px;
    width: 45px;
    border-radius: 50%;
    display: block;
    cursor: pointer;
    outline: none;
    border: none;
    background: #fff;
    border: 1px solid #eee;
    text-align: center;
    line-height: 45px;
    color: #b2bac2;
    margin: 8px 0;

    .el-icon-s-comment {
      font-size: 20px;
      color: #b2bac2;
    }
    .anticon {
      font-size: 20px;
      color: #aaa;
    }
  }
  button:hover > * {
    color: #777;
  }
}

main {
  .article-content-container {
    margin-bottom: 10px;
    background: #fff;
    border: 1px solid transparent;
    ul {
      width: 90%;
      display: flex;
      height: 50px;
      justify-content: space-between;
      align-items: center;
      margin: 10px auto;
      li {
        list-style: none;
        .author {
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 1px;
        }
      }
      li:first-child {
        display: flex;
        * {
          margin: 0 5px;
        }
      }
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
    .author_info {
      width: 90%;
      height: 70px;
      background: #f4f5f5;
      margin: 10px auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      div {
        margin-left: 10px;
      }

      img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
      }
    }
    .userInfo_main_box {
      flex-grow: 1;
    }
  }
  width: 650px;
  background: #f6f8fa;

  .comment {
    margin: 20px auto;
    width: 100%;
    height: 180px;
    padding: 20px 0;
    background: #fff;
    display: flex;
    justify-content: space-around;
  }
  div.action_box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }
  .ant-btn {
    font-size: 13px;
    // color: red;
    // border: none;
  }

  .avatar_box {
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }

  textarea {
    outline: none;
    width: 550px;
    transition: all 0.3s;
    height: 80px;
    background: #f4f5f5;
    border: none;
    padding: 0 0;
    margin: 0 0;
    text-indent: 2px;
    border: none;
    font-size: 12px;
    color: #000;
  }
  textarea::placeholder {
    font-size: 12px;
  }
  textarea:focus {
    box-shadow: 0 0 1px #1423ee, 0 0 3px #0e36e9;
    background: #fff;
  }

  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    // border: 1px solid #000;
    height: 50px;
    align-items: center;
    background: #fff;
    a {
      color: #777;
      font-size: 13px;
    }
  }
}
</style>