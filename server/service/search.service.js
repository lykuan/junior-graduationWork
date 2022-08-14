const article = require("../models/articles.model.js");
const users = require("../models/users.model");
const question = require("../models/question.model");
class SearchService {
  async findArticles(search, limit, skip) {
    console.log(search)
    const searchReg = new RegExp(`^${search}$`, "i");

    const res = await article.aggregate([
      {
        $match: {
          $or: [
            { article_title: { $regex: searchReg } },
            { article_contentText: { $regex: searchReg } },
            { article_labels: { $in: [search] } },
          ],
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "author_id",
          foreignField: "_id",
          as: "articleUser",
        },
      },

      {
        $lookup: {
          from: "articlecomments",
          localField: "_id",
          foreignField: "article_id",
          as: "articleCommentNum",
        },
      },

      { $skip: skip },
      { $limit: limit },
    ]);
    console.log(res)
    return res;
  }

  async findUsers(search, limit, skip) {
    const searchReg = new RegExp(`^${search}$`, "i");

    const res = await users
      .find({
        "userInfo.nickname": { $regex: searchReg },
      })
      .skip(skip)
      .limit(limit);
    return res;
  }

  async findQuestions(search, limit, skip) {
    const searchReg = new RegExp(`^${search}$`, "i");

    const res = question.aggregate([
      {
        $match: {
          $or: [
            { quetion_title: { $regex: searchReg } },
            { question_contentHtml: { $regex: searchReg } },
            { question_labels: { $in: [searchReg] } },
          ],
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "questioner",
          foreignField: "_id",
          as: "questionerInfo",
        },
      },

      {
        $lookup: {
          from: "questioncomments",
          localField: "_id",
          foreignField: "question_id",
          as: "questionCommentList",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "questionCommentList.comment_user",
          foreignField: "_id",
          as: "commenterInfo",
        },
      },
      { $limit: limit },
      { $skip: skip },
    ]);
    return res;
  }
}

module.exports = new SearchService();
