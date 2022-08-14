<template>
  <div
    class="app-container"
    v-loading.fullscreen="listLoading"
    element-loading-text="Loading"
  >
    <el-table
      v-show="!listLoading"
      fit
      size="medium"
      highlight-current-row
      :data="displayUsers"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="用户 ID">
              <span>{{ props.row._id }}</span>
            </el-form-item>
            <el-form-item label="用户名">
              <span>{{ props.row.username }}</span>
            </el-form-item>
            <el-form-item label="用户密码">
              <span>{{ props.row.password }}</span>
            </el-form-item>
            <el-form-item label="用户昵称">
              <span> {{ props.row.userInfo.nickname }}</span>
            </el-form-item>
            <el-form-item label="用户邮箱">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="用户职位">
              <span>{{ props.row.userInfo.position }}</span>
            </el-form-item>
            <el-form-item label="用户公司">
              <span>{{ props.row.userInfo.personal_company }}</span>
            </el-form-item>
            <el-form-item label="用户介绍">
              <span>{{ props.row.userInfo.personal_presentation }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.createTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="用户 ID"
        width="95"
        prop="_id"
        class-name="column"
      >
      </el-table-column>
      <el-table-column label="用户名" prop="username" class-name="column">
      </el-table-column>

      <el-table-column label="用户邮箱" width="200" align="center" prop="email">
      </el-table-column>

      <el-table-column label="用户昵称" align="center" prop="userInfo.nickname">
      </el-table-column>
      <el-table-column
        label="用户职位"
        width="110"
        align="center"
        prop="userInfo.position"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="用户公司"
        prop="userInfo.personal_company"
      >
      </el-table-column>

      <el-table-column
        align="center"
        label="创建时间"
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
import { getUsers, deleteUser } from "../../../api/admin";

export default {
  name: "index",

  data() {
    return {
      allUsers: [],
      displayUsers: [],
      listLoading: true,
      isDisplayUsers: 0,
      prevous: 10,
    };
  },
  created() {
    this.fetchUsers();
  },
  computed: {
    totalPage() {
      return Math.ceil(this.allUsers.length / 10) * 10;
    },
  },
  methods: {
    fetchUsers() {
      this.listLoading = true;
      getUsers().then((res) => {
        this.allUsers = res;
        this.allUsers.forEach((i) => {
          i.createTime = new Date(i.createTime)
            .toLocaleString()
            .replace(/(?<= ).*/gu, "");
        });
        this.displayUsers = this.allUsers.slice(0, 10);
        this.isDisplayUsers = this.allUsers.length;
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      });
    },

    handleDelete(index, data) {
      const u_id = data._id;
      deleteUser(u_id).then((res) => {
        if (res.deletedCount > 0) {
          this.displayUsers.splice(index, 1);
          this.$message.success("删除用户成功");
        }
      });
    },

    getMore() {
      this.listLoading = true;
      this.displayUsers = this.allUsers.slice(this.prevous, this.prevous + 10);
      this.isUsers -= 10;
      if (this.isDisplayUsers < 10) {
        this.prevous += this.isUsers;
      } else {
        this.prevous += 10;
      }
      setTimeout(() => {
        this.listLoading = false;
      }, 500);
    },

    getPrevous() {
      this.prevous = this.prevous - this.displayUsers.length;
      this.isUsers += 10;

      this.displayUsers = this.allUsers.slice(this.prevous - 10, this.prevous);
    },

    toCurrent(e) {
      this.listLoading = true;
      if (this.totalPage / 10 == e) {
        this.displayUsers = this.allUsers.slice(
          10 * (e - 1),
          this.allUsers.length
        );
      } else {
        this.displayUsers = this.allUsers.slice((e - 1) * 10, e * 10);
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
