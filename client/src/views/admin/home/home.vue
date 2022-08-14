<template>
  <div class="admin-home">
    <div class="title"><h2>小小博客后台管理系统</h2></div>
    <main>
      <el-menu
        class="el-menu-vertical-demo"
        default-active="1"
        @select="handleSelect"
      >
        <el-menu-item index="1">
          <template slot="title">
            <i class="el-icon-user-solid"></i>
            <span slot="title">用户管理中心</span>
          </template>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-info"></i>
          <span slot="title">文章管理中心</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-question"></i>
          <span slot="title">提问管理中心</span>
        </el-menu-item>
      </el-menu>

      <div class="show-data">
        <user-organization v-if="activeKey == 1"></user-organization>
        <article-organization v-if="activeKey == 2"></article-organization>
        <issue-organization v-if="activeKey == 3"></issue-organization>
      </div>
    </main>
  </div>
</template>

<script>
import articleOrganization from "../articleOrganization/index";
import userOrganization from "../userOrganization/userOrganization";
import issueOrganization from "../issueOrganization/issueOrganization";
export default {
  name: "adminHome",
  data() {
    return {
      activeKey: 1,
    };
  },
  methods: {
    handleSelect(index) {
      this.activeKey = index;
    },
  },
  components: {
    articleOrganization,
    userOrganization,
    issueOrganization,
  },

  created() {
    console.log(this.$route);
  },
};
</script>

<style lang='less' scoped>

.admin-home {
  background: #f4f5f5;
  width: 100%;
  .title {
    width: 100%;
    text-align: center;
    padding: 10px 0;
    letter-spacing: 1px;
    background: #fff;
  }
  main {
    display: flex;
    padding: 20px 0;
    justify-content: space-around;
    box-sizing: border-box;
  }
  .show-data {
    height: 100%;
    width: 80%;
    box-shadow: 0 0 1px #777;
    // flex-grow: 1;
  }
}
.el-menu-vertical-demo {
  width: 200px;
  min-height: 400px;
  box-shadow: 0 0 2px #777;

}
</style>