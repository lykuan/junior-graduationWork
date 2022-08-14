const mongoose = require("mongoose");

const { Schema } = mongoose;

const ArticleReplySchema = new Schema(
  {
    article_id: { type: Schema.Types.ObjectId, default: null },
    comment_id: { type: Schema.Types.ObjectId, default: null },
    user_id: { type: Schema.Types.ObjectId, default: null },
    userInfo: { type: Object, default: null },
    replyContent: String,
    replyLiked: {type:Array,default:[]},
    replied: {type:Array,default:[]},
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

const articleReply = mongoose.model("articleReply", ArticleReplySchema);

module.exports = articleReply;
