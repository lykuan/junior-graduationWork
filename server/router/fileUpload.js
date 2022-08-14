const Router = require("koa-router");
const { handleImage, handleMomentImage } = require("../controllers/fileHandle");
const {
  avatarImageUpload,
  imageAvatarResize,
  momentImageUpload,
  imageMomentResize
} = require("../middleware/file.middle");
const verifyAuth = require("../middleware/verifyAuth.middle");

const uploadRouter = new Router({ prefix: "/uploads" });

uploadRouter.post(
  "/avatar",
  verifyAuth,
  avatarImageUpload,
  imageAvatarResize,
  handleImage
);
uploadRouter.post(
  "/momentImage",
  verifyAuth,
  momentImageUpload,
  imageMomentResize,
  handleMomentImage
);

module.exports = uploadRouter;
