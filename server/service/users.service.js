const users = require("../models/users.model");
const mongoose = require("mongoose");
class UsersService {
  async create(username, password, email, nickname) {
    const result = await users.create({
      username,
      password,
      email,
      userInfo: {
        nickname: nickname ? nickname : username,
        avatarURL: "null",
        gender: 1,
        likedArticle: [],
        likedMoment: [],
        position: "",
        personal_company: "",
        personal_presentation: "",
      },
    });
    return result;
  }

  async findUser() {
    const user = await users.find({}, "username");
    return user;
  }

  async findEamil() {
    const emails = await users.find({}, "email");
    return emails;
  }

  async login(u, flag) {
    if (flag) {
      const userInfo = await users.find({ email: u });
      return userInfo;
    } else {
      const userInfo = await users.find({ username: u });
      return userInfo;
    }
  }

  async findUserInfo(userId) {
    if (userId) {
      const [res] = await users.find({ _id: userId });
      return res;
    } else {
      const [res] = await users.find(
        {},
        { _id: 0, username: 1, email: 1, userInfo: 1 }
      );
      return res;
    }
  }

  async retainAvatarURL(avatarURL, UID) {
    const res = await users.updateOne(
      { _id: UID },
      { $set: { "userInfo.avatarURL": avatarURL } }
    );
    return res;
  }

  async userLikedArticle(like, uId, articleId) {
    const likes = await users.find(
      { _id: uId },
      { _id: 0, "userInfo.likedArticle": 1 }
    );
    const userLiked = likes[0].userInfo.likedArticle;
    let arr = [];
    if (like && !userLiked.includes(articleId)) {
      const res = await users.updateOne(
        { _id: uId },
        { $push: { "userInfo.likedArticle": articleId } }
      );
      if (res) {
        const userLikes = await users.find(
          { _id: uId },
          { _id: 0, "userInfo.likedArticle": 1 }
        );
        arr = userLikes[0].userInfo.likedArticle;
      }
    } else {
      const res = await users.updateOne(
        { _id: uId },
        { $pull: { "userInfo.likedArticle": { $in: [articleId] } } }
      );

      if (res) {
        const userLikes = await users.find(
          { _id: uId },
          { _id: 0, "userInfo.likedArticle": 1 }
        );
        arr = userLikes[0].userInfo.likedArticle;
      }
    }
    return arr;
  }

  async postedArticle(uId, articleId) {
    const postArticle = await users.find(
      { _id: uId },
      { _id: 0, "userInfo.postArticle": 1 }
    );
    let postedArticle = postArticle[0].userInfo.postArticle;
    let flag = postedArticle.includes(articleId);
    if (!flag) {
      return await users.updateOne(
        { _id: uId },
        { $push: { "userInfo.postArticle": articleId } }
      );
    }
  }

  async getUserPostedArticle(uId) {
    const postedArticles = await users.find(
      { _id: uId },
      { _id: 0, "userInfo.postArticle": 1 }
    );
    // const aggregate = users.aggregate([]);
    // const postedArticlesContent = await aggregate.lookup({
    //   from: "articles",
    //   localField: "userInfo.postArticle",
    //   foreignField: "_id",
    //   as: "userPostedArticles",
    // });
  }

  async getUserLiked(uId) {
    try {
      const res = await users.find(
        { _id: uId },
        { "userInfo.likedArticle": 1, _id: 0 }
      );
      const user = res[0];
      const userLikeds = user.userInfo.likedArticle;
      return userLikeds;
    } catch (err) {
      console.log(err.message, 111);
    }
  }

  async updateUserData(u_id, presentation) {
    const res = await users.updateOne(
      { _id: u_id },
      { "userInfo.personal_presentation": presentation }
    );
    if (res) {
      return true;
    }
  }

  async followedUser(user, followed) {
    const res = await users.find({ _id: user });
    const follower = res[0].userInfo.follower;
    if (!follower.includes(followed)) {
      await users.updateOne(
        { _id: user },
        { $push: { "userInfo.follower": followed } }
      );
      await users.updateOne(
        { _id: followed },
        { $push: { "userInfo.follow": user } }
      );
      const res = await users.find({ _id: user });
      return res[0].userInfo.follower;
    } else {
      await users.updateOne(
        { _id: user },
        { $pull: { "userInfo.follower": followed } }
      );
      await users.updateOne(
        { _id: followed },
        { $pull: { "userInfo.follow": user } }
      );
      const res = await users.find({ _id: user });
      return res[0].userInfo.follower;
    }
  }

  async alterUserProfile(u_id, content) {
    const res = await users.updateOne(
      { _id: u_id },
      {
        "userInfo.nickname": content.nickname,
        "userInfo.gender": content.gender,
        "userInfo.position": content.position,
        "userInfo.personal_company": content.company,
        "userInfo.personal_presentation": content.presentation,
      }
    );
    if (res.nModified > 0) {
      const user = await users.find({ _id: u_id });
      return user[0];
    }
  }

  async captureUserFollow(u_id, follow) {
    if (follow == "关注") {
      const follows = await users.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(u_id) } },
        { $unwind: "$userInfo.follow" },
      ]);
      for (let i of follows) {
        const [res] = await users.find({ _id: i.userInfo.follow });
        // console.log(res)
        i.followerInfo = res;
      }
      return follows;
    } else {
      const followers = await users.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(u_id) } },
        { $unwind: "$userInfo.follower" },
      ]);
      for (let i of followers) {
        const [res] = await users.find({ _id: i.userInfo.follower });
        i.followerInfo = res;
      }
      return followers;
    }
  }

  async captureUsers() {
    return await users.find({});
  }

  async updatePassword(u_id, password) {
    const res = await users.updateOne({ _id: u_id }, { password });
    if (res.nModified > 0) return true;
    else return false;
  }

  async adminDeleteUser(u_id){
    return await users.deleteOne({ _id: u_id })
  }
}

module.exports = new UsersService();
