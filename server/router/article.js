const Router = require("koa-router");
const verifyAuth = require("../middleware/verifyAuth.middle");
const {
  handleArticleImage,
  handleArticleCoverImage,
  getArticleImage,
  getArticleCoverImage,
  getAllArticles,
  postArticle,
  likedArticle,
  deleteArticle,
  postArticleComment,
  getArticleComment,
  handleDeleteArticle,
  getAuthorInfo,

} = require("../controllers/article");
const {
  articleInnerImageUpload,
  articleCoverImageUpload,
  imageArticleResize,
} = require("../middleware/file.middle");
const filterTabooWords = require("../middleware/filterTabooWords")

const articleRouter = new Router({ prefix: "/article" });

articleRouter.post(
  "/post",
  verifyAuth,
  articleInnerImageUpload,
  imageArticleResize,
  handleArticleImage
);
articleRouter.get("/articleImage", getArticleImage);
articleRouter.post("/:u_id/postArticle", verifyAuth,filterTabooWords,postArticle);
articleRouter.post(
  "/articleCover",
  articleCoverImageUpload,
  handleArticleCoverImage
);
articleRouter.get("/getArticleCover", getArticleCoverImage);
articleRouter.get("/getArticles", getAllArticles);
articleRouter.post("/likedArticle", likedArticle);
articleRouter.post("/delete", verifyAuth,deleteArticle);
articleRouter.post("/comment",postArticleComment);
articleRouter.get("/getArticleComment", getArticleComment);
articleRouter.post("/adminDelete", handleDeleteArticle);
articleRouter.get("/getAuthorInfo", getAuthorInfo);





module.exports = articleRouter;
