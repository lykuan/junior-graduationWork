<template>
  <div class="accountSecurity-container">
    <h2>修改密码</h2>

    <section class="changePassword">
      <a-form-model
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :label-col="{ span: 3.2 }"
        :wrapper-col="{ span: 23 }"
      >
        <a-form-model-item
          has-feedback
          label="旧密码"
          prop="oldPass"
          :colon="false"
        >
          <a-input
            v-model="ruleForm.oldPass"
            type="password"
            autocomplete="off"
          />
        </a-form-model-item>
        <a-form-model-item
          has-feedback
          label="新密码"
          prop="pass"
          :colon="false"
        >
          <a-input v-model="ruleForm.pass" type="password" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item
          has-feedback
          label="确认新密码"
          prop="checkPass"
          :colon="false"
        >
          <a-input
            v-model="ruleForm.checkPass"
            type="password"
            authoComplete="off"
          />
        </a-form-model-item>
        <span class="updatePassTip"
          >请确保你更新的密码最多15个字符或至少8个字符包含数字和小写字母</span
        >
        <a-form-model-item :wrapper-col="{ span: 14 }">
          <a-button @click="submitForm('ruleForm')"> 更新密码 </a-button>
          <a href="" class="forgotPass">忘记密码</a>
        </a-form-model-item>
      </a-form-model>
    </section>
  </div>
</template>


<script>
import md5 from "js-md5";
import { updatePassword } from "../../api/users";
export default {
  name: "userAccountSecurity",
  data() {
    let validateOld = (rule, value, callback) => {
      console.log(md5(value) == this.oldPassword);
      if (!value) {
        return callback(new Error("请输入原密码"));
      } else if (md5(value) !== this.oldPassword) {
        return callback(new Error("原密码错误"));
      } else {
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      console.log(5);
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再一次输入新密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        oldPass: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        oldPass: [{ validator: validateOld, trigger: "change" }],
        pass: [{ validator: validatePass, trigger: "change" }],
        checkPass: [{ validator: validatePass2, trigger: "change" }],
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 21 },
      },
      oldPassword: "",
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updatePassword(this.$store.state.userId, this.ruleForm.pass).then(
            (res) => {
              if (res.success) {
                this.$message.success(res.message);
                localStorage.setItem("userToken", "");
                localStorage.setItem("status", "403");
                localStorage.setItem("username", "");
                localStorage.setItem("userAvatar", "");
                localStorage.setItem("userId", "");
                this.$store.commit(
                  "changeStatus",
                  localStorage.getItem("status")
                );
                this.$router.replace('/users/login')
              }
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  created() {
    this.$store.commit("changePassword", sessionStorage.getItem("pwd"));
    this.oldPassword = this.$store.state.password;
  },

  mounted() {
    const title = document.getElementsByTagName("title")[0];
    title.innerText = `小小博客-账号安全`;
  },
};
</script>

<style lang="less" scoped>
.accountSecurity-container {
  width: 960px;
  background: #fff;
  padding-left: 30px;

  h2 {
    height: 50px;
    width: 500px;
    border: none;
    border-bottom: 1px solid #ddd;
    line-height: 50px;
  }

  .changePassword {
    width: 500px;

    .ant-input {
      height: 35px;
      border-radius: 0 0;
      border: none;
      border-bottom: 1px solid #3445e0;
      background: #f6f8fa;
    }
    .ant-input:hover {
      background: #eee;
    }
    .ant-input:focus {
      background: #fff;
      border: 1px solid #3445e0;
      box-shadow: 0 0 2px #3445e0;
    }

    .updatePassTip {
      letter-spacing: 2px;
      font-size: 10px;
      margin-bottom: 2px;
    }
    .ant-btn {
      font-size: 12px;
    }
    .forgotPass {
      font-size: 10px;
      margin-left: 15px;
    }
  }
}
</style>