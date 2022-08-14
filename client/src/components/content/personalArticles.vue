<template>
  <section class="article">
    <div class="article-container">
      <div class="left">
        <div class="top">
          <div>
            <span><a href="#" v-html="username"></a></span>
            <a-divider type="vertical" />
            <span> {{ publishAt }}</span>
            <a-divider type="vertical" />
            <span
              ><a href="#">{{ articleLists.article_labels[0] }}</a></span
            >
          </div>
        </div>
        <div class="main" @click="articleDetail">
          <a href="" class="title" >{{articleLists.article_title}}</a>
          <a href="" class="main_content">{{
            articleLists.article_contentText
          }}</a>
        </div>
        <ul class="bottom">
          <li style="font-size: 12px">
            <a-icon type="eye" style="font-size: 12px" />
            {{ articleLists.article_watched }}
          </li>
          <li>
            <a>
              <span
                @click="offerLike"
                style="font-size: 12px"
                v-show="articleLists.article_like.length == 0"
                ><a-icon type="like" /> 点赞</span
              >
            </a>
            <a>
              <span
                @click="offerLike"
                v-show="articleLists.article_like.length > 0"
                style="font-size: 12px"
                :class="{ liked: isLiked }"
              >
                <a-icon
                  type="like"
                  theme="filled"
                  style="font-size: 12px"
                  
                />
                <!-- <a-icon type="like" theme="filled" style="color:blue"/>  -->
                {{ articleLists.article_like.length }}</span
              ></a
            >
          </li>
          <li> 
            <a style="font-size: 12px" id="comment">
              <i class="el-icon-chat-round"></i>
              <span v-show="articleLists.articleCommentNum.length == 0"
                >评论</span
              ><span v-show="articleLists.articleCommentNum.length > 0">{{
                allComments
              }}</span></a
            >
          </li>

          <li style="position: relative">
            <el-popover placement="bottom-start" width="80" trigger="click">
              <button class="operate">编辑</button
              ><button class="operate" @click="deleteArticle">删除</button>

              <a
                class="more"
                slot="reference"
                v-if="articleLists.author_id == $store.state.userId"
              >
                <a-icon type="ellipsis" />
              </a>
            </el-popover>
          </li>
        </ul>
      </div>
      <div class="right">
        <img
          v-if="articleLists.article_coverUrl"
          :src="articleLists.article_coverUrl"
          alt=""
        />
      </div>
    </div>
  </section>
</template>

<script>
import { likedArticle, deleteArticle } from "../../api/article";
export default {
  name: "personalArticle",
  props: ["articleLists"],
  data() {
    return {
      publishAt: "",
      userLiked: [],
      username: "",
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
      this.userLiked = res.userLikes;
      this.articleLists.article_like = res.articleLikeNum;
    },
    async deleteArticle() {
      const flag = confirm("删除文章后不可恢复,是否删除？");

      if (flag) {
        const article = this.articleLists._id;
        const u_id = this.$store.state.userId;
        const token = this.$store.state.authorization;
        const res = await deleteArticle(article, token, u_id);
        this.$emit("handleMyArticles", res.myArticles);
        this.$message.success("删除成功");
      }
    },

    articleDetail() {
      sessionStorage.setItem('viewArticle',JSON.stringify(this.articleLists))
      this.$router.push(`/user/${this.$store.state.userId}/post`);
    },
  },

  async created() {
    this.username = this.articleLists.articleUser[0].userInfo.nickname;
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
      NowHours == publishHour &&
      publishMinute < 60
    ) {
      this.publishAt = NowMinutes - publishMinute + "分前";
    } else if (
      NowMonth == publishMonth &&
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
    } else if (NowMonth != publishMonth) {
      this.publishAt = 30 - publishDay + NowDay + "天前";
    } else if (NowMonth == publishMonth && NowDay - publishDay >= 1) {
      this.publishAt = NowDay - publishDay + "天前";
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
#comment{
  span{
    margin:  0 2px;
  }
}
#comment:hover{
  color:#1d7dfa ;
}

/deep/ .el-popover {
  position: absolute;
  background: #fff;
  min-width: none !important;
  border: 1 px solid #ebeef5;
  padding: 0;
  z-index: 2000;
  color: #606266;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  word-break: break-all;
}
.more {
  display: block;
  height: 15px;
  line-height: 15px;
}
.more:hover {
  background: #ddd;
}

.operate {
  background: #fff;
  width: 100%;
  outline: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  height: 40px;
}

.operate:hover {
  background: #eee;
}
.bottom {
  a span:hover {
    color: #1d7dfa;
  }
}
.liked {
  color: #1d7dfa;
}
.tabbar {
  border: none;
  border-bottom: 1px solid #ddd;
  width: 640px;
}


.article {
  // margin: 1px 0;
  border: none;
  width: 640px;
  box-sizing: border-box;
  border: none;
  // border-bottom: 1px solid #ddd;
  border-top: 1px solid #ddd;
}
.article section:nth-child(2) {
  border-top: none;
}

.article:hover {
  background: #fafafa;
}

.article-container {
  margin: 0 auto;
  width: 620px;
  height: 140px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;

}
      .main_content {
        text-indent: 2px;
        margin-top: 10px;
        display: block;
        letter-spacing: 1px;
        text-decoration: none;
        height: 20px;
        // width:300px;
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
      justify-content: space-between;
      align-items: center;
      li {
        list-style: none;
        a {
          text-decoration: none;
          color: #777;
        }

        span {
          margin: 0 5px;
        }
      }
    }
  }
  .right {
    width: 20%;
    line-height: 150px;
    text-align: center;
    img {
      width: 100%;
      height: 75px;
    }
  }
}
</style>