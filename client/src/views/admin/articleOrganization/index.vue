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
      :data="displayArticles"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="文章 ID">
              <span>{{ props.row._id }}</span>
            </el-form-item>
            <el-form-item label="文章标题">
              <span>{{ props.row.article_title }}</span>
            </el-form-item>
            <el-form-item label="文章内容">
              <div style="padding: 50px 0">
                <article
                  v-html="props.row.article_contentHtml"
                  style="text-align: left"
                ></article>
              </div>
            </el-form-item>
            <el-form-item label="文章作者">
              <span>{{ props.row.articleUser[0].username }}</span>
            </el-form-item>
            <el-form-item label="文章分类">
              <span>{{ props.row.article_category }}</span>
            </el-form-item>
            <el-form-item label="文章标签">
              <el-tag
                style="margin: 0 2px"
                v-for="tag in props.row.article_labels"
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
        label="文章ID"
        width="95"
        prop="_id"
        class-name="column"
      >
      </el-table-column>
      <el-table-column
        label="文章标题"
        prop="article_title"
        class-name="column"
      >
      </el-table-column>
      <el-table-column
        label="文章作者"
        width="110"
        align="center"
        prop="articleUser[0].username"
        class-name="column"
      >
      </el-table-column>
      <el-table-column
        label="文章内容"
        width="200"
        align="center"
        prop="article_contentText"
      >
      </el-table-column>

      -->

      <el-table-column
        label="文章分类"
        align="center"
        :formatter="formatCategory"
        prop="article_category"
      >
      </el-table-column>
      <el-table-column
        label="文章标签"
        width="110"
        align="center"
        class-name="column"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="tag in scope.row.article_labels"
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
          <!-- <el-dialog
            title="删除文章"
            :visible.sync="centerDialogVisible"
            width="30%"
            center
          >
            <span>确认删除吗,删除后文章不可恢复</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="centerDialogVisible = false">取 消</el-button>
              <el-button type="primary" 
                >确 定</el-button
              >
            </span>
          </el-dialog> -->
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
import { getArticles, deleteArticle } from "../../../api/admin";

export default {
  name: "index",

  data() {
    return {
      allArticleLists: [],
      displayArticles: [],
      listLoading: true,
      isDisplayArticles: 0,
      prevous: 10,
      centerDialogVisible: false,
    };
  },
  created() {
    this.fetchArticles();
  },
  computed: {
    totalPage() {
      return Math.ceil(this.allArticleLists.length / 10) * 10;
    },
  },
  methods: {
    fetchArticles() {
      this.listLoading = true;
      getArticles(this.allArticleLists.length).then((res) => {
        this.allArticleLists = res.data;
        this.allArticleLists.forEach((i) => {
          i.createTime = new Date(i.createTime)
            .toLocaleString()
            .replace(/(?<= ).*/gu, "");
        });
        this.displayArticles = this.allArticleLists.slice(0, 10);
        this.isDisplayArticles = this.allArticleLists.length;
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      });
    },

    formatCategory(data) {
      if (data.article_category == "") return;
      if (data.article_category == "client") {
        data.article_category = "前端";
      } else if (data.article_category == "server") {
        data.article_category = "后端";
      } else if (data.article_category == "http") {
        data.article_category = "网络";
      } else if (data.article_category == "reading") {
        data.article_category = "阅读";
      }
      return data.article_category;
    },

    handleDelete(index, data) {
      const articleId = data._id;
      
      deleteArticle(articleId).then((res) => {
        if (res.deletedCount > 0) {
          this.displayArticles.splice(index, 1);
          this.$message.success("删除文章成功");
          this.centerDialogVisible = false
        }
      });
    },

    getMore() {
      this.listLoading = true;
      this.displayArticles = this.allArticleLists.slice(
        this.prevous,
        this.prevous + 10
      );
      this.isDisplayArticles -= 10;
      if (this.isDisplayArticles < 10) {
        this.prevous += this.isDisplayArticles;
      } else {
        this.prevous += 10;
      }
      setTimeout(() => {
        this.listLoading = false;
      }, 500);
    },

    getPrevous() {
      this.prevous = this.prevous - this.displayArticles.length;
      this.isDisplayArticles += 10;

      this.displayArticles = this.allArticleLists.slice(
        this.prevous - 10,
        this.prevous
      );
    },

    toCurrent(e) {
      this.listLoading = true;
      if (this.totalPage / 10 == e) {
        this.displayArticles = this.allArticleLists.slice(
          10 * (e - 1),
          this.allArticleLists.length
        );
      } else {
        this.displayArticles = this.allArticleLists.slice((e - 1) * 10, e * 10);
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
/deep/ .el-table tr td:nth-child(3) .cell {
  height: 40px;
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 auto;
  text-align: center;
  width: 100%;
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
/deep/ .el-table tr td:nth-child(7) .cell {
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
