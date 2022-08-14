<template>
  <div class="search-container">
    <nav class="nav">
      <ul>
        <li><a @click="category" ref="article">文章</a></li>
        <li><a @click="category" ref="user">用户</a></li>
        <li><a @click="category" ref="question">问答</a></li>
      </ul>
    </nav>

    <main>
      <div
        v-if="
          searchArticles.length > 0 &&
          searchUsers.length > 0 &&
          searchQuestions.length > 0
        "
      >
        <ul class="tab">
          <li><a style="color: #1d7dfa">最新优先</a></li>
          <a-divider type="vertical"></a-divider>
          <li><a>最热优先</a></li>
        </ul>
      </div>
      <div class="showResult">
        <search-article
          v-show="type == 1"
          v-for="item in searchArticles"
          :key="item._id"
          :articleLists="item"
          :search="searchInfo.search"
        ></search-article>
        <search-user
          v-show="type == 2"
          v-for="item in searchUsers"
          :key="item._id"
          :followInfo="item"
          :search="searchInfo.search"
        ></search-user>
        <search-question
          v-show="type == 3"
          v-for="item in searchQuestions"
          :key="item._id"
          :questionData="item"
        ></search-question>
      </div>
      <div
        v-if="
          (searchArticles.length == 0 && type == 1) ||
          (searchUsers.length == 0 && type == 2) ||
          (searchQuestions.length == 0 && type == 3)
        "
        class="empty"
      >
        <img
          src="http://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/ed038d31a0ab338af3a27716116e762f.svg"
          alt=""
        />
        <p>这里什么都没有</p>
      </div>
    </main>
  </div>
</template>

<script>
import searchArticle from "../../components/content/searchArticle";
import searchQuestion from "../../components/content/searchQuestion";
import searchUser from "../../components/content/searchUser.vue";
import { search } from "../../api/search";
export default {
  name: "search",
  data() {
    return {
      searchInfo: {
        search: "",
      },

      searchArticles: [],
      searchUsers: [],
      searchQuestions: [],
      type: 1,
    };
  },
  methods: {
    category(e) {
      if (e.target.innerText == "文章") {
        this.type = 1;
        e.target.style.color = "#1d7dfa";
        this.$refs.user.style.color = "#777";
        this.$refs.question.style.color = "#777";
      } else if (e.target.innerText == "用户") {
        this.type = 2;
        e.target.style.color = "#1d7dfa";
        this.$refs.article.style.color = "#777";
        this.$refs.question.style.color = "#777";
      } else {
        this.type = 3;
        e.target.style.color = "#1d7dfa";
        this.$refs.user.style.color = "#777";
        this.$refs.article.style.color = "#777";
      }
    },
    async handleSearch() {
      this.searchInfo.search = this.$route.query;

      const res = await search(this.searchInfo, this.searchArticles.length);
      console.log(res);
      this.searchArticles = res.articles;
      this.searchUsers = res.users;
      this.searchQuestions = res.questions;
    },
  },
  components: {
    searchArticle,
    searchQuestion,
    searchUser,
  },
  watch: {
    $route: "handleSearch",
  },

  created() {
    this.handleSearch();
  },
  mounted() {
    this.$refs.article.style.color = "#1d7dfa";
  },
};
</script>

<style lang='less' scoped>
.search-container {
  background: #f4f5f5;
  height: auto;
  a:hover {
    color: #1d7dfa;
  }

  nav {
    width: 100%;
    background: #fff;
    height: 40px;
    border: 1px solid #eee;

    ul {
      display: flex;
      align-items: center;
      height: 100%;
      width: max-content;
      margin-left: 300px;
      li {
        list-style: none;
        margin: 0 20px;
        a {
          color: #777;
          font-size: 12px;
        }
      }
    }
  }

  main {
    width: 760px;
    background: #fff;
    margin-left: 300px;
    margin-top: 15px;
    box-shadow: 0 0 1px #eee;

    ul.tab {
      display: flex;
      height: 40px;
      border: 1px solid #eee;
      align-items: center;
      padding: 5px 10px;
      margin-bottom: 0;

      li {
        list-style: none;
        margin: 0 10px;
        a {
          color: #777;
          font-size: 13px;
        }
      }
    }
  }

  .empty {
    width: 600px;
    height: 600px;
    text-align: center;
    margin: 0 auto;
    p {
      color: #ccc;
    }
    img {
      width: 70%;
      height: 70%;
    }
  }
}
</style>