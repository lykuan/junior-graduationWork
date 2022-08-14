const articleImage = require("../models/articleImage.model");
const article = require("../models/articles.model");
const articleCoverImage = require("../models/articleCoverImage.model");
const articleComment = require("../models/articleComment.model");
const users = require("../models/users.model");
const mongoose = require("mongoose");

async function createArticleImage(filename, mimetype, size, u_id) {
  var imageInfo = "";
  await articleImage.create(
    {
      filename: filename,
      mimetype: mimetype,
      size: size,
      u_id: u_id,
    },
    (err, doc) => {
      if (!err) {
        imageInfo = doc;
      }
    }
  );

  const imageData = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(imageInfo);
    }, 100);
  });
  return imageData;
}

async function createArticleCoverImage(filename, mimetype, size, u_id) {
  const res = await articleCoverImage.create({
    filename: filename,
    mimetype: mimetype,
    size: size,
    u_id: u_id,
  });
  return res;
}

async function findArticleImagesByUserId(f_id) {
  const articleImages = await articleImage.find({ _id: f_id });
  return articleImages;
}

async function findArticleCoverImage() {
  const articleCover = await articleCoverImage.find();
  return articleCover;
}

async function updateArticleCoverImageArticleId(uId, articleId) {
  const res = await articleCoverImage.find({ u_id: uId });
  res[res.length - 1].article_id = articleId;
  const doc = new articleCoverImage(res[res.length - 1]);
  return await doc.save();
}

async function getArticlesInfo(limit, skip) {
  const aggregate = article.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "author_id",
        foreignField: "_id",
        as: "articleUser",
      },
    },
    { $skip: skip },

    { $limit: limit },
  ]);

  const comments = await aggregate.lookup({
    from: "articlecomments",
    localField: "_id",
    foreignField: "article_id",
    as: "articleCommentNum",
  });

  return comments;
}

async function createArticle(u_id, userArticle) {
  let articleId = "";
  const isExist = await article.find({ _id: userArticle._id });
  if (isExist.length > 0) {
    console.log(userArticle)
    const res = await article.updateOne(
      { _id: userArticle._id },
      {
        article_title: userArticle.article_title,
        article_contentText: userArticle.article_contentText,
        article_contentHtml: userArticle.article_contentHtml,
        article_category: userArticle.article_category,
        article_coverUrl: userArticle.article_coverUrl,
        article_labels: userArticle.article_labels,
        updated: userArticle.updated,
      }
    );
    if(res.nModified==1){
      return true
    }
  } else {
    await article.create(
      {
        author_id: u_id,
        article_title: userArticle.title,
        article_contentText: userArticle.contentText,
        article_contentHtml: userArticle.contentHtml,
        article_category: userArticle.articleCategory,
        article_coverUrl: userArticle.articleCover,
        article_labels: userArticle.selectedLabel,
      },
      (err, doc) => {
        if (!err) {
          new Promise((resolve, reject) => {
            articleId = doc._id;
          });
        }
      }
    );
  }

  const res = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(articleId);
    }, 100);
  });
  return res;
}

async function findArticle() {
  const res = await article.find();
  return res;
}

async function pushLikedUser(articleId, uId) {
  const articleLikes = await article.find(
    { _id: articleId },
    { article_like: 1, _id: 0 }
  );
  const articleLiked = articleLikes[0].article_like;

  var flag = "";
  if (!articleLiked.includes(uId)) {
    const res = await article.updateOne(
      { _id: articleId },
      { $push: { article_like: uId } }
    );
    if (res) flag = true;
  } else {
    const res = await article.updateOne(
      { _id: articleId },
      { $pull: { article_like: { $in: [uId] } } }
    );
    if (res) {
      flag = false;
    }
  }
  if (flag == true || flag == false) {
    return flag;
  }
}

async function findArtilceById(articleId) {
  const articleLike = await article.find(
    { _id: articleId },
    { article_like: 1, _id: 0 }
  );
  return articleLike[0];
}

async function userArticles(u_id) {
  const postArticle = await article.aggregate([
    { $match: { author_id: mongoose.Types.ObjectId(u_id) } },
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
  ]);
  return postArticle;
}
async function removeArticle(a_id, u_id) {
  await article.deleteOne({ _id: a_id });

  const myArticles = await article.find({ author_id: u_id });
  return myArticles;
}

async function createArticleComment(a_id, u_id, u_info, a_content) {
  const res = await articleComment.create({
    article_id: a_id,
    "commentInfo.user": u_id,
    "commentInfo.commentContent": a_content,
  });
  const uData = await articleComment.find({});
  const comment = await articleComment.aggregate([
    { $match: { article_id: mongoose.Types.ObjectId(a_id) } },

    {
      $lookup: {
        from: "users",
        localField: "commentInfo.user",
        foreignField: "_id",
        as: "commenterInfo",
      },
    },
  ]);

  return comment[comment.length - 1];
}

async function getComments(a_id, limit, skip) {
  const commentData = await articleComment
    .find({ article_id: a_id })
    .skip(skip)
    .limit(limit);

  if (commentData.length == 0) {
    return [];
  } else {
    const commentAll = articleComment.aggregate([
      { $match: { article_id: mongoose.Types.ObjectId(a_id) } },
      {
        $lookup: {
          from: "users",
          localField: "commentInfo.user",
          foreignField: "_id",
          as: "commenterInfo",
        },
      },
      { $unwind: "$commentInfo.user" },
      {
        $lookup: {
          from: "users",
          localField: "commentInfo.reply.user",
          foreignField: "_id",
          as: "replyerInfo",
        },
      },
      {
        $group: {
          _id: "$_id",
          data: {
            $push: {
              article_id: "$article_id",
              commentInfo: "$commentInfo",
              createTime: "$createTime",
              commenterInfo: "$commenterInfo",
              replyerInfo: "$replyerInfo",
            },
          },
        },
      },
    ]);

    return commentAll;
  }
}

async function increaseView(a_id) {
  const res = await article.updateOne(
    { _id: a_id },
    { $inc: { article_watched: 1 } }
  );
}

async function adminDeleteArticle(a_id) {
  const res = await article.deleteOne({ _id: a_id });
  return res;
}

async function getAuthorAritcleInfo(u_id) {
  return await article.find({ author_id: u_id });
}



module.exports = {
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
  userArticles,
  removeArticle,
  createArticleComment,
  getComments,
  increaseView,
  adminDeleteArticle,
  getAuthorAritcleInfo,
};
