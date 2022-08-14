const path = require("path");
const fs = require("fs");

const multer = require("koa-multer");
const jimp = require("jimp");

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../uploads/avatar"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const articleInnerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../uploads/articles/innerImage"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const articleCoverStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../uploads/articles/coverImage"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const momentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../uploads/moment"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const questionStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../uploads/question/questionInner"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const questionCommentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../uploads/question/questionComment"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
});

const articleUpload = multer({
  storage: articleInnerStorage,
});

const articleCoverUpload = multer({
  storage: articleCoverStorage,
});

const momentUpload = multer({
  storage: momentStorage,
});

const questionUpload = multer({
  storage: questionStorage,
});
const questionCommentUpload = multer({
  storage: questionCommentStorage,
});

const avatarImageUpload = avatarUpload.single("avatar");
const articleInnerImageUpload = articleUpload.single("articleInner");
const articleCoverImageUpload = articleCoverUpload.single("articleCover");
const momentImageUpload = momentUpload.single("momentImage");
const questionImageUpload = questionUpload.single("questionImage");
const questionCommentImageUpload = questionCommentUpload.single(
  "questionCommentImage"
);

const imageArticleResize = async (ctx, next) => {
  const file = ctx.req.file;
  const reg = /[0-9]*/g;
  const filename = file.filename.match(reg)[0];
  const mediumImage = filename + "-medium" + path.extname(file.filename);
  const largeImage = filename + "-large" + path.extname(file.filename);
  const desPathMedium = path.join(file.destination, mediumImage);
  const desPathLarge = path.join(file.destination, largeImage);
  console.log(file.mimetype)

  if (file.mimetype != "image/webp") {
    const image = await jimp.read(file.path);
    image.resize(680, jimp.AUTO).write(desPathLarge);
    image.resize(320, jimp.AUTO).write(desPathMedium);
    fs.rm(file.path, (err, data) => {});
    await next();
  }else{
  
    await next();
  }

};

const imageAvatarResize = async (ctx, next) => {
  const file = ctx.req.file;
  const reg = /[0-9]*/g;
  const filename = file.filename.match(reg)[0];
  const smallImage = filename + "-small" + path.extname(file.filename);
  const desPathSmall = path.join(file.destination, smallImage);

  const image = await jimp.read(file.path);
  image.resize(320, 320).write(desPathSmall);
  fs.rm(file.path, (err, data) => {});
  await next();
};

const imageMomentResize = async (ctx, next) => {
  const file = ctx.req.file;
  const reg = /[0-9]*/g;
  const filename = file.filename.match(reg)[0];
  const largeImage = filename + path.extname(file.filename);
  const desPathLarge = path.join(file.destination, largeImage);

  const image = await jimp.read(file.path);
  image.resize(600, 600).write(desPathLarge);

  await next();
};

const imageQuestionCommentResize = async (ctx, next) => {
  const file = ctx.req.file;
  const reg = /[0-9]*/g;
  const filename = file.filename.match(reg)[0];
  const resizeFile = filename + path.extname(file.filename);
  const desPath = path.join(file.destination, resizeFile);

  if (file.mimetype != "image/webp") {
    const image = await jimp.read(file.path);
    image.resize(jimp.AUTO, 500).write(desPath);
    await next();
  }else{
    await next()
  }
};

module.exports = {
  avatarImageUpload,
  articleInnerImageUpload,
  articleCoverImageUpload,
  questionImageUpload,
  questionCommentImageUpload,
  imageArticleResize,
  imageAvatarResize,
  momentImageUpload,
  imageMomentResize,
  imageQuestionCommentResize,
};
