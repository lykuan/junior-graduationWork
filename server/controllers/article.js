const fs = require("fs");
const path = require("path");
const {
  createArticleImage,
  createArticleCoverImage,
  findArticleImagesByUserId,
  findArticleCoverImage,
  findArticle,
  createArticle,
  updateArticleCoverImageArticleId,
  getArticlesInfo,
  pushLikedUser,
  findArtilceById,
  removeArticle,
  createArticleComment,
  getComments,
  increaseView,
  adminDeleteArticle,
  getAuthorAritcleInfo,
  retainFollower,
} = require("../service/article.service");

const {
  userLikedArticle,
  postedArticle,
  getUserPostedArticle,
} = require("../service/users.service");
const { getReplyerInfo } = require("../service/comment.service");
class Article {
  async handleArticleImage(ctx, next) {
    const userId = ctx.headers.u_id;
    const imageSize = ctx.headers.size;
    const { filename, mimetype, size } = ctx.req.file;
    const imageInfo = await createArticleImage(
      filename,
      mimetype,
      size,
      userId
    );
    const url = `http://localhost:8888/article/articleImage?file=${imageInfo._id}&size=${imageSize}`;

    ctx.response.set("content-type", "application/json");
    ctx.body = {
      data: { url },
    };
  }

  async getArticleImage(ctx, next) {
    const f_id = ctx.request.query.file;

    const size = ctx.request.query.size;
    const [res] = await findArticleImagesByUserId(f_id);
    const { mimetype } = res;
    if (res.mimetype != "image/webp") {
      let newFilename =
        res.filename.match(/\d+/g)[0] + "-" + size + path.extname(res.filename);
      const p = path.join(
        __dirname,
        `../uploads/articles/innerImage/${newFilename}`
      );
      ctx.response.set("content-type", mimetype);

      ctx.body = fs.createReadStream(p);
    } else {
      let newFilename = res.filename;
      const p = path.join(
        __dirname,
        `../uploads/articles/innerImage/${newFilename}`
      );
      ctx.response.set("content-type", mimetype);

      ctx.body = fs.createReadStream(p);
    }
  }

  async postArticle(ctx, next) {
    const u_id = ctx.user.id;
    const articleInfo = ctx.request.body;
    console.log(articleInfo);
    const res = await createArticle(u_id, articleInfo);
    await postedArticle(u_id, res);
    if (res != true) {
      ctx.body = { postSuccess: true, message: "文章发布成功" };
      const res = await findArticle();
      const article_id = res[res.length - 1]._id;
      await updateArticleCoverImageArticleId(u_id, article_id);
    } else if (res == true) {
      ctx.body = { postSuccess: true, message: "文章更新成功" };
    } else ctx.body = { postSuccess: false, message: "文章发布失败" };

    const result = await getUserPostedArticle(u_id);
  }

  async handleArticleCoverImage(ctx, next) {
    const { filename, mimetype, size } = ctx.req.file;
    const res = await createArticleCoverImage(filename, mimetype, size);
    ctx.status = 200;
    let articleCoverUrl =
      "http://localhost:8888/article/getArticleCover?random=" + filename;
    ctx.body = {
      message: "封面上传成功",
      status: ctx.status,
      articleCoverUrl,
    };
  }

  async getArticleCoverImage(ctx, next) {
    const filesReg = /[0-9]*\.(png|jpg|jpeg|webp)/g;
    const mimetypeReg = /(png|jpeg|vif|jpg|webp)/g;
    console.log(ctx.request.url);
    const fileMimetype = ctx.request.url.match(mimetypeReg)[0];
    const coverFiles = ctx.request.url.match(filesReg)[0];

    const p = path.resolve(
      __dirname,
      "../uploads/articles/coverImage/" + coverFiles
    );
    ctx.response.set("content-type", fileMimetype);
    ctx.body = fs.createReadStream(p);
  }

  async getAllArticles(ctx, next) {
    let { limit, skip } = ctx.query;
    skip = parseInt(skip);
    limit = parseInt(limit);
    const res = await getArticlesInfo(limit, skip);
    ctx.body = {
      data: res,
    };
  }

  async likedArticle(ctx, next) {
    const { article_id, u_id } = ctx.request.body;

    const liked = await pushLikedUser(article_id, u_id);

    const articleLiked = await findArtilceById(article_id);
    let articleLikeNum = articleLiked.article_like;
    const userLikes = await userLikedArticle(liked, u_id, article_id);
    ctx.status = 200;
    ctx.body = {
      article_id,
      articleLikeNum,
      userLikes,
      liked,
      status: ctx.status,
    };
  }

  async deleteArticle(ctx, next) {
    const { article_id, u_id } = ctx.request.body;
    const res = await removeArticle(article_id, u_id);
    if (res) {
      ctx.body = {
        myArticles: res,
        success: true,
      };
    }
  }
  async postArticleComment(ctx, next) {
    const { article_id, u_id, u_info, commentContent } = ctx.request.body;
    const res = await createArticleComment(
      article_id,
      u_id,
      u_info,
      commentContent
    );
    ctx.body = {
      success: true,
      commentData: res,
    };
  }

  async getArticleComment(ctx, next) {
    let { article_id, limit, skip } = ctx.query;
    await increaseView(article_id);
    limit = Number.parseInt(limit);
    skip = Number.parseInt(skip);
    const res = await getComments(article_id, limit, skip);
    console.log(res);
    ctx.body = {
      commentData: res,
    };
  }

  async handleDeleteArticle(ctx, next) {
    const a_id = ctx.request.body.id;
    const res = await adminDeleteArticle(a_id);
    ctx.body = res;
  }

  async getAuthorInfo(ctx, next) {
    const { u_id } = ctx.query;
    ctx.body = await getAuthorAritcleInfo(u_id);
  }

  
}

module.exports = new Article();
