<template>
  <div class="question">
    <div class="content-area">
      <div class="statistics">
        <section>
          <p class="data">{{ questionData.questionCommentList.length }}</p>
          <p>回答</p>
        </section>
        <section>
          <p class="data">{{ questionData.question_watched }}</p>
          <p>浏览</p>
        </section>
      </div>
      <div class="main-content" @click="checkQuestionDetail">
        <div class="question-title">
          <h1>{{ questionData.question_title }}</h1>
        </div>
        <div class="question-content">
          {{ questionData.question_contentText }}
        </div>
        <div class="questionInfo">
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
                border-radius: 3px;
              "
              v-for="item in questionData.question_labels"
              :key="item"
            >
              {{ item }}
            </li>
          </ul>
          <div style="font-size: 12px">
            <span style="margin: 0 20px">{{
              questionData.questionerInfo[0].userInfo.nickname
            }}</span
            ><span>{{ this.questionData.createTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "question",
  props: ["questionData", "individualData"],

  methods: {
    checkQuestionDetail() {
      const url = this.$router.resolve({
        path: `/question/${this.questionData._id}`,
        query: this.individualData,
      });
      sessionStorage.setItem("questionData", JSON.stringify(this.questionData));
      window.open(url.href);
    },
  },
  created() {
   
    const chinese = new Date(this.questionData.createTime)
      .toLocaleString()
      .match(/\p{sc=Han}/gu)
      .join("");

    const hour = new Date(this.questionData.createTime).getHours();
    if (chinese == "上午" || chinese == "下午") {
      this.questionData.createTime = new Date(this.questionData.createTime)
        .toLocaleString()
        .replace(/\p{sc=Han}/gu, "")
        .replace(/\//g, "-");
      this.questionData.createTime = this.questionData.createTime.replace(
        /\d*(?=:)/,
        hour
      );
    }
  },
};
</script>

<style lang='less' scoped>
.question {
  height: 110px;
  width: 760px;
  background: #fff;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;

  .content-area {
    display: flex;
    // align-items:center;
    height: 100%;
    .statistics {
      width: 120px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      p {
        margin: 0 0;
        text-align: center;
        font-size: 13px;
      }
      .data {
        font-weight: 400;
        font-size: 16px;
        color: #000;
      }
    }

    .main-content {
      height: 90%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 600px;
      cursor: pointer;

      .questionInfo {
        display: flex;
        justify-content: space-between;
        // padding: 0 8px;
        margin-top: 5px;
      }

      .question-content {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        height: 35px;
        // margin: 10px 0;
      }
    }
  }
}
</style>