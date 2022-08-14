<template>
  <section class="article">
    <div class="article-container">
      <div class="left">
        <div class="top">
          <div>
            <span
              ><a href="#" v-html="articleLists.articleUser[0].username"
                >用户</a
              ></span
            >
            <a-divider type="vertical" />
            <span> {{ publishAt }}</span>
            <a-divider type="vertical" />
            <span
              ><a href="#">{{ articleLists.article_labels[0] }}</a></span
            >
          </div>
        </div>
        <div class="main" @click="articleDetail">
          <a href="" class="title" v-html="emphasizedTitle"></a>
          <a href="" class="main_content" v-html="emphasizedContent"> </a>
        </div>
        <ul class="bottom">
          <li :class="{ liked: isLiked }">
            <a>
              <span
                @click="offerLike"
                style="font-size: 12px"
                v-show="articleLists.article_like.length == 0"
                ><a-icon type="like" style="font-size: 12px" /> 点赞</span
              >
            </a>
            <a>
              <span
                @click="offerLike"
                style="fonts-size: 12px"
                v-show="articleLists.article_like.length > 0"
              >
                <a-icon type="like" theme="filled" style="font-size: 12px" />
                <span style="font-size: 12px">{{
                  articleLists.article_like.length
                }}</span></span
              ></a
            >
          </li>
          <li>
            <a
              ><span style="font-size: 12px"
                ><i class="el-icon-chat-round"></i
                ><span
                  v-show="articleLists.articleCommentNum.length == 0"
                  style="margin: 0 2px"
                >
                  评论</span
                ><span
                  v-show="articleLists.articleCommentNum.length > 0"
                  style="font-size: 12px; margin: 0 2px"
                  >{{ allComments }}</span
                ></span
              ></a
            >
          </li>
        </ul>
      </div>

      <div class="right" v-if="articleLists.article_coverUrl">
        <img :src="articleLists.article_coverUrl" alt="" />
      </div>
    </div>
  </section>
</template>

<script>
import { likedArticle } from "../../api/article";
export default {
  name: "searchArticle",
  props: ["articleLists", "search"],
  data() {
    return {
      publishAt: "",
      emphasizedTitle: "",
      emphasizedContent: "",
    };
  },
  computed: {
    isLiked() {
      return this.articleLists.article_like.includes(this.$store.state.userId);
    },
    allComments() {
      let comments = this.articleLists.articleCommentNum.length;
      let allReplys = 0;
      for (let i of this.articleLists.articleCommentNum) {
        allReplys += i.commentInfo.reply.length;
      }
      return comments + allReplys;
    },
  },
  methods: {
    async offerLike() {
      const u_id = localStorage.getItem("userId");
      const a_id = this.articleLists._id;
      const res = await likedArticle(a_id, u_id);
      this.articleLists.article_like = res.articleLikeNum;
    },

    articleDetail(e) {
      sessionStorage.setItem("viewArticle", JSON.stringify(this.articleLists));
      const url = this.$router.resolve({
        path: `/user/${this.articleLists._id}/post`,
      });
      // this.$router.push(`/user/${this.articleLists._id}/post`);
      window.open(url.href, this.articleLists.article_title);
    },
    comment() {
      sessionStorage.setItem("viewArticle", JSON.stringify(this.articleLists));

      this.$router.push(`/user/${this.articleLists.author_id}/post`);

      location.href = "#comment";
    },
  },

  async created() {
    this.emphasizedTitle = this.articleLists.article_title
    this.emphasizedContent = this.articleLists.article_contentHtml
    const query = this.search.query;
    const reg = new RegExp(`${query}`, "ig");
    if (Array.isArray(this.articleLists.article_contentHtml.match(reg))) {
        this.emphasizedContent = this.articleLists.article_contentHtml.replace(
          reg,
          `<span style="color:#f03535;margin: 0 0">$&</span>`
        );
    }

    if (Array.isArray(this.articleLists.article_title.match(reg))) {
        this.emphasizedTitle = this.articleLists.article_title.replace(
          reg,
          `<a style="color:#f03535">$&</a>`
        );
    }

    this.userLiked = this.articleLists.userLiked;
    let NowYear = new Date().getFullYear();
    let NowMonth = new Date().getMonth() + 1;
    let NowDay = new Date().getDate();
    let NowHours = new Date().getHours();
    let NowMinutes = new Date().getMinutes();

    let publishYear = new Date(this.articleLists.createTime).getFullYear();
    let publishMonth = new Date(this.articleLists.createTime).getMonth() + 1;
    let publishDay = new Date(this.articleLists.createTime).getDate();
    let publishHour = new Date(this.articleLists.createTime).getHours();
    let publishMinute = new Date(this.articleLists.createTime).getMinutes();
   if (NowYear != publishYear) {
      this.publishAt = NowYear - publishYear + "年前";
    } else if (NowHours == publishHour && NowMinutes == publishMinute) {
      this.publishAt = "刚刚";
    } else if (
      NowMonth == publishMonth &&
      NowDay == publishDay &&
      NowHours == publishHour &&
      publishMinute < 60
    ) {
      this.publishAt = NowMinutes - publishMinute + "分前";
    } else if (
      NowMonth == publishMonth &&
      NowDay - publishDay > 1 &&
      NowHours - publishHour == 1 &&
      60 - publishHour + NowMinutes < 60
    ) {
      this.publishAt = 60 - publishMinute + NowMinutes + "分前";
    } else if (
      NowMonth == publishMonth &&
      NowDay == publishDay &&
      NowHours != publishHour
    ) {
      this.publishAt = NowHours - publishHour + "小时前";
    } else if (
      NowMonth == publishMonth &&
      NowDay != publishDay &&
      NowDay - publishDay == 1 &&
      24 - publishHour + NowHours < 24
    ) {
      this.publishAt = 24 - publishHour + NowHours + "小时前";
    } else if (NowMonth != publishMonth && (31 - publishDay) + NowDay <= 31) {
      this.publishAt = 30 - publishDay + NowDay + "天前";
    } else if (NowMonth == publishMonth && NowDay - publishDay >= 1) {
      this.publishAt = NowDay - publishDay + "天前";
    } else if (NowMonth - publishMonth == 1 && 31 - publishDay + NowDay >= 31) {
      this.publishAt = NowMonth - publishMonth + "月前";
    } else if (NowMonth != publishMonth && NowMonth - publishMonth >= 1) {
      this.publishAt = NowMonth - publishMonth + "月前";
    }
  },
};
</script>

<style lang='less' scoped>
* {
  margin: 0;
  padding: 0;
}

.likeBorder {
  border: 1px solid #1d7dfa;
}
.liked {
  border: 1px solid #1d7dfa !important;

  * {
    color: #1d7dfa;
    font-size: 12px;
  }
}
.loading {
  width: 100vw;
  height: 100vh;
  background: #eee;
  opacity: 0.7;
  position: absolute;
  text-align: center;
  line-height: 70px;
  display: none;
  .loading-container {
    width: 300px;
    height: 100px;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%);
    line-height: 100px;
    font-size: 20px;
    box-shadow: 0 0 3px #ccc, 0 0 6px #ccc, 0 0 10px #ccc;
    text-align: center;
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
.tabbar {
  border: none;
  width: 760px;
}
.article {
  // margin: -15px 0;
  border: none;
  width: 760px;
}

.article:hover {
  background: #fafafa;
}
.ant-tabs {
  margin: 0;
  padding: 0;
}
.article-container {
  margin: 0 auto;
  width: 760px;
  height: 135px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding: 0 10px;
  cursor: pointer;
  a {
    text-decoration: none;
    color: #777;
  }

  .top {
    height: 30px;
    line-height: 30px;
    font-size: 12px;

    .ant-divider {
      margin: 0 5px;
    }
  }

  .left {
    width: 78%;

    .main {
      .title {
        font-weight: 800;
        font-size: 18px;
        color: #000;
        letter-spacing: 2px;
        margin-top: 10px;
        display: inline-block;
        text-decoration: none;
        width: 100%;
      }
      .main_content {
        text-indent: 2px;
        margin-top: 10px;
        display: block;
        letter-spacing: 1px;
        text-decoration: none;
        height: 20px;
        width: 100%;

        // border: 1px solid red
        color: #777;
        font-size: 11px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    ul {
      margin-top: 10px;
      height: 30px;
      width: 35%;
      display: flex;
      align-items: center;
      li:hover {
        background: #f4f5f5;
      }
      li {
        list-style: none;
        height: 20px;
        line-height: 100%;
        border: 1px solid #eee;
        width: max-content;
        margin: 0 1px;
        border-radius: 2px;

        a {
          text-decoration: none;
          color: #777;
          height: 100%;
        }

        span {
          margin: 0 5px;
          height: 16px;
        }
      }
    }
  }
  .right {
    width: 20%;
    line-height: 150px;
    text-align: center;
    img {
      width: 50px;
      height: 50px;
    }
  }
}
</style>