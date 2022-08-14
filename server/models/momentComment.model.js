const mongoose = require("mongoose");

const { Schema } = mongoose;

const MomentCommentSchema = new Schema(
  {
    moment_id: { type: Schema.Types.ObjectId, default: null },
    commenter: { type: Schema.Types.ObjectId, default: null },
    commentContent: String,
    commentLiked: [],
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

const momentComment = mongoose.model("momentComment", MomentCommentSchema);

module.exports = momentComment;
