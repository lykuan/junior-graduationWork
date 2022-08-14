<template>
  <div class="question-container" v-loading.fullscreen="loading" element-loading-text="Loading...">
    <div class="content-area">
      <ul class="channel">
        <div class="title">专区</div>
        <li v-for="item in channel" :key="item" @click="findParticularQuestion">
          {{ item }}
        </li>
      </ul>
      <article class="main">
        <ul class="tabs">
          <li>最新</li>
          <li>最热</li>
        </ul>
        <div class="showQuestion-list">
          <question
            v-for="question in questionList"
            :key="question._id"
            :questionData="question"
            :individualData="userQuestionData"
          ></question>
          <div v-if="questionList.length == 0" class="empty">
            <img
              src="http://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/ed038d31a0ab338af3a27716116e762f.svg"
              alt=""
            />
            <p>这里什么都没有</p>
          </div>
        </div>
      </article>

      <aside>
        <div class="title">
          <span>我的问答</span>
          <a-button
            @click="askQuestion"
            style="background: #1890fe; color: #fff; border-radius: 20px"
            ><a-icon type="plus" />提问题</a-button
          >
        </div>

        <div class="statistic">
          <div class="row">
            <div class="col">
              <span>提问</span
              ><span style="background: #ddd; padding: 1px 3px">{{
                questionNum
              }}</span>
            </div>
            <div class="col">
              <span>被点赞</span
              ><span style="background: #ddd; padding: 1px 3px">{{
                questionLike
              }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <span>回答</span
              ><span style="background: #ddd; padding: 1px 3px">{{
                answerNum
              }}</span>
            </div>
            <div class="col">
              <span>被评论</span
              ><span style="background: #ddd; padding: 1px 3px">{{
                answered
              }}</span>
            </div>
          </div>
        </div>

      
      </aside>
    </div>
  </div>
</template>

<script>
import question from "../../components/content/question.vue";
import { getQuestions, findQuestion } from "../../api/question";
export default {
  name: "questionHome",
  data() {
    return {
      activeKey: "1",
      channel: [
        "前端",
        "后端",
        "java",
        "javaScript",
        "python",
        "c",
        "c#",
        "c++",
        "go",
        "vue.js",
        "react.js",
        "node.js",
        "css",
        "服务器",
        "数据库",
      ],
      questionList: [],
      allComment: [],
      userQuestionData: {},
      loading:false,
    };
  },
  methods: {
    async findParticularQuestion(e) {
      document.querySelector(".channel").children.forEach((i) => {
        i.style.color = "#000";
      });
      e.target.style.color = "#1890ff";
      this.questionList = await findQuestion(e.target.innerText);
    },
    askQuestion() {
      const url = this.$router.resolve({ path: "/question/post" });
      window.open(url.href);
    },
    async handlegetQuestions() {
      this.questionList = await getQuestions(this.questionList.length);
      for (let i of this.questionList) {
        this.allComment.push(...i.questionCommentList);
      }
    },
  },
  components: {
    question,
  },
  computed: {
    questionNum() {
      const num = this.questionList.filter((i) => {
        return i.questioner == this.$store.state.userId;
      });
      this.userQuestionData.questionNum = num.length;
      return num.length;
    },
    questionLike() {
      const userQuestion = this.questionList.filter((i) => {
        return i.questioner == this.$store.state.userId;
      });
      let likes = 0;
      console.log(userQuestion);
      userQuestion.forEach((i) => {
        likes += i.question_like.length;
      });
      this.userQuestionData.receiveLiked = likes;
      return likes;
    },

    answerNum() {
      const answers = this.allComment.filter((i) => {
        return i.comment_user == this.$store.state.userId;
      });
      this.userQuestionData.answerNum = answers.length;
      return answers.length;
    },

    answered() {
      const userQuestions = this.questionList.filter((i) => {
        return i.questioner == this.$store.state.userId;
      });
      let comments = 0;
      userQuestions.forEach((i) => {
        comments += i.questionCommentList.length;
      });
      this.userQuestionData.receiveComments = comments;
      return comments;
    },
  },

  created() {
    this.handlegetQuestions();
    this.loading = true;
    setTimeout(() => {
    this.loading = false;
    }, 400);
  },

  mounted() {
    const title = document.getElementsByTagName("title")[0];
    title.innerText = "小小博客 - 问答专区";
  },
};
</script>

<style lang='less' scoped>
.question-container {
  background: #f4f5f5;
  height: auto;
  border: 1px solid transparent;
  .content-area {
    width: 1300px;
    margin: 20px auto;
    display: flex;
    align-items: flex-start;
    .channel {
      width: 200px;
      background: #fff;
      .title {
        padding: 10px 5px;
        color: #000;
        font-size: 16px;
        border-bottom: 1px solid #eee;
      }

      li {
        list-style: none;
        text-align: center;
        padding: 8px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
      }
      li:hover {
        background: #fafafa;
        color: #1890ff;
      }
    }
    .main {
      background: #fff;
      width: 760px;
      margin: 0 20px;
      .tabs {
        display: flex;
        margin: 0 0;
        border-bottom: 1px solid #eee;
        li {
          list-style: none;
          padding: 12px 5px;
          margin: 0 20px;
          cursor: pointer;
        }
        :first-child {
          color: #1890ff;
        }
      }

      .showQuestion-list {
        margin: 0 0;
      }
      .empty{
        width: 100%;
        text-align: center;
        height: 400px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }

    aside {
      width: 360px;
      .title {
        display: flex;
        justify-content: space-between;
        padding: 8px 8px;
        border-bottom: 1px solid #eee;
        background: #fff;
        span {
          font-size: 16px;
          color: #000;
        }
      }

      .statistic {
        width: 100%;
        margin: 10px auto;
        background: #fff;

        .row {
          width: 100%;
          margin: 0 auto;
          display: flex;
          padding: 10px 10px;
          justify-content: space-between;
        }

        .col {
          width: 50%;
          display: flex;
          justify-content: space-between;
          padding: 10px 8px;
        }
      }
    }
  }
}
</style>