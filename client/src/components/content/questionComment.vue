<template>
  <div class="question-comment-container">
    <div class="headInfo">
      <span class="avatar-box"
        ><img :src="commentData.commenterInfo[0].userInfo.avatarURL"
      /></span>
      <div class="mainInfo">
        <div class="questionInfo">
          <span style="color: #000; font-weight: 600">{{
            commentData.commenterInfo[0].userInfo.nickname
          }}</span
          ><span style="color: #aaa; font-size: 13px"
            >{{ commentData.createTime }}
          </span>
        </div>
      </div>
    </div>

    <div class="comment-content" v-html="commentData.comment_content"></div>

    <div class="action-box">
      <ul>
        <li>
          <a-button class="resolve"><a-icon type="edit" />回复</a-button>
        </li>
        <li>
          <button @click="resolvedQuestion" :class="{ resolved: isResolved }">
            <a-icon type="like" v-show="!isResolved" /><a-icon
              type="like"
              theme="filled"
              v-show="isResolved"
              style="border: none"
              :class="{ resolved: isResolved }"
            />
            解决<span v-if="resolved.length > 0" style="margin: 0 2px">{{
              this.resolved.length
            }}</span>
          </button>
        </li>
        <li class="more">
          <el-dropdown placement="bottom" size="mini">
            <span
              style="cursor: pointer"
              v-show="commentData.comment_user == $store.state.userId"
              ><a-icon type="ellipsis"
            /></span>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                ><a style="color: #777" @click="confirmDelete"
                  >删除</a
                ></el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { deleteAnswer, receivedAnswer } from "../../api/question";
export default {
  name: "questionComment",
  props: ["commentData"],
  data() {
    return {
      resolved: [],
    };
  },
  methods: {
    confirmDelete() {
      this.$confirm({
        title: "删除回答",
        content: "确认删除吗?,删除后，回答不会出现在问题下方,是否删除?",
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk: () => {
          this.handleDeleteAnswer();
        },
        onCancel() {},
      });
    },

    async resolvedQuestion(e) {
      const c_id = this.commentData._id;
      const u_id = this.$store.state.userId;
      if (this.commentData.comment_user == this.$store.state.userId) {
        this.$message.warn("不能给自己点赞");
        return;
      }
      const res = await receivedAnswer(c_id, u_id);
      console.log(res);
      this.resolved = res.resolved;
    },

    async handleDeleteAnswer() {
      const q_id = this.commentData.question_id;
      const c_id = this.commentData._id;
      const newAnswer = await deleteAnswer(q_id, c_id);
      console.log(newAnswer);
      if (newAnswer) this.$message.success("删除成功");
      this.$emit("dispatchData", newAnswer);
    },
  },
  computed: {
    isResolved() {
      return this.resolved.includes(this.$store.state.userId);
    },
  },
  created() {
    const chinese = new Date(this.commentData.createTime)
      .toLocaleString()
      .match(/\p{sc=Han}/gu)
      .join("");

    const hour = new Date(this.commentData.createTime).getHours();
    if (chinese == "上午" || chinese == "下午") {
      this.commentData.createTime = new Date(this.commentData.createTime)
        .toLocaleString()
        .replace(/\p{sc=Han}/gu, "")
        .replace(/\//g, "-");
      this.commentData.createTime = this.commentData.createTime.replace(
        /\d*(?=:)/,
        hour
      );
    }

    this.resolved = this.commentData.comment_resolved;
  },
};
</script>

<style lang="less" scoped>
.resolved {
  color: #1890ff;
  border: 1px solid #1890ff;
}
button {
  background: #fff;
  outline: none;
  padding: 5px 0;
  width: 80px;
  border-radius: 20px;
  border: 1px solid #ccc;
  cursor: pointer;
}
.question-comment-container {
  width: 960px;
  background: #fff;
  border: 1px solid #eee;
  padding: 30px 20px;
  margin-bottom: 10px;

  .headInfo {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    .avatar-box {
      width: 50px;
      height: 50px;
      img {
        width: 35px;
        height: 35px;
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

  .comment-content {
    margin: 20px 60px;
    padding: 0 10px;
  }

  .action-box {
    margin: 0 60px;
    ul {
      display: flex;
      padding: 5px 10px;
      margin: 0 0;

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
      li:first-child {
        margin: 0 0;
      }
    }
  }
}
</style>