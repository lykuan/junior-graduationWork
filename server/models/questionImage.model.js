const mongoose = require("mongoose");

const { Schema } = mongoose;

const QuestionImageSchema = new Schema(
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

const questionImage = mongoose.model("questionImage", QuestionImageSchema);

module.exports = questionImage;
