const mongoose = require("mongoose");

const questionImage = require("../models/questionImage.model");
const question = require("../models/question.model");
const questionCommentImage = require("../models/questionCommentImage.model");
class questionService {
  async retainQuestionImage(filename, mimetype, size) {
    let imageInfo;
    questionImage.create(
      {
        filename: filename,
        mimetype,
        size,
      },
      (err, doc) => {
        if (!err) {
          imageInfo = doc;
        }
      }
    );
    const res = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(imageInfo);
      }, 20);
    });
    return res;
  }

  async getImageInfo(f_id) {
    return await questionImage.find({ _id: f_id });
  }

  async createQuestion(data) {
    const res = await question.find({ _id: data._id });
    if (res.length > 0) {
      await question.updateOne(
        { _id: data._id },
        {
          question_contentHtml: data.content_html,
          question_title: data.question_title,
          question_labels: data.question_labels,
          question_contentText: data.content_text,
        }
      );
      const questionData = await question.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(data._id) } },
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
      ]);
      return {
        questionData,
        action: "edit",
      };
    } else {
      let questionInfo;
      await question.create(
        {
          questioner: data.user,
          question_title: data.question_title,
          question_contentHtml: data.content_html,
          question_contentText: data.content_text,
          question_labels: data.question_labels,
        },
        (err, doc) => {
          if (!err) {
            questionInfo = question.aggregate([
              { $match: { _id: mongoose.Types.ObjectId(doc._id) } },
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
            ]);
          }
        }
      );
      const questionData = await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(questionInfo);
        }, 20);
      });
      return { questionData, action: "post" };
    }
  }

  async captureQuestions(limit, skip) {
    const data = question.aggregate([
      { $limit: limit },

      { $skip: skip },
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
    ]);
    return data;
  }

  async retainQuestionCommentImage(filename, mimetype, size) {
    let questionCommentImageData;
    await questionCommentImage.create(
      {
        filename,
        mimetype,
        size,
      },
      (err, doc) => {
        if (!err) {
          questionCommentImageData = doc;
        }
      }
    );

    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(questionCommentImageData);
      }, 100);
    });
  }

  async getQuestionCommentImageInfo(f_id) {
    return questionCommentImage.find({ _id: f_id });
  }

  async escalateWatched(q_id) {
    await question.updateOne({ _id: q_id }, { $inc: { question_watched: 1 } });
  }

  async retainQuestionLike(q_id, u_id) {
    const [data] = await question.find({ _id: q_id });
    if (!data.question_like.includes(u_id)) {
      let flag;
      await question.updateOne(
        { _id: q_id },
        { $push: { question_like: u_id } }
      );
      flag = true;
      const [data] = await question.find({ _id: q_id });
      const likes = data.question_like;
      return { flag, likes };
    } else {
      let flag;
      await question.updateOne(
        { _id: q_id },
        { $pull: { question_like: u_id } }
      );
      flag = false;
      const [data] = await question.find({ _id: q_id });
      const likes = data.question_like;
      return { flag, likes };
    }
  }

  async removeQuestion(q_id) {
    const res = await question.deleteOne({ _id: q_id });
    return res;
  }

  async findQuestionByLabels(channel) {
    return question.aggregate([
      { $match: { question_labels: { $in: [channel] } } },
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
    ]);
  }

  async getAllIssues() {
    return question.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "questioner",
          foreignField: "_id",
          as: "questionerInfo",
        },
      },
    ]);
  }
}

module.exports = new questionService();
