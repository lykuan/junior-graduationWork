const mongoose = require("mongoose");

const { Schema } = mongoose;

const ArticleCoverImageSchema = new Schema(
  {
    filename: { type: String},
    mimetype: String,
    size: Number,
    article_id: { type: Schema.Types.ObjectId ,default:null},
    u_id:{ type: Schema.Types.ObjectId },
    createTime: {
      type: Date,
      default: Date.now,
    },
    updateTime: {
      type: Date,
      default: Date.now
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
  }
);

const articleCoverImage= mongoose.model("articleCoverImage", ArticleCoverImageSchema);

module.exports = articleCoverImage;
