<template>
  <div class="userProfile-container">
    <div class="userProfileArea">
      <a-form-model
        ref="ruleForm"
        :model="updateUserProfile"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 21 }"
        labelAlign="left"
      >
        <h2>个人资料</h2>

        <section>
          <a-form-model-item label="用户昵称" :colon="false">
            <div class="suffix">
              <span
                class="Nicknamelimit"
                style="margin-right: 18px"
                v-if="updateUserProfile.nickname != null"
                >{{ updateUserProfile.nickname.length }}</span
              ><span
                v-if="updateUserProfile.nickname == null"
                style="margin-right: 18px"
                >0</span
              ><span>/20</span>

              <input
                type="text"
                v-model.trim="updateUserProfile.nickname"
                maxLength="20"
                @input="getValue"
                placeholder="填写你的昵称"
                ref="nicknameArea"
              />
              <p
                :class="{
                  errorTip: errorExist || empty,
                  common: !errorExist || !empty,
                }"
                ref="errTip"
              ></p>
            </div>
          </a-form-model-item>
        </section>
        <section>
          <a-form-model-item label="性别" :colon="false">
            <a-select
              style="width: 120px"
              @change="handleChange"
              v-model="this.presentGender"
            >
              <a-select-option value="1"> 男 </a-select-option>
              <a-select-option value="0"> 女 </a-select-option>
              <a-select-option value="2"> 保密 </a-select-option>
            </a-select>
          </a-form-model-item>
        </section>
        <section>
          <a-form-model-item label="职位" :colon="false">
            <div class="suffix">
              <span
                v-if="
                  updateUserProfile.position != null ||
                  updateUserProfile.position != ''
                "
                style="margin-right: 18px"
                >{{ updateUserProfile.position.length }}</span
              ><span
                v-if="
                  updateUserProfile.position == null ||
                  updateUserProfile.position == ''
                "
                style="margin-right: 18px"
                >0</span
              ><span>/50</span>

              <input
                type="text"
                v-model.trim="updateUserProfile.position"
                placeholder="填写你的职位"
                maxlength="50"
                @input="getValue"
              />
            </div>
          </a-form-model-item>
        </section>
        <section>
          <a-form-model-item label="公司" :colon="false">
            <div class="suffix">
              <span
                v-if="updateUserProfile.company != null"
                style="margin-right: 18px"
                >{{ updateUserProfile.company.length }}</span
              ><span
                v-if="updateUserProfile.company == null"
                style="margin-right: 18px"
                >0</span
              ><span>/50</span>

              <input
                type="text"
                v-model.trim="updateUserProfile.company"
                placeholder="填写你的公司"
                maxlength="50"
                @input="getValue"
              />
            </div>
          </a-form-model-item>
        </section>

        <section>
          <a-form-model-item label="个人介绍" :colon="false">
            <div class="suffix-textarea">
              <span
                v-show="updateUserProfile.presentation != null"
                style="margin-right: 24px"
                >{{ updateUserProfile.presentation.length }}</span
              ><span
                v-show="updateUserProfile.presentation == null"
                style="margin-right: 24px"
                >0</span
              ><span>/100</span>
              <textarea
                maxLength="100"
                v-model.trim="updateUserProfile.presentation"
                placeholder="填写您的个人介绍，如专业知识，兴趣爱好等"
                @input="getValue"
              />
            </div>
          </a-form-model-item>
        </section>

        <a-form-item>
          <a-button
            style="font-size: 12px"
            html-type="submit"
            @click="submitForm"
          >
            保存修改
          </a-button>
        </a-form-item>
      </a-form-model>
    </div>

    <aside>
      <p>我的头像</p>

      <el-upload
        :show-file-list="false"
        :headers="{ authorization: $store.state.authorization }"
        action="http://localhost:8888/uploads/avatar"
        :on-success="handleAvatarSuccess"
        name="avatar"
      >
        <div class="avatarContainer">
          <a class="avatar" slot="reference"
            ><img
              v-show="$store.state.userAvatar != 'null'"
              :src="$store.state.userAvatar"
            />

            <img
              v-show="$store.state.userAvatar == 'null'"
              class="defaultAvatar"
              src="../../assets/img/defaultAvatar.jpg"
              alt=""
            />
          </a>
        </div>
      </el-upload>
      <p class="tip">支持jpg、jpeg、png格式 大小5M以内的图片</p>
    </aside>
  </div>
</template>

<script>
import { usersInfo, getUserAvatar, updateUserProfile } from "../../api/users";

export default {
  name: "userProfile",
  data() {
    return {
      updateUserProfile: {
        nickname: null,
        gender: null,
        position: null,
        company: null,
        presentation: null,
      },
      presentGender: "",
      errorExist: false,
      empty: false,
    };
  },
  methods: {
    getValue(e) {
      const limit = e.target.previousSibling.innerText.match(/\/\d+/g)[0];

      e.target.previousSibling.innerText = e.target.value.length + limit;

      //   e.target.nextSilbling()
    },
    // getUpdateV(e){

    //   const limit = e.target.previousSibling.innerText.match(/\/\d+/g)[0];
    //    e.target.previousSibling.innerText = e.target.value.length + limit;

    // },
    async submitForm(e) {
      if (this.updateUserProfile.nickname.length == 0) {
        this.empty = true;
        this.$refs.nicknameArea.style.border = "1px solid red";
        this.$refs.nicknameArea.style.boxShadow = " 0 0 2px red";
        this.$refs.errTip.innerText = "昵称不能为空";
      } else if (this.updateUserProfile.nickname.length < 2) {
        this.errorExist = true;
        this.$refs.errTip.innerText =
          "昵称长度请控制在2-20个字符(汉字算2个字符)";
        this.$refs.nicknameArea.style.border = "1px solid red";
        this.$refs.nicknameArea.style.boxShadow = " 0 0 2px red";
      } else {
        this.errorExist = false;
        this.empty = false;
        this.$refs.errTip.style.opacity = 0;
        this.$refs.nicknameArea.style.border = " none";
        this.$refs.nicknameArea.style.borderBottom =
          "1px solid rgb(70, 172, 231)";
        this.$refs.nicknameArea.style.boxShadow = "none";
        const res = await updateUserProfile(
          this.$store.state.userId,
          this.updateUserProfile
        );
        if (res) {
          localStorage.setItem("userInfo", JSON.stringify(res));
          this.openNotification();
        }
      }
    },
    openNotification() {
      this.$notification.open({
        message: "修改资料成功",
        style: {
          width: "600px",
        },
      });
    },
    async handleAvatarSuccess(response, file) {
      this.random = Date.now();

      this.u_id = response;
      if (response.status != 403) {
        const avatarInfo = await getUserAvatar(this.u_id);

        usersInfo(this.u_id, this.$store.state.authorization).then((res) => {
          this.usersInfo = res.data;
          const avatar =
            res.data.avatarURL == "null"
              ? "null"
              : res.data.userInfo.avatarURL + `?random=${this.random}`;

          localStorage.setItem("userAvatar", avatar);
          this.$store.commit(
            "changeAvatar",
            localStorage.getItem("userAvatar")
          );
        });
      } else {
        this.$message.error(response.message + ",请重新登录");
        localStorage.setItem("userToken", " ");
      }
    },

    handleChange(value) {
      this.updateUserProfile.gender = value;
    },
  },

  created() {
    this.$store.commit(
      "changeUserInfo",
      JSON.parse(localStorage.getItem("userInfo"))
    );
    this.updateUserProfile.nickname = this.$store.state.userInfo.nickname;
    this.updateUserProfile.gender = this.$store.state.userInfo.gender;
    this.updateUserProfile.position = this.$store.state.userInfo.position;
    this.updateUserProfile.company =
      this.$store.state.userInfo.personal_company;
    this.updateUserProfile.presentation =
      this.$store.state.userInfo.personal_presentation;
    if(this.updateUserProfile.gender == 0){
      this.presentGender = "女"
    }else if(this.updateUserProfile.gender == 1){
      this.presentGender = "男"
    }else{
      this.presentGender = "保密"
    }
  },

  mounted(){
      const title = document.getElementsByTagName("title")[0];
    title.innerText = `个人资料-小小博客`;
  }
};
</script>

<style lang="less" scoped>
.common {
  font-size: 12px;
  height: 0;
  opacity: 0;
  margin: 0 0;
}
.errorTip {
  color: red;
  font-size: 12px;
  letter-spacing: 1px;
  transition: all 0.3s;
  height: 15px;
  opacity: 1;
  margin: 0 0;
  background: #fff;
}
.userProfile-container {
  width: 960px;
  border: 1px solid #fff;
  background: #fff;
  padding-left: 30px;
  display: flex;

  h2 {
    height: 60px;
    width: 450px;
    border: none;
    border-bottom: 1px solid #ddd;
    line-height: 50px;
  }

  section {
    border: none;
    width: 450px;
    border-bottom: 1px solid #eee;
    input {
      width: 420px;
      outline: none;
      height: 35px;
      border: 1px solid #fff;
      border-bottom-color: rgb(70, 172, 231);
      border-radius: 2px;
      // outline: none;
      transition: all 0.5s;
      padding-right: 30px;
      background: #f6f8fa;
    }
    div.suffix {
      margin: 0;
      padding: 0;
      position: relative;

      span {
        right: -20px;
        font-size: 12px;
        position: absolute;
        z-index: 7;
      }
    }
    div.suffix-textarea {
      position: relative;
      // height:85px;
      span {
        font-size: 12px;
        position: absolute;
        right: -17px;
        bottom: 5px;
        z-index: 7;
      }
    }
  }
}
.userProfileArea {
  width: 500px;

  input:hover {
    background: #ddddea;
    outline: none;
  }
  input:focus {
    background: #fff;
    border: 1px solid #0e86e9;
    box-shadow: 0 0 2px #0e86e9;
  }
  textarea {
    width: 420px;
    height: 100px;
    outline: none;
    background: #f6f8fa;
    transition: all 0.3s;
    border: 1px solid #eee;
  }
  textarea:hover {
    background: #eee;
  }
  textarea:focus {
    border: 1px solid #0e86e9;
    box-shadow: 0 0 2px #0e86e9;
    background: #fff;
  }
}

.avatar {
  width: 150px;
  height: 150px;
  display: inline-block;
  border-radius: 50%;
}
.avatarContainer {
  border-radius: 50%;
}
.avatarContainer:hover::after {
  opacity: 1;
}
.avatarContainer::after {
  content: "＋点击修改头像";
  display: block;
  position: absolute;
  width: 150px;
  height: 150px;
  top: 35px;
  border-radius: 50%;
  line-height: 150px;
  text-align: center;
  font-size: 13px;
  letter-spacing: 2px;
  z-index: 999;
  color: #fff;
  background: rgba(50, 50, 50, 0.4);
  font-family: "Font Awesome 5 Free";
  opacity: 0;
  transition: all 0.2s;
}
.tip {
  margin-top: 5px;
  width: 200px;
  font-size: 12px;
  color: #aaa;
  letter-spacing: 1px;
}

aside {
  margin: 30px 0;
  height: 200px;
  align-self: space-around;
  position: relative;

  img {
    border-radius: 50%;
    width: 150px;
    height: 150px;
  }

  .edit {
    left: 5px;
    bottom: 15px;
    display: block;
    width: fit-content;
    height: 25px;
    position: absolute;
    background-color: #fff;
    border: 1px solid #ddd;
    text-decoration: none;
    border-radius: 5px;
    font-size: 10px;
    color: #000;
    padding: 0 2px;
    box-sizing: border-box;
    z-index: 11;

    i {
      font-size: 10px;
      margin-right: 4px;
      line-height: 25px;
      color: #333;
    }
  }
}
</style>