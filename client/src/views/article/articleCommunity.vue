<template>
  <div
    class="article-container"
    ref="article"
    id="article"
    v-loading="loading"
    element-loading-text="Loading..."
  >
    <main>
      <section class="main">
        <div class="loading" ref="loading">
          <div class="loading-container">
            <a-icon type="loading" /><span>加载中</span>
          </div>
        </div>
        <article class="left-article-container">
          <div class="tabbar">
            <ul class="tab">
              <li><a @click="hot(allArticles, $event)" ref="hot">热门</a></li>
              <a-divider type="vertical" />
              <li>
                <a @click="latest(allArticles, $event)" ref="new">最新</a>
              </li>
            </ul>

            <Article
              v-show="loading == false"
              ref="article"
              v-for="item in allArticles"
              :key="item._id"
              :articleLists="item"
            ></Article>
          </div>
        </article>
        <aside class="right-article-container">
          <div class="article-card-container">
            <h3 class="recommend">推荐文章</h3>
            <el-carousel height="200px" direction="vertical" :autoplay="true">
              <el-carousel-item
                v-for="item in recommendArticle"
                :key="item._id"
              >
                <div class="article-card" @click="toArticle(item)">
                  <h3
                    style="
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      width: 100%;
                    "
                  >
                    {{ item.article_title }}
                  </h3>
                  <div class="content">{{ item.article_contentText }}</div>
                  <div class="cover" v-if="item.article_coverUrl">
                    <img :src="item.article_coverUrl" alt="" />
                  </div>
                  <p>
                    <span>点赞 {{ item.article_like.length }}</span
                    ><span>评论 {{ item.articleCommentNum.length }}</span>
                  </p>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>

          <div class="advertisement">
            <el-card :body-style="{ padding: '0px' }">
              <img
                src="../../assets/img/theme-index-blue.c38b733.png"
                class="image"
              />
              <div style="padding: 14px">
                <a  @click="toElementui" style="color:#000"><span style="cursor:poiter" >ElementUI</span></a>
                
              </div>
            </el-card>
          </div>
          <span style="font-size: 12px; color: #aaa;"
            >开发所使用的前端组件库</span
          >
        </aside>
      </section>
      <div
        id="tip"
        style="
          height: 40px;
          width: 640px;
          background: #f4f5f5;
          color: #777;
          margin: 0 auto;
          display: none;
          letter-spacing: 1px;
        "
      >
        不要在刷了,已经到底啦/(ㄒoㄒ)/~~
      </div>
    </main>
  </div>
</template>

<script>
import { getArticles } from "../../api/article";
import Article from "../../components/content/articles.vue";
import { userlikedArticle } from "../../api/users";
export default {
  name: "articleCommunity",
  watch: {
    userLikedArticles(userLikedArticles) {
      setTimeout(() => {
        this.$refs.article.forEach((item) => {
          // console.log(item)
          item.userLiked = userLikedArticles;
        });
      }, 100);
    },
  },
  data() {
    return {
      allArticles: [],
      userLikedArticles: [],
      flag: 1,
      recommendArticle: [],
      loading: false,
    };
  },
  methods: {
    toElementui(){
      window.open("https://element.eleme.cn/#/zh-CN")
    },
    toArticle(item) {
      sessionStorage.setItem("viewArticle", JSON.stringify(item));
      const url = this.$router.resolve({
        path: `/user/${item._id}/post`,
      });
      window.open(url.href, item.article_title);
    },
    async loadMore() {
      try {
        const res = await getArticles(this.allArticles.length);
        res.data.forEach((item) => {
          item.userLiked = this.userLikedArticles;
        });
        if (res.data.length == 0) {
          document.querySelector("#tip").style.display = "block";
          this.loading = false;
        }
        this.allArticles.push(...res.data);
        if (this.flag == 1 && res.data.length > 0) {
          this.hot(this.allArticles);
        } else if (this.flag == 2 && res.data.length > 0) {
          this.latest(this.allArticles);
        }
      } catch (error) {}
    },
    hot(arr, e) {
      this.loading = true;

      setTimeout(() => {
        arr.sort((a, b) => {
          if (
            a.articleCommentNum.length == b.articleCommentNum.length ||
            a.article_like.length == b.article_like.length
          ) {
            return b.article_watched - a.article_watched;
          } else if (
            a.article_like.length == b.article_like.length ||
            a.article_watched == b.article_watched
          ) {
            return b.articleCommentNum.length - a.articleCommentNum.length;
          } else {
            return b.article_like.length - a.article_like.length;
          }
        });
        this.loading = false;
      }, 1000);

      if (typeof e == "object") {
        e.target.style.color = "#1d7dfa";
        this.$refs.new.style.color = "#777";
        this.$refs.hotList.style.color = "#777";
        this.flag = 1;
      }
    },
    latest(arr, e) {
      this.loading = true;

      setTimeout(() => {
        arr.sort((a, b) => {
          return (
            new Date(b.createTime).valueOf() - new Date(a.createTime).valueOf()
          );
        });
        this.loading = false;
      }, 1000);

      if (typeof e == "object") {
        e.target.style.color = "#1d7dfa";
        this.$refs.hot.style.color = "#777";
        this.$refs.hotList.style.color = "#777";
        this.flag = 2;
      }
    },
    hotList(e) {
      e.target.style.color = "#1d7dfa";
      this.$refs.new.style.color = "#777";
      this.$refs.hot.style.color = "#777";
    },
    async handleUserLiked() {
      let uId = localStorage.getItem("userId");

      if (uId !== "") {
        const res = await userlikedArticle(uId);
        if (
          Array.isArray(res.data.userLiked) &&
          res.data.userLiked.length > 0
        ) {
          this.userLikedArticles = res.data.userLiked;
        }
      }
    },
  },

  components: {
    Article,
  },

  async created() {
    const result = await getArticles(this.allArticles.length);
    this.allArticles = result.data;
    this.allArticles.map((i) => {
      i.userLiked = [];
    });
    this.hot(this.allArticles);
    this.recommendArticle = new Set(this.recommendArticle);
    if (this.recommendArticle.size <= 5) {
      this.allArticles.map((i) => {
        const index = Math.floor(Math.random() * this.allArticles.length);
        this.recommendArticle.add(this.allArticles[index]);
      });
    }

    console.log(
      this.recommendArticle.forEach((i) => {
        console.log(i._id);
      })
    );
    console.log(this.recommendArticle);

    this.handleUserLiked();
  },
  mounted() {
    this.$refs.hot.style.color = "#1d7dfa";
    try {
      document.addEventListener("scroll", async (e) => {
        const bottom =
          e.target.scrollingElement.scrollHeight -
          e.target.scrollingElement.clientHeight;

        if (Math.round(e.target.scrollingElement.scrollTop) - bottom == -1) {
          setTimeout(() => {
            this.loadMore();
          }, 1000);
        } else if (
          Math.round(e.target.scrollingElement.scrollTop) - bottom ==
          1
        ) {
          setTimeout(() => {
            this.loadMore();
          }, 1000);
        } else if (Math.round(e.target.scrollingElement.scrollTop) == bottom) {
          setTimeout(() => {
            this.loadMore();
          }, 1000);
        }
      });
    } catch (error) {
      console.log(error);
    }

    const title = document.getElementsByTagName("title")[0];
    title.innerText = "小小博客 - 文章社区";
  },
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
/deep/.el-carousel__button {
  background-color: #aaa;
}
// /deep/  .is-active {
//   background: red;
// }
.el-carousel__item h3 {
  text-align: center;
  padding: 2px 0;
  border-bottom: 1px solid #eee;
}

.el-carousel__item {
  background-color: #fff;
}

.loadMore {
  width: 100%;
  height: 30px;
  text-align: center;
  line-height: 30px;
  padding: 5px 0;
  background: #f4f5f5;
  display: none;
  a {
    background: #1d7dfa;
    display: inline-block;
    padding: 5px 15px;
    font-size: 12px;
    letter-spacing: 1px;
    color: #eee;
    transition: all 0.4s;
  }
}
.article-container {
  width: 100vw;
  background: #f4f5f5;
  padding: 30px 0;
  .loading {
    width: 100vw;
    height: 100vh;
    background: #eee;
    opacity: 0.7;
    position: absolute;
    text-align: center;
    line-height: 70px;
    display: none;
    transition: all 0.5s;
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

  .tabbar {
    .tab {
      border: none;
      display: flex;
      height: 40px;
      align-items: center;
      background: #fff;
      border-bottom: 1px solid #eee;
      li {
        list-style: none;
        margin: 0 10px;
        a {
          color: #777;
          font-size: 12px;
        }
        a:hover {
          color: #1d7dfa;
        }
      }
    }
  }
  .main {
    box-sizing: border-box;
    margin: 0 auto;
    width: 960px;
    display: flex;
    justify-content: space-evenly;
  }
  main {
    width: 100vw;
    background: #f4f5f5;
  }

  .articleConetnt {
    width: 600px;
    text-indent: 20px;
    height: 300px;
  }
}
.left-article-container {
  width: 640px;
  background: #fff;
  margin: 0 auto;
}
aside {
  width: 300px;
  height: 700px;
  background: #f4f5f5;
  .article-card:hover {
    background: #eef;
    cursor: pointer;
    transition: all 0.3s;
  }
  .article-card-container {
    border-radius: 5px;
    box-shadow: 0 0 4px #ccc, 0 0 4px #ccc;

    .recommend {
      text-align: center;
      padding: 5px 0;
      background: #fff;
      margin-bottom: 5px;
    }
  }
  .article-card {
    .content {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      height: 40px;
      font-size: 12px;
      padding: 0 10px;
      line-height: 40px;
    }
    .cover {
      width: 100%;
      height: 100%;
      text-align: center;

      img {
        width: 80%;
        height: 100px;
      }
    }
    p {
      span {
        margin: 0 10px;
        font-size: 12px;
        color: #aaa;
      }
    }
  }

  .advertisement {
    margin: 10px 0;
    text-align: center;
    background-color: #fff;

    img {
      width: 100%;
    }
  }
}
</style>