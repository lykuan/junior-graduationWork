<template>
  <div class="questionContent-container" v-loading.fullscreen="loading" element-loading-text="Loading...">
    <main>
      <article>
        <div class="headInfo">
          <span class="avatar-box"
            ><img
              :src="questionData.questionerInfo[0].userInfo.avatarURL"
              alt=""
          /></span>
          <div class="mainInfo">
            <div class="questionInfo">
              <span style="color: #000; font-weight: 600">{{
                questionData.questionerInfo[0].userInfo.nickname
              }}</span
              ><span style="color: #aaa; font-size: 13px">{{
                questionData.createTime
              }}</span>
            </div>
            <div class="watched-record">
              浏览<span>{{ questionData.question_watched }}</span>
            </div>
          </div>
        </div>
        <div
          style="padding: 0 5px; width: max-content; cursor: pointer"
          @click="toHome"
        >
          首页
        </div>
        <div class="title">
          <h1>{{ questionData.question_title }}</h1>
        </div>
        <div>
          <ul style="display: flex; flex-wrap: wrap; margin: 0 0">
            <li
              class="label-item"
              style="
                list-style: none;
                height: max-content;
                padding: 2px 2px;
                margin: 3px 3px;
                color: #777;
                background: #eef;
                font-size: 12px;
                border: 1px solid #eee;
                border-radius: 3px;
              "
              v-for="item in questionData.question_labels"
              :key="item"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div
          class="question-content"
          v-html="questionData.question_contentHtml"
        ></div>

        <div class="action-box">
          <ul>
            <li>
              <a-button class="resolve" @click="anwser"
                ><a-icon type="edit" />解答</a-button
              >
            </li>
            <li>
              <button @click="handleLikeQuestion" :class="{ liked: isLiked }">
                <a-icon type="like" v-if="likes.length == 0" />
                <a-icon
                  type="like"
                  theme="filled"
                  v-if="likes.length > 0"
                />好问题<span style="margin: 0 2px" v-if="likes.length > 0">{{
                  likes.length
                }}</span>
              </button>
            </li>
            <li
              class="more"
              v-show="questionData.questioner == $store.state.userId"
            >
              <el-dropdown placement="bottom" size="mini">
                <span style="cursor: pointer"><a-icon type="ellipsis" /></span>

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    ><a style="color: #777" @click="confirmDeleteQuestion"
                      >删除</a
                    ></el-dropdown-item
                  >
                  <el-dropdown-item
                    ><a style="color: #777" @click="reEdit"
                      >编辑</a
                    ></el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </li>
          </ul>
        </div>
      </article>
      <div class="tabs">
        <div style="color: #000">{{ questionCommentList.length }} 条回答</div>
        <ul>
          <li>最热</li>
          <li>最新</li>
        </ul>
      </div>
      <div class="questionComment-list">
        <question-comment
          v-for="item in questionCommentList"
          :key="item._id"
          :commentData="item"
          @dispatchData="handleNewAnswer"
        ></question-comment>
      </div>
      <div style="background: #fff; width: 960px">
        <div id="editor"></div>
        <div class="submitComment">
          <a-button @click="postQuestionComment">提交</a-button>
        </div>
      </div>
    </main>
    <aside>
      <div class="title">
        <span>我的问答</span>
        <a-button @click="askQuestion"><a-icon type="plus" />提问题</a-button>
      </div>

      <div class="statistic">
        <div class="row">
          <div class="col">
            <span>提问</span
            ><span>{{ individualQuestionData.questionNum }}</span>
          </div>
          <div class="col">
            <span>被点赞</span
            ><span>{{ individualQuestionData.receiveLiked }}</span>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <span>回答</span><span>{{ individualQuestionData.answerNum }}</span>
          </div>
          <div class="col">
            <span>被评论</span
            ><span>{{ individualQuestionData.receiveComments }}</span>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import E from "wangeditor";
import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";
import questionComment from "../../components/content/questionComment.vue";
import {
  submitQuestion,
  increaseWatched,
  likedQuestion,
  deleteQuestion,
} from "../../api/question";
export default {
  name: "questionContent",
  data() {
    return {
      questionData: "",
      show: "",
      editor: "",
      questionCommentList: [],
      likes: [],
      loading:false,
      questionComment: {
        q_id: "",
        user: "",
        content: "",
      },
      individualQuestionData: {},
    };
  },
  created() {
    this.questionData = JSON.parse(sessionStorage.getItem("questionData"));
    this.individualQuestionData = this.$route.query;
    if (!Array.isArray(this.questionData.question_labels)) {
      this.questionData.question_labels = Array.of(
        this.questionData.question_labels
      );
    }

    if (this.questionData.questionCommentList.length > 0) {
      this.questionData.questionCommentList.forEach((i) => {
        i.commenterInfo = [];
        let j = 0;
        while (j < this.questionData.commenterInfo.length) {
          if (i.comment_user == this.questionData.commenterInfo[j]._id) {
            i.commenterInfo.push(this.questionData.commenterInfo[j]);
          }
          ++j;
        }
      });
    }
    this.questionCommentList = this.questionData.questionCommentList;
    this.likes = this.questionData.question_like;
    this.handleWatchedQuestion();
  },
  methods: {
    toHome(){
      this.loading = true;
      setTimeout(() => {
      this.loading = false;
      this.$router.push('/question')
        
      }, 400);
    },
    confirmDeleteQuestion() {
      this.$confirm({
        title: "删除提问",
        content: "确认删除吗提问?,删除后,不可恢复,是否删除?",
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk: () => {
          this.handleDeleteQuestion();
        },
        onCancel() {},
      });
    },
    async handleDeleteQuestion() {
      const q_id = this.questionData._id;
      const res = await deleteQuestion(q_id);
      if (res.deletedCount) this.$message.success("删除成功");
      this.$router.push("/question");
    },
    async handleLikeQuestion() {
      if (this.questionData.questioner == this.$store.state.userId) {
        this.$message.warn("不能给自己点赞");
        return;
      }
      const u_id = this.$store.state.userId;
      const q_id = this.questionData._id;
      const res = await likedQuestion(q_id, u_id);
      console.log(res);
      this.likes = res.likes;
    },
    reEdit() {
      const url = this.$router.resolve({
        path: "/question/post",
        query: this.questionData,
      });
      window.open(url.href);
    },
    askQuestion() {
      const url = this.$router.resolve({ path: "/question/post" });
      window.open(url.href);
    },
    anwser(e) {
      location.href = "#editor";
    },

    async postQuestionComment() {
      this.questionComment.user = this.$store.state.userId;
      this.questionComment.q_id = this.questionData._id;
      const data = await submitQuestion(this.questionComment);
      this.questionCommentList.push(data);
      this.editor.txt.clear();
      if (data) this.$message.success("回答成功");
    },
    handleNewAnswer(value) {
      this.questionCommentList = value;
    },

    async handleWatchedQuestion() {
      await increaseWatched(this.questionData._id);
    },
  },
  components: {
    questionComment,
  },
  computed: {
    isLiked() {
      return this.likes.includes(this.$store.state.userId);
    },
  },

  mounted() {
    const title = document.getElementsByTagName("title")[0];
    title.innerText = `${this.questionData.question_title}-小小论坛-问答专区`;

    this.editor = new E("#editor");
    this.editor.config.lang = "html";
    this.editor.highlight = hljs;
    this.editor.config.zIndex = 1;
    this.editor.config.height = 200;
    // editor.config.zIndex = 0;
    this.editor.config.focus = false;
    this.editor.config.placeholder = `1.请帮助提问者思考，用解决思路代替直接写代码<br>
2.为帮助更多用户，请用问答评论交流，不要私下沟通<br>
3.使用编辑功能来修正回答，不建议发布新回答<br>
`;
    this.editor.id = "wangedit";
    this.editor.config.showMenuTooltips = true;
    // 配置菜单栏，设置不需要的菜单
    this.editor.config.excludeMenus = ["todo", "video", "table"];
    this.editor.config.uploadImgAccept = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "webp",
    ];
    this.editor.config.uploadImgServer =
      "http://localhost:8888/question/questionComment";
    this.editor.config.uploadImgMaxLength = 4;
    this.editor.config.uploadFileName = "questionCommentImage";
    this.editor.config.uploadImgHeaders = {
      authorization: localStorage.getItem("userToken"),
    };

    this.editor.config.uploadImgHooks = {
      customInsert: (insertImgFn, result) => {
        insertImgFn(result.data.url);
      },
    };

    this.editor.config.onchange = () => {
      this.questionComment.content = this.editor.txt.html();
    };

    this.editor.create();
  },
};
</script>

<style lang="less" scoped>
.liked {
  color: #1890ff;
  border: 1px solid #1890ff !important;
  width: max-content;
}
.questionContent-container {
  background: #f4f5f5;
  display: flex;
  padding: 0 120px;
  button {
    background: #fff;
    outline: none;
    padding: 5px 0;
    width: 80px;
    border-radius: 20px;
    border: 1px solid #ccc;
    cursor: pointer;
  }
  main {
    width: 90%;
    margin: 0 auto;
  }
  article {
    width: 960px;
    // height: 700px;
    padding: 15px 15px;
    margin-top: 20px;
    background: #fff;

    .headInfo {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 5px;
      .avatar-box {
        width: 50px;
        height: 50px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
      }
      .mainInfo {
        display: flex;
        height: 40px;
        justify-content: space-between;
        flex-grow: 1;
        align-items: center;
        .questionInfo {
          width: 60%;
          span {
            margin: 0 10px;
          }
        }
        .watched-record {
          width: 30%;
          text-align: right;
          font-size: 13px;

          span {
            margin: 0 3px;
            font-size: 16px;
          }
        }
      }
    }

    .title {
      margin: 10px 0;
    }

    .question-content {
      margin: 30px 0;
    }
    .action-box {
      ul {
        display: flex;
        padding: 5px 0;

        align-items: center;
        li {
          list-style: none;
          margin: 0 10px;
          .ant-btn {
            border-radius: 20px;
          }
          .ant-btn.resolve {
            background: #1890ff;
            color: #fff;
            border: none;
          }
        }
      }
    }
  }

  .tabs {
    width: 960px;
    display: flex;
    padding: 5px 10px;
    justify-content: space-between;
    margin: 20px 0 0 0;
    background: #fff;
    align-items: center;
    ul {
      height: 100%;
      display: flex;
      margin: 0 0;
      padding: 5px 5px;
      align-items: center;
      li {
        list-style: none;
        margin: 0 5px;
      }
    }
  }

  #editor {
    width: 960px;
    margin: 10px 0;
    border-radius: 5px;
  }

  .submitComment {
    width: 960px;
    text-align: right;
  }

  aside {
    width: 360px;
    margin: 20px 0;
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
      margin: 5px auto;
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
</style>