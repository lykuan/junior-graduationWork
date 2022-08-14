const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, unique: true, trim: true },
    password: String,
    email: String,
    userInfo: {
      nickname: String,
      gender: { type: Number, min: 0, max: 2 },
      avatarURL: { type: String, },
      follower: { type: Array, default:[] },
      follow: { type: Array, default: [] },
      likedArticle: [],
      likedMoment: [],
      postArticle: [],
      position: { type: String, defalut: "" },
      personal_company: { type: String, defalut: "" },
      personal_presentation: { type: String, defalut: "" },
      questionResolve:[]
    },
    createTime: {
      type: Date,
      defalut: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createTime" },
  }
);

const users = mongoose.model("user", UserSchema);

module.exports = users;
