const mongoose = require("mongoose");

const questionComment = require("../models/questionComment.model");

class QuestionCommentService {
  async createQuestionComment(commentData) {
    const res = await questionComment.create({
      question_id: commentData.q_id,
      comment_user: commentData.user,
      comment_content: commentData.content,
    });
    if (res) {
      return questionComment.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "comment_user",
            foreignField: "_id",
            as: "commenterInfo",
          },
        },
      ]);
    }
  }

  async captureQuestionComments() {
    return questionComment.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "comment_user",
          foreignField: "_id",
          as: "commenterInfo",
        },
      },
    ]);
  }

  async removeAnswer(q_id, c_id) {
    const res = await questionComment.deleteOne({
      question_id: q_id,
      _id: c_id,
    });
    if (res.deletedCount > 0) {
      return questionComment.aggregate([
        { $match: { question_id: mongoose.Types.ObjectId(q_id) } },
        {
          $lookup: {
            from: "users",
            localField: "comment_user",
            foreignField: "_id",
            as: "commenterInfo",
          },
        },
      ]);
    }
  }

  async retainLike(c_id, u_id) {
    const [res] = await questionComment.find({ _id: c_id });
    let flag;
    if (!res.comment_resolved.includes(u_id)) {
      await questionComment.updateOne(
        { _id: c_id },
        { $push: { comment_resolved: u_id } }
      );
      const [res] = await questionComment.find({ _id: c_id });
      flag = true;
      return { flag, res };
    } else {
      await questionComment.updateOne(
        { _id: c_id },
        { $pull: { comment_resolved: u_id } }
      );
      flag = false;
      const [res] = await questionComment.find({ _id: c_id });
      return { flag, res };
    }
  }
}

module.exports = new QuestionCommentService();
