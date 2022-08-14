const fs = require("fs");
const path = require("path");
const {
  retainQuestionImage,
  retainQuestionCommentImage,
  getQuestionCommentImageInfo,
  getImageInfo,
  createQuestion,
  captureQuestions,
  escalateWatched,
  retainQuestionLike,
  removeQuestion,
  findQuestionByLabels,
  getAllIssues
} = require("../service/question.service");

const {
  createQuestionComment,
  removeAnswer,
  retainLike,
} = require("../service/questionComment.service");
class Question {
  async handleQuestionImage(ctx, next) {
    const { filename, mimetype, size } = ctx.req.file;
    const questionImageInfo = await retainQuestionImage(
      filename,
      mimetype,
      size
    );
    const url = `http://localhost:8888/question/questionImage?file=${questionImageInfo._id}`;
    ctx.response.set("content-type", "application/json");
    ctx.body = {
      data: {
        url,
      },
    };
  }

  async handleGetQuestionImage(ctx, next) {
    const file = ctx.query.file;
    const [imageData] = await getImageInfo(file);
    const p = path.join(
      __dirname,
      "../uploads/question/questionInner/" + imageData.filename
    );
    ctx.response.set("content-type", imageData.mimetype);
    ctx.body = fs.createReadStream(p);
  }

  async handlePostQuestion(ctx, next) {
    const questionInfo = ctx.request.body;
    const res = await createQuestion(questionInfo);
    res.questionData = res.questionData[0];
    console.log(res);

    ctx.body = res;
  }

  async handleGetQuestions(ctx, next) {
    let { limit, skip } = ctx.query;
    skip = parseInt(skip);
    limit = parseInt(limit);
    const data = await captureQuestions(limit, skip);
    ctx.body = data;
  }

  async handleQuestionCommentImage(ctx, next) {
    const { filename, mimetype, size } = ctx.req.file;
    const imageInfo = await retainQuestionCommentImage(
      filename,
      mimetype,
      size
    );
    const url = `http://localhost:8888/question/questionCommentImage?file=${imageInfo._id}`;
    ctx.body = {
      data: { url },
    };
  }

  async handleGetQuestionCommentImage(ctx, next) {
    const file = ctx.query.file;
    const [image] = await getQuestionCommentImageInfo(file);
    const p = path.join(
      __dirname,
      "../uploads/question/questionComment/" + image.filename
    );
    ctx.response.set("content-type", image.mimetype);
    ctx.body = fs.createReadStream(p);
  }

  async handleSubmitQuestion(ctx, next) {
    const commentData = ctx.request.body;
    const commentInfo = await createQuestionComment(commentData);
    ctx.body = commentInfo[commentInfo.length - 1];
  }

  async handleDeleteAnswer(ctx, next) {
    const { q_id, c_id } = ctx.request.body;
    const res = await removeAnswer(q_id, c_id);
    ctx.body = res;
  }

  async handleWatchedQuestion(ctx, next) {
    const { q_id } = ctx.request.body;
    await escalateWatched(q_id);
  }

  async handleReceivedAnswer(ctx, next) {
    const { c_id, u_id } = ctx.request.body;
    const data = await retainLike(c_id, u_id);
    const resolved = data.res.comment_resolved;
    ctx.body = {
      flag: data.flag,
      resolved,
    };
  }

  async handleLikedQuestion(ctx, next) {
    const { q_id, u_id } = ctx.request.body;
    ctx.body = await retainQuestionLike(q_id, u_id);
  }

  async handleDeleteQuestion(ctx, next) {
    const { q_id } = ctx.request.body;
    ctx.body = await removeQuestion(q_id);
  }

  async handleFindQuestion(ctx, next) {
    const { channel } = ctx.request.query;
    const res = await findQuestionByLabels(channel);
    ctx.body = res;
  }


  async handleGetIssues(ctx,next){
    ctx.body = await getAllIssues()
  }
}

module.exports = new Question();
