const Router = require("koa-router");

const {
  handlePostMoment,
  handleGetMoments,
  handleLikedMoment,
  handleDeleteMoment,
  handleGetTagMoments,
  handleReviewMoment,
  handleGetMomentComments,
  getMomentImages
} = require("../controllers/moment.js");
const momentRouter = new Router({ prefix: "/moment" });
const verifyAuth = require("../middleware/verifyAuth.middle");
momentRouter.post("/post", verifyAuth, handlePostMoment);
momentRouter.get("/getMoments", handleGetMoments);
momentRouter.post("/likedMoment", verifyAuth, handleLikedMoment);
momentRouter.post("/deleteMoment", handleDeleteMoment);
momentRouter.get("/getTagMoments",handleGetTagMoments)
momentRouter.post("/reviewMoment", handleReviewMoment);
momentRouter.get("/getMomentComments",handleGetMomentComments)
momentRouter.get("/momentImage",getMomentImages)





module.exports = momentRouter;
