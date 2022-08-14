<template>
  <div class="follow" @click="checkAnotherUserInfo">
    <div class="avatar-box">
      <img :src="followInfo.userInfo.avatarURL" alt="" />
    </div>
    <div class="detail-box">
      <div>
        <div style="height: 28px">
          <span style="color: #000; font-weight: 600">{{
            followInfo.userInfo.nickname
          }}</span>
          <span class="gender">
            <a-icon
              type="man"
              class="male"
              v-show="followInfo.userInfo.gender == 1"
            />
            <a-icon
              type="woman"
              class="female"
              v-show="followInfo.userInfo.gender == 0"
            />
          </span>
        </div>

        <div style="font-size: 12px; color: #777">
          <span>{{ followInfo.userInfo.position }}</span
          ><span v-if="followInfo.userInfo.personal_presentation"
            >@{{ followInfo.userInfo.personal_presentation }}</span
          ><span v-if="followInfo.userInfo.personal_company"
            >@{{ followInfo.userInfo.personal_company }}</span
          >
        </div>
      </div>
      <div>
        <a
          @click.stop="handleFollowed"
          v-if="isFollowed"
          style="border: 1px solid"
          >已关注</a
        ><a
          @click.stop="handleFollowed"
          v-if="!isFollowed && followInfo._id != $store.state.userId"
          style="background: #fff; color: #65bbc8; border: 1px solid"
          >关注</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import { followedUser } from "../../api/users";
export default {
  name: "follow",
  props: ["followInfo"],
  data() {
    return {
      follows: [],
    };
  },
  methods: {
    async handleFollowed(e) {
      const user = this.followInfo._id;
      const myId = this.$store.state.userId;
      const res = await followedUser(user, myId);
      this.follows = res;
    },

    checkAnotherUserInfo() {
      sessionStorage.setItem("anotherId", JSON.stringify(this.followInfo._id));
      let newUrl = this.$router.resolve({
        path: `/user/anotherUser/${this.followInfo._id}`,
      });
      window.open(newUrl.href, "anotherInfo");
    },
  },
  computed: {
    isFollowed() {
      return this.follows.includes(this.$store.state.userId);
    },
  },
  created() {
    console.log(this.followInfo);
    this.follows = this.followInfo.userInfo.follower;
  },
};
</script>

<style lang="less" scoped>
.follow {
  width: 660px;
  height: 100px;
  padding: 2px 8px;
  display: flex;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  align-items: center;
  //   margin-top: -16px;
  justify-content: space-between;
  transition: all 0.1s;

  .avatar-box {
    padding: 2px 10px;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }

  .detail-box {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;

    i.male {
      margin-left: 5px;
      color: rgb(19, 56, 219);
      line-height: 35px;
      font-size: 12px;
    }
    i.female {
      margin-left: 5px;

      color: rgb(255, 0, 111);
      line-height: 35px;
      font-size: 12px;
    }
  }

  a {
    padding: 5px 10px;
    background: #65bbc8;
    color: #fff;
    border-radius: 3px;
    font-size: 12px;
    transition: 0.3s;
  }
}

.follow:hover {
  background: #fafafa;
}
</style>