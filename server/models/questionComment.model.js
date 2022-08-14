const mongoose = require("mongoose");

const { Schema } = mongoose;

const QuestionCommentSchema = new Schema(
  {
    question_id: { type: Schema.Types.ObjectId, default: null },
    comment_user: { type: Schema.Types.ObjectId, default: null },
    comment_content: String,
    comment_resolved: [],
    reply: [
      {
        user: { type: Schema.Types.ObjectId, default: null },
        userInfo: { type: Object, default: null },
        replyContent: String,
        replyLiked: [],
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

const questionComment = mongoose.model("questionComment", QuestionCommentSchema);

module.exports = questionComment;
