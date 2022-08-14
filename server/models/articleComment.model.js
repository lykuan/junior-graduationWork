const mongoose = require("mongoose");

const { Schema } = mongoose;

const ArticleCommentSchema = new Schema(
  {
    article_id: { type: Schema.Types.ObjectId, default: null },
    commentInfo: {
      user: { type: Schema.Types.ObjectId, default: null },
      userInfo: "",
      commentContent: String,
      commentLiked: [],
      reply: [
        {
          user: { type: Schema.Types.ObjectId, default: null },
          userInfo: { type: Object, default: null },
          replyContent: String,
          replyLiked: [],
          replied: [],
          createTime: {
            type: Date,
            default: Date.now,
          },
          updateTime: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    createTime: {
      type: Date,
      default: Date.now,
    },
    updateTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
  }
);

const articleComment = mongoose.model("articleComment", ArticleCommentSchema);

module.exports = articleComment;
