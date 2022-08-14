<template>
  <div class="postQuestion-container">
    <main class="content-area">
      <article class="postArea">
        <p class="title">标题</p>
        <div class="inputTitle">
          <a-input
            v-model="questionInfo.question_title"
            placeholder="请描述具体问题,杜绝大佬,求救,欢迎等词语"
          ></a-input>
        </div>
        <p class="content">内容</p>

        <div id="editor"></div>
      </article>
      <aside>
        <div class="title">AI助手</div>
        <div class="tip" v-if="isError">
          <a-alert
            message="标题错误"
            type="error"
            show-icon
            style="background: #fff; border: none; margin: 0 0"
          />

          <div
            v-for="item in errorCollection"
            :key="item"
            style="font-size: 13px; padding: 2px 15px"
          >
            {{ item }}
          </div>
        </div>

        <div class="title-recommend">
          <p style="display: flex; justify-content: space-between">
            <span>标题推荐</span
            ><span><a @click="getRecommendTitle">获取标题</a></span>
          </p>
          <p class="title-container">
            <span>{{ recommendTitle }}</span>
            <a
              v-if="needRecommendTitle"
              style="float: right; color: #777"
              @click="adoptRecommendTitle"
              >采纳</a
            >
          </p>
        </div>

        <div class="labels-container">
          <div @click="showLabels">标签</div>
          <div class="labels">
            <a-popover title="标签" placement="left">
              <template slot="content">
                <ul
                  style="
                    width: 200px;
                    height: 200px;
                    display: flex;
                    flex-wrap: wrap;
                  "
                >
                  <li
                    @click="handleSelect"
                    class="label-item"
                    style="
                      list-style: none;
                      height: max-content;
                      padding: 2px 5px;
                      margin: 3px 3px;
                      cursor: pointer;
                      color: #777;
                      background: #eef;
                      font-size: 12px;
                      border-radius: 3px;
                    "
                    v-for="item in channel"
                    :key="item"
                  >
                    {{ item }}
                  </li>
                </ul>
              </template>

              <ul style="width:border:1px solid;display:flex;margin:10px 0">
                <li
                  style="
                    list-style: none;
                    height: max-content;
                    padding: 2px 5px;
                    margin: 3px 3px;
                    cursor: pointer;
                    color: #fff;
                    background: #65bbc8;
                    align-items: center;
                    border-radius: 3px;
                  "
                  v-for="label in questionInfo.question_labels"
                  :key="label"
                >
                  {{ label }}
                </li>
                <li
                  style="
                    list-style: none;
                    height: max-content;
                    padding: 2px 5px;
                  "
                >
                  <a v-if="questionInfo.question_labels.length < 3"
                    ><a-icon type="plus"
                  /></a>
                </li>
                <li
                  style="
                    list-style: none;
                    height: max-content;
                    padding: 2px 5px;
                  "
                >
                  <span
                    style="margin: 0 5px"
                    v-if="questionInfo.question_labels.length == 0"
                    >至少添加一个标签</span
                  >
                </li>
              </ul>
            </a-popover>
          </div>
        </div>

        <div class="action_box">
          <a-button @click="submitQuestion">提交问题</a-button>
        </div>
      </aside>
    </main>
  </div>
</template>

<script>
import E from "wangeditor";
import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";
import { postQuestion } from "../../api/question";
export default {
  name: "postQuestion",
  data() {
    return {
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
      isError: false,
      errorCollection: [],
      eidtor: "",
      questionInfo: {
        user: "",
        question_title: "",
        content_html: "",
        content_text: "",
        question_labels: [],
      },
      questionList: [],
      needRecommendTitle: false,
      recommendTitle: "暂无标题推荐",
    };
  },
  methods: {
    adoptRecommendTitle() {
      this.questionInfo.question_title = this.recommendTitle;
      console.log(this.questionInfo);
    },
    getRecommendTitle() {
      this.needRecommendTitle = true;
      this.recommendTitle = "运行结果及报错内容，如何解决？";
    },
    handleChange(value) {
      if (value.length == 3) {
        console.log(this.$refs.select);
      }
    },
    showLabels() {
      document.querySelector(".labels").style.display = "block";
    },
    handleSelect(e) {
      if (
        this.questionInfo.question_labels.length < 3 &&
        !this.questionInfo.question_labels.includes(e.target.innerText)
      ) {
        this.questionInfo.question_labels.push(e.target.innerText);
        e.target.style.background = "#65bbc8";
        e.target.style.color = "#fff";
      } else if (
        this.questionInfo.question_labels.includes(e.target.innerText)
      ) {
        this.questionInfo.question_labels.splice(
          this.questionInfo.question_labels.indexOf(e.target.innerText),
          1
        );
        e.target.style.background = "#eef";
        e.target.style.color = "#777";
      } else {
        this.$message.warn("最多选三个标签");
        return;
      }
    },

    async submitQuestion() {
      this.errorCollection = [];
      if (this.questionInfo.question_title == "") {
        this.$message.warn("标题不能为空");
        return;
      } else if (this.questionInfo.question_title.length < 10) {
        this.isError = true;
        this.errorCollection.push("标题长度小于10个字符,请修改");
      } else if (
        this.questionInfo.question_title.includes("救命") ||
        this.questionInfo.question_title.includes("求救")
      ) {
        this.isError = true;
        this.errorCollection.push(`禁止出现词语:救命或求救`);
      } else if (this.questionInfo.question_title.includes("小白")) {
        this.isError = true;
        this.errorCollection.push(`禁止出现词语:小白`);
      } else if (this.questionInfo.question_title.includes("大佬")) {
        this.isError = true;
        this.errorCollection.push(`禁止出现词语:大佬`);
      } else if (this.questionInfo.question_labels.length < 1) {
        this.$message.warn("请至少添加一个标签");
      } else {
        this.isError = false;
        this.questionInfo.user = localStorage.getItem("userId");
        const res = await postQuestion(this.questionInfo);
        console.log(res);
        if (res.action == "post") {
          this.$message.success("提问成功");
        } else {
          this.$message.success("编辑问题成功");
        }
        const chinese = new Date(res.questionData.createTime)
          .toLocaleString()
          .match(/\p{sc=Han}/gu)
          .join("");

        const hour = new Date(res.questionData.createTime).getHours();
        if (chinese == "上午" || chinese == "下午") {
          res.questionData.createTime = new Date(res.questionData.createTime)
            .toLocaleString()
            .replace(/\p{sc=Han}/gu, "")
            .replace(/\//g, "-");
          res.questionData.createTime = res.questionData.createTime.replace(
            /\d*(?=:)/,
            hour
          );
        }
        sessionStorage.setItem(
          "questionData",
          JSON.stringify(res.questionData)
        );
        this.$router.push({
          path: "/question",
        });
      }
    },
  },

  created() {
    if (this.$route.query.question_contentHtml) {
      this.questionInfo = this.$route.query;
    }
    console.log(this.questionInfo);
    if (!Array.isArray(this.questionInfo.question_labels)) {
      this.questionInfo.question_labels = Array.of(
        this.questionInfo.question_labels
      );
    }
    if (this.questionInfo.question_labels[0] == undefined) {
      this.questionInfo.question_labels = [];
    }
  },

  mounted() {
    const presentContent = this.$route.query;

    this.editor = new E("#editor");
    this.editor.config.lang = "html";
    this.editor.highlight = hljs;
    this.editor.config.height = 340;
    this.editor.config.zIndex = 1;
    this.editor.id = "wangedit";
    this.editor.config.showMenuTooltips = true;
    this.editor.config.placeholder = `<strong>1.问题遇到的现象和发生背景</strong>  <br><br><br>

<strong>2.问题相关代码，请勿粘贴截图</strong> <br><br><br>

<strong>3.运行结果及报错内容 </strong><br><br><br>

<strong> 4.我的解答思路和尝试过的方法</strong> <br><br><br>

<strong>5. 我想要达到的结果</strong>`;
    // 配置菜单栏，设置不需要的菜单
    this.editor.config.excludeMenus = ["todo", "video"];
    this.editor.config.uploadImgAccept = [];
    this.editor.config.uploadImgServer = "http://localhost:8888/question/post";
    this.editor.config.uploadImgMaxLength = 5;
    this.editor.config.uploadFileName = "questionImage";
    this.editor.config.uploadImgHeaders = {
      authorization: localStorage.getItem("userToken"),
    };
    this.editor.config.uploadImgHooks = {
      customInsert: (insertImgFn, result) => {
        insertImgFn(result.data.url);
        this.questionInfo.images.push(result.data.url);
      },
    };
    this.editor.config.onchange = () => {
      this.questionInfo.content_html = this.editor.txt.html();
      this.questionInfo.content_text = this.editor.txt.text();
    };
    this.editor.create();
    this.editor.txt.html(presentContent.question_contentHtml);

    const title = document.getElementsByTagName("title")[0];
    title.innerText = `问答提问页`;
  },
};
</script>

<style lang='less' scoped>
.postQuestion-container {
  width: 100vw;
  background: #f4f5f5;
  border: 1px solid transparent;

  .content-area {
    width: 90%;
    display: flex;
    margin: 20px auto;
    .postArea {
      width: 960px;
      height: 600px;
      background: #fff;
      margin: 0 50px;
      padding: 0 12px;
      .ant-input {
        padding: 1px 3px;
        box-shadow: none;
        letter-spacing: 1px;
      }

      p {
        padding: 10px 0;
      }
    }

    aside {
      width: 350px;
      background: #fff;
      padding: 15px 15px;

      .title {
        padding: 10px 15px;
        color: #000;
        font-size: 16px;
      }

      .labels-container {
        margin: 60px 0;
        padding: 0 15px;
        .labels {
          a {
            color: #000;
            background: #eef;
            display: inline-block;
            width: 20px;
            height: 20px;
            text-align: center;
          }
          a:hover {
            background: #eed;
          }
        }
      }
      .title-recommend {
        width: 100%;
        margin-top: 40px;
        padding: 0 15px;

        p {
          margin: 5px 0;
        }
        a {
          color: #65bbc8;
        }
        .title-container {
          background: #eee;
          height: 30px;
          line-height: 30px;
          padding: 0 5px;
          p {
            margin: 2px 0;
          }
        }
      }

      .action_box {
        width: 100%;
        padding: 10px 2px;
        text-align: center;
        .ant-btn {
          background: #65bbc8;
          color: #fff;
          height: 40px;
        }
      }
    }
  }
}
</style>