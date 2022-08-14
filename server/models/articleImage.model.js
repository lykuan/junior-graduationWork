const mongoose = require("mongoose");

const { Schema } = mongoose;

const ArticleImageSchema = new Schema(
  {
    filename: { type: String},
    mimetype: String,
    article_id: { type: Schema.Types.ObjectId ,default:null},
    size: Number,
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

const articleImage= mongoose.model("articleImage", ArticleImageSchema);

module.exports = articleImage;
