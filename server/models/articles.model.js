const mongoose = require("mongoose");

const { Schema } = mongoose;

const ArticleSchema = new Schema(
  {
    author_id: mongoose.SchemaTypes.ObjectId,
    article_title: String,
    article_contentText: String,
    article_contentHtml:String,
    article_labels:{type:Array,default:[]},
    article_category:{type:String,default:""},
    article_coverUrl:{type:String,default:""},
    article_image:{type:Array,default:[]},
    article_watched: { type: Number, default: 0 },
    article_like: [],
    article_favorite: { type: Array, default: [] },
    article_comment: {
      type:Array,
      default:[],
      users:{
        id:mongoose.SchemaTypes.ObjectId,
        comment_content:{type:Array,default:[]}
      }
    },
    createTime: {
      type: Date,
      default: Date.now,
    },
    updateTime: {
      type: Date,
      default: Date.now,
    },
    updated: Boolean
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
  }
);

const article = mongoose.model("article", ArticleSchema);

module.exports = article;
