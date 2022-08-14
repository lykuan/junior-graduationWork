const mongoose = require("mongoose");

const { Schema } = mongoose;

const QuestionSchema = new Schema(
  {
    questioner: mongoose.Schema.Types.ObjectId,
    question_title: String,
    question_contentText: String,
    question_contentHtml:String,
    question_labels:{type:Array,default:[]},
    question_watched: { type: Number, default: 0 },
    question_like: [],
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

const question = mongoose.model("question", QuestionSchema);

module.exports = question;
