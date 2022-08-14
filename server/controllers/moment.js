const fs = require("fs");
const path = require("path");
const {
  createMoment,
  findMoments,
  retainLike,
  removeMoment,
  getMomentsByCircle,
  reviewMoment,
  captureMomentComments,
} = require("../service/moment.service");

const { followedMomenter } = require("../service/users.service");
const { getMomentImageInfo } = require("../service/momentImage.service");

class momentService {
  async handlePostMoment(ctx, next) {
    const { userId, circle, content ,image} = ctx.request.body;
    const res = await createMoment(userId, content, circle,image);
    ctx.body = {
      data: res,
      success: true,
    };
  }

  async handleGetMoments(ctx, next) {
    const res = await findMoments();
    ctx.body = res;
  }

  async handleLikedMoment(ctx, next) {
    const { u_id, m_id } = ctx.request.body;
    const res = await retainLike(u_id, m_id);
    ctx.body = {
      momentLikes: res,
    };
  }

  async handleDeleteMoment(ctx, next) {
    const { m_id } = ctx.request.body;
    const res = await removeMoment(m_id);
    ctx.body = res;
  }

  async handleGetTagMoments(ctx, next) {
    const circle = ctx.query.circle;
    const res = await getMomentsByCircle(circle);
    ctx.body = res;
  }

  async handleReviewMoment(ctx, next) {
    const { m_id, u_id, content } = ctx.request.body;
    const res = await reviewMoment(m_id, u_id, content);
    ctx.body = res[res.length - 1];
  }

  async handleGetMomentComments(ctx, next) {
    const m_id = ctx.query.m_id;
    const data = await captureMomentComments(m_id);
    ctx.body = data;
  }

  async getMomentImages(ctx, next) {
    const img_id = ctx.query.file;
    const [imgInfo] = await getMomentImageInfo(img_id);
    const { filename, mimetype } = imgInfo;
    const p = path.join(__dirname, `../uploads/moment/${filename}`);
    const imgContent = fs.createReadStream(p);
    ctx.response.set("content-type", mimetype);
    ctx.body = imgContent;
  }
}

module.exports = new momentService();
