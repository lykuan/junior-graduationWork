const mongoose = require("mongoose");

const { Schema } = mongoose;

const momentSchema = new Schema(
  {
    momenter: { type: Schema.Types.ObjectId, default: null },
    content: String,
    momentLiked: [],
    momentImage: [],
    replyInfo: [
      {
        replyer: { type: Schema.Types.ObjectId, default: null },
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
    circle: String,
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

const moment = mongoose.model("moment", momentSchema);

module.exports = moment;
