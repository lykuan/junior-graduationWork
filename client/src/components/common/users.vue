<template>
  <div class="users-container">
    <section class="users">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="users-title" >
          <a target="_blank" @click="register">注册</a>
          <a target="_blank" @click="login">登录</a>
        </div>
        <el-form-item label="用户名:" prop="user">
          <el-input v-model="ruleForm.user" autocomplete="on"></el-input
        ></el-form-item>
        <el-form-item label="密码:" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input type="email" v-model="ruleForm.email"></el-input>
        </el-form-item>
        <div class="code">
          <el-form-item label="验证码:" prop="verifyCode">
            <div class="getCode" style="">
              <el-input v-model="ruleForm.verifyCode"></el-input>
              <a
                ref="code"
                style="
                  position: absolute;
                  right: 18px;
                  font-size: 12px;
                  color: #333;
                "
                @click.once="verifyCode"
                >获取验证码</a
              >
              <span
                ref="deadline"
                style="
                  position: absolute;
                  padding: 0 20px;
                  right: 1px;
                  border-radius: 3px;
                  color: #fff;
                  background: #1d7dfa;
                  opacity: 0.7;
                  display: none;
                  font-size: 12px;
                "
                >{{ deadline }}后获取验证码</span
              >
            </div>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button
            type="primary"
            style="width: 50%; margin-bottom: 30px;background:#2364dd"
            :loading="registerLoading"
            @click="submitForm('ruleForm')"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>
<script>
import { registerUser, getCode } from "../../api/users";
export default {
  name: "Login",
  data() {
    let validateUser = (rule, value, callback) => {
      if (!value) {
        callback(new Error("用户名不能为空"));
      } else if (!/^[a-zA-Z]+/g.test(value))
        callback(new Error("用户名必须以字母开头"));
      else if (/\p{sc=Han}/gu.test(value)) {
        callback(new Error("用户名不能含有中文"));
      } else if (!/^[A-Za-z]\w{3,14}$/.test(value)) {
        callback(new Error("用户名不能小于4位大于15位"));
      } else {
        callback();
      }
    };

    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6 || value.length > 16) {
        callback(new Error("密码长度不能小于6位大于16位"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    let checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      setTimeout(() => {
        const reg = /^\w+@(\w+\.)+(com|cn)$/g;

        if (!value.match(reg)) {
          callback(new Error("邮箱格式不正确"));
        } else {
          callback();
        }
      }, 1000);
    };
    let verifyCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error("验证码不能为空"));
      } else if (value != this.serverCode) {
        callback(new Error("验证码错误"));
      } else {
        callback();
      }
    };

    return {
      serverCode: "",
      deadline: 30,
      registerLoading: false,
      ruleForm: {
        user: "",
        pass: "",
        checkPass: "",
        email: "",
        verifyCode: "",
      },
      rules: {
        user: [{ validator: validateUser, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        email: [{ validator: checkEmail, trigger: "blur" }],
        verifyCode: [{ validator: verifyCode, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.registerLoading = true;
          console.log(this.registerLoading);
          let { user, pass, email } = this.ruleForm;
          let res = await registerUser({ user, pass, email });
          if (res) {
            setTimeout(() => {
              this.$message.success("注册成功");
              this.registerLoading = false;
              this.$router.push("/users/login");
            }, 200);
          } else {
            this.registerLoading = false;

            this.$message.warning("用户名或邮箱已存在");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    async verifyCode() {
      if (!this.ruleForm.email) this.$message.warning("邮箱不能为空");
      const res = await getCode(this.ruleForm.email);
      let [code] = res.message.match(/\d+/g);
      this.serverCode = code;
      this.ruleForm.verifyCode = code;
      setTimeout(() => {
        this.serverCode = "";
      }, 60000);
      this.$message.success("验证码以发送");

      this.$refs.code.style.display = "none";
      this.$refs.deadline.style.display = "block";
      const timer = setInterval(() => {
        this.deadline--;
        if (this.deadline == 0) {
          clearInterval(timer);
          this.$refs.code.style.display = "block";
          this.$refs.deadline.style.display = "none";
        }
      }, 1000);
    },
    register() {
      this.$router.push("/users/register");
    },
    login() {
      this.$router.replace("/users/login");
    },
  },
};
</script>

<style lang="less" scoped>
.users-container {
  padding: 50px 0;
  height: 100vh;
  background: #eef;

  .users {
    // background-color: #3a4333 !important;
    width: 400px;
    border: 1px solid red;
    border-radius: 10px;
    border: 1px solid #ddd;
    box-shadow: 1px 2px 3px #777;
    margin: 0 auto;
    padding: 10px;
    background: #fff;
    // width: max-content;
    // height: auto;
    opacity: 0.7;
  }

  .getCode {
    display: flex;
    width: content;
    justify-content: space-between;
  }
  .users-title {
    width: 100%;
    height: 30px;
    text-align: center;
    box-sizing: border-box;
    margin-bottom: 20px;
    a {
      font-size: 20px;
      text-decoration: none;
      color: #777;
      margin: 0 20px;
      letter-spacing: 2px;
      cursor: pointer;
    }
    a:hover {
      color: #65bbc8;
    }
  }
}
</style>