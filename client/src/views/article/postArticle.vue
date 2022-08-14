<template>
  <div id="postArticle">
    <header class="editor-head">
      <div class="left-box">
        <a-input
          size="large"
          placeholder="请输入文章标题..."
          v-model="article.article_title"
        />
      </div>
      <div class="right-box">
        <span>文章将自动保存至草稿箱</span>
        <a-button>草稿箱</a-button>
        <a-dropdown
          v-model="menuVisible"
          :trigger="['click']"
          placeholder="bottomRight"
        >
          <a-button type="primary" v-if="!$route.query._id">发布</a-button>
          <a-button type="primary" v-if="$route.query._id">更新</a-button>

          <a-menu slot="overlay">
            <a-menu-item key="1">
              <h2>发布文章</h2>
            </a-menu-item>
            <a-menu-item key="2">
              <div class="articleCategory">
                <label for="">分类:</label>
                <a-radio-group v-model="article.article_category">
                  <a-radio-button value="client"> 前端 </a-radio-button>
                  <a-radio-button value="server"> 后端 </a-radio-button>
                  <a-radio-button value="http"> 网络 </a-radio-button>
                  <a-radio-button value="reading"> 阅读 </a-radio-button>
                </a-radio-group>
              </div>

              <div class="keywords">
                <label for="">添加标签:</label>
                <a-select
                  v-model="article.article_labels"
                  mode="multiple"
                  style="width: 50%"
                  placeholder="选择文章标签"
                  option-label-prop="label"
                  :maxTagCount="3"
                >
                  <a-select-option
                    v-for="item in options"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  >
                    {{ item.value }}
                  </a-select-option>
                </a-select>
              </div>

              <div class="articleCoverContainer">
                <label for="">文章封面:</label>
                <el-upload
                  class="articleCover-uploader"
                  action="http://localhost:8888/article/articleCover"
                  :show-file-list="false"
                  :on-success="handleArticleCoverSuccess"
                  name="articleCover"
                >
                  <img
                    v-if="article.article_coverUrl"
                    :src="article.article_coverUrl"
                    class="articleCover"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </a-menu-item>
            <a-menu-item key="3">
              <div class="publishZone">
                <a-button @click="menuVisible = false"> 取消 </a-button
                ><a-button
                  type="primary"
                  v-if="!$route.query._id"
                  @click="postMyArticle"
                >
                  确认并发布
                </a-button>
                <a-button
                  type="primary"
                  v-if="$route.query._id"
                  @click="postMyArticle"
                >
                  确认并更新
                </a-button>
              </div>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <section class="personalDetail" v-if="$store.state.status == 200">
          <el-dropdown :show-timeout="10">
            <a>
              <img
                v-show="$store.state.userAvatar != 'null'"
                :src="$store.state.userAvatar"
                alt=""
                class="miniAvatar"
              />

              <img
                v-show="
                  $store.state.userAvatar == 'null' &&
                  $store.state.status == 200
                "
                class="defaultMiniAvatar"
                src="../../assets/img/defaultAvatar.jpg"
                alt=""
              />
              <a-icon class="icon" type="caret-down" theme="filled" />
            </a>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <a-icon type="user" /><a href="#"
                  >登陆中,<em
                    ><strong>{{ $store.state.userInfo.username }}</strong></em
                  ></a
                >
              </el-dropdown-item>
              <hr />
              <el-dropdown-item
                ><a-icon type="home" /><a @click="toProfile">
                  我的主页</a
                ></el-dropdown-item
              >
              <el-dropdown-item>
                <a-icon type="star" />
                <a href="#"> 收藏的文章</a></el-dropdown-item
              >
              <el-dropdown-item
                ><a-icon type="like" /><a href="#">
                  喜欢的文章</a
                ></el-dropdown-item
              >
              <el-dropdown-item
                ><a-icon type="question" />
                <a href="#"> 我的提问</a></el-dropdown-item
              >
              <el-dropdown-item
                ><a-icon type="ordered-list" />
                <a href="#"> 我的任务</a></el-dropdown-item
              >
              <hr />
              <el-dropdown-item class="cancelLogin">
                <a-icon type="logout" /><a href="" @click="cancelLogin">退出</a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </section>
      </div>
    </header>

    <div class="main">
      <div id="editor-box"></div>
    </div>
  </div>
</template>

<script>
import { postArticle } from "../../api/article";
import E from "wangeditor";
import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";

export default {
  name: "postAritcle",

  data() {
    return {
      article: {
        article_title: "",
        article_contentText: "",
        article_contentHtml: "",
        article_category: "",
        article_labels: [],
        article_coverUrl: "",
        updated: false,
      },
      menuVisible: false,
      options: [
        { value: "前端", label: "前端" },
        { value: "后端", label: "后端" },
        { value: "javascript", label: "javascript" },
        { value: "css", label: "css" },
        { value: "vue.js", label: "vue.js" },
        { value: "react", label: "react" },
        { value: "数据库", label: "database" },
        { value: "node.js", label: "node.js" },
        { value: "http", label: "http" },
      ],
    };
  },

  mounted() {
    const editor = new E("#editor-box");
    editor.config.height = 600;
    editor.config.lang = "html";
    editor.highlight = hljs;
    editor.config.zIndex = 1;
    editor.id = "wangedit";

    editor.config.excludeMenus = ["video"];
    editor.config.uploadImgMaxLength = 3;
    editor.config.uploadImgAccept = [];
    editor.config.uploadImgServer = "http://localhost:8888/article/post";
    editor.config.uploadFileName = "articleInner";
    editor.config.uploadImgHeaders = {
      authorization: localStorage.getItem("userToken"),
      u_id: localStorage.getItem("userId"),
      size: "medium",
    };

    editor.config.focus = true;
    editor.config.placeholder = " ";
    editor.config.onchange = () => {
      this.article.article_contentHtml = editor.txt.html();
      this.article.article_contentText = editor.txt.text();
    };

    editor.config.uploadImgHooks = {
      customInsert: (insertImgFn, result) => {
        // result 即服务端返回的接口
        console.log(result);
        // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
        insertImgFn(result.data.url);
        this.article.articleImage.push(result.data.url);
      },
    };

    editor.create();
    if (this.$route.query.article_contentHtml && this.$route.query._id) {
      console.log(this.$route);
      this.article = this.$route.query;
      editor.txt.html(this.article.article_contentHtml);
      this.article.article_contentText = editor.txt.text();
      if (this.article.article_category == "前端") {
        this.article.article_category = "client";
      } else if (this.article.article_category == "后端") {
        this.article.article_category = "server";
      } else if (this.article.article_category == "网络") {
        this.article.article_category = "http";
      } else {
        this.article.article_category = "reading";
      }
      if (this.$route.query.article_labels == undefined) {
        this.article.article_labels = [];
      }
      console.log(this.article);
    }
  },
  computed: {
    filteredOptions() {
      return OPTIONS.filter((o) => !this.article.article_labels.includes(o));
    },
  },
  methods: {
    handleArticleCoverSuccess(res, file) {
      this.article.article_coverUrl = res.articleCoverUrl;
    },
    handleChange(selectedItems) {
      console.log(selectedItems);
      this.article.article_labels = selectedItems;
    },
    async postMyArticle() {
      const u_id = localStorage.getItem("userId");
      const token = localStorage.getItem("userToken");
      if (
        this.article.article_title.length == 0 ||
        this.article.article_contentHtml.length == 0
      ) {
        this.$message.warn("文章标题或内容不能为空");
        return;
      } else if (this.article.article_contentText.length < 15) {
        this.$message.warn("文章内容过少");
        return;
      } else if (this.article.article_category == "") {
        this.$message.warn("请选择分类");
        return;
      } else if (this.article.article_labels.length == 0) {
        this.$message.warn("请至少选择一个标签");
        return;
      } else {
        this.article.updated = this.article._id!=''? true : false;
        console.log(this.article)

        const res = await postArticle(this.article, u_id, token);
        if (res.postSuccess) {
          this.$message.success(res.message);
          this.$router.push("/articleCommunity");
        } else this.$message.error(res.message);
      }
    },

    toProfile() {
      const u_id = localStorage.getItem("userId");
      this.$router.push("/user/" + u_id);
    },
    cancelLogin() {
      // this.$store.commit("changeToken", " ")
      localStorage.setItem("userToken", "");
      localStorage.setItem("status", "");
      localStorage.setItem("userId", " ");
      localStorage.setItem("username", " ");
    },
  },
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}

#editor-box {
  position: relative;
  z-index: 1;
}

.ant-tabs-bar {
  margin-bottom: none;
}

.articleCover-uploader .el-upload {
  background: red;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  // overflow: hidden;
}
.articleCover-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.articleCover {
  width: 178px;
  height: 178px;
  display: block;
}

.ant-radio-button-wrapper {
  width: 65px;
  height: 30px;
  margin: 5px 5px;
  border-radius: 0 0;
  // background: #f4f5f5;
  font-size: 14px;
  text-align: center;
  color: #333;
  :hover {
    color: rgb(24, 162, 241);
  }
}
.ant-btn {
  margin-left: 10px;
  width: 100px;
  height: 30px;
  border-radius: 0 0;
}
.ant-dropdown-menu-item {
  margin: 10px 0;
  border: none;
  height: 40px;
  border-bottom: 1px solid #ddd;
}

.ant-dropdown-menu-item:hover {
  background: #fff;
}

.ant-dropdown-menu {
  width: 400px;
  height: 500px;
  .ant-dropdown-menu-item:first-child {
    height: 70px;
    line-height: 60px;
    text-indent: 15px;
  }

  .ant-dropdown-menu-item:nth-of-type(2) {
    padding: 20px 0;
    box-sizing: border-box;
    height: 350px;
    .articleCategory {
      height: 80px;
      line-height: 80px;
      // padding: 0 10px;
      color: #666;
      box-sizing: border-box;
      // background: blue;
      label {
        margin: 0 10px;
      }
    }
    .keywords {
      width: 100%;
      margin-top: 40px;
      label {
        margin: 0 10px;
      }
      .el-input__inner {
        box-sizing: border-box;
      }
    }

    .articleCoverContainer {
      margin: 40px 0;
      display: flex;

      .articleCover {
        width: 200px;
        height: 135px;
      }
      label {
        margin: 0 10px;
      }
    }
  }
  .ant-dropdown-menu-item:last-child {
    margin: 20px 0;
    border-bottom: none;
    .publishZone {
      padding: 0 5px;
      float: right;
      line-height: 40px;
    }
  }
}

.el-dropdown-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 180px;
  box-shadow: 0 0 3px silver;
  color: #86909c;
  padding: 0;
  border: none;

  // .el-dropdown-menu__item:hover a {
  //   color: #1890ff;
  // }

  a {
    padding: 5px 0;
    display: inline-block;
    text-decoration: none;
    color: #777;
    font-size: 12px;
  }
}
#postArticle {
  width: 100vw;
  height: 100vh;
  background: #fff;
}

.editor-head {
  display: flex;
  width: 100vw;
  height: 66px;
  background: #fff;
  align-items: center;
  justify-content: space-between;

  .left-box {
    margin: 0 10px;
    width: 50%;
    .ant-input {
      padding: 0;
      border: none;
      letter-spacing: 3px;
      text-indent: 30px;
      line-height: 80px;
      height: 60px;
      font-size: 25px;
      color: #000;
      outline: none;
    }
    .ant-input:focus {
      box-shadow: none;
    }
  }
  .right-box {
    display: flex;
    align-items: center;
    width: 30%;
    height: 100%;
    justify-content: space-evenly;

    span {
      color: #86909c;
    }

    .ant-btn {
      width: 60px;
    }
    .icon {
      color: #777;
      font-size: 12px;
    }
    img {
      border-radius: 50%;
      width: 40px;
      height: 40px;
    }
  }
}
</style>