const mongoose = require("mongoose");

const { Schema } = mongoose;

const QuestionCommentImageSchema = new Schema(
  {
    filename: { type: String},
    mimetype: String,
    size: Number,
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

const questionCommentImage = mongoose.model("questionCommentImage", QuestionCommentImageSchema);

module.exports = questionCommentImage;
