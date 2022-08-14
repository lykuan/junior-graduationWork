<template>
  <div
    class="app-container"
    v-loading.fullscreen="listLoading"
    element-loading-text="Loading"
  >
    <el-table
      v-show="!listLoading"
      fit
      highlight-current-row
      :data="displayIssues"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="问答 ID">
              <span>{{ props.row._id }}</span>
            </el-form-item>
            <el-form-item label="问答标题">
              <span>{{ props.row.question_title }}</span>
            </el-form-item>
            <el-form-item label="问答内容">
              <div style="padding: 50px 0">
                <article
                  v-html="props.row.question_contentHtml"
                  style="text-align: left"
                ></article>
              </div>
            </el-form-item>
            <el-form-item label="文章作者">
              <span>{{ props.row.questionerInfo[0].username }}</span>
            </el-form-item>

            <el-form-item label="问答标签">
              <el-tag
                style="margin: 0 2px"
                v-for="tag in props.row.question_labels"
                :key="tag"
                disable-transitions
                >{{ tag }}</el-tag
              >
            </el-form-item>
            <el-form-item label="发布时间">
              <span>{{ props.row.createTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="问答 ID"
        width="95"
        prop="_id"
        class-name="column"
      >
      </el-table-column>
      <el-table-column
        label="问答标题"
        prop="question_title"
        class-name="column"
      >
      </el-table-column>
      <el-table-column
        label="问答作者"
        width="110"
        align="center"
        prop="questionerInfo[0].username"
        class-name="column"
      >
      </el-table-column>
      <el-table-column
        label="问答内容"
        width="200"
        align="center"
        prop="question_contentText"
      >
      </el-table-column>

      <el-table-column
        label="问答标签"
        width="110"
        align="center"
        class-name="column"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="tag in scope.row.question_labels"
            :key="tag"
            disable-transitions
            >{{ tag }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="发布时间"
        width="200"
        prop="createTime"
      >
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="footer">
      <el-pagination
        layout="prev, pager, next"
        :total="totalPage"
        @next-click="getMore"
        @prev-click="getPrevous"
        @current-change="toCurrent"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getIssues, deleteIssue } from "../../../api/admin";

export default {
  name: "index",

  data() {
    return {
      allIssues: [],
      displayIssues: [],
      listLoading: true,
      isDisplayIssues: 0,
      prevous: 10,
    };
  },
  created() {
    this.fetchArticles();
  },
  computed: {
    totalPage() {
      return Math.ceil(this.allIssues.length / 10) * 10;
    },
  },
  methods: {
    fetchArticles() {
      this.listLoading = true;
      getIssues().then((res) => {
        this.allIssues = res;
        console.log(this.allIssues);
        this.allIssues.forEach((i) => {
          i.createTime = new Date(i.createTime)
            .toLocaleString()
            .replace(/(?<= ).*/gu, "");
        });
        this.displayIssues = this.allIssues.slice(0, 10);
        this.isDisplayIssues = this.allIssues.length;
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      });
    },

    handleDelete(index, data) {
      deleteIssue(data._id).then((res) => {
        if (res.deletedCount > 0) {
          this.displayIssues.splice(index, 1);
          this.$message.success("删除提问成功");
        }
      });
    },

    getMore() {
      this.listLoading = true;
      this.displayIssues = this.allIssues.slice(
        this.prevous,
        this.prevous + 10
      );
      this.displayIssues -= 10;
      if (this.displayIssues < 10) {
        this.prevous += this.displayIssues;
      } else {
        this.prevous += 10;
      }
      setTimeout(() => {
        this.listLoading = false;
      }, 500);
    },

    getPrevous() {
      this.prevous = this.prevous - this.displayIssues.length;
      this.displayIssues += 10;

      this.displayIssues = this.allIssues.slice(
        this.prevous - 10,
        this.prevous
      );
    },

    toCurrent(e) {
      this.listLoading = true;
      if (this.totalPage / 10 == e) {
        this.displayIssues = this.allIssues.slice(
          10 * (e - 1),
          this.allIssues.length
        );
      } else {
        this.displayIssues = this.allIssues.slice((e - 1) * 10, e * 10);
      }
      setTimeout(() => {
        this.listLoading = false;
      }, 500);
    },
  },
};
</script>

<style lang="less" scoped>
.app-container {
  border: 1px solid #fff;
}
/deep/ .el-table th {
  text-align: center;
}
/deep/ .el-table td {
  // margin: 0 auto;
  text-align: center;
  color: #000;
}
/deep/ .el-table tr td:nth-child(5) .cell {
  height: 40px;
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 auto;
  text-align: center;
  width: 100%;
}
/deep/ .el-table tr td:nth-child(6) .cell {
  span.el-tag {
    margin: 2px;
  }
}

.footer {
  text-align: center;
  background: #fff;
  margin-top: 5px;
}
</style>
