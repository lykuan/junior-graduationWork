const Router = require("koa-router");
const {
  register,
  login,
  getUserInfo,
  avatarInfo,
  getUserLikedArticle,
  getUserPostArticles,
  updateInformation,
  handleUpdateUserProfile,
  handleFollowedUser,
  handleGetMyMoments,
  handleGetUserFollow,
  handleGetAllUsers,
  handleAdminLogin,
  handleUpdatePassword,
  handleAdminDeleteUser,
} = require("../controllers/users");
const { auth } = require("../controllers/auth");
const encrypt = require("../middleware/encryption.middle");
const verifyAuth = require("../middleware/verifyAuth.middle");

const usersRouter = new Router({ prefix: "/users" });

usersRouter.post("/register", encrypt, register);
usersRouter.post("/login", login, auth);
usersRouter.get("/:u_id/avatar", avatarInfo);
usersRouter.get("/userInfo", getUserInfo);
usersRouter.post("/article", verifyAuth);
usersRouter.get("/userLikedArticle", getUserLikedArticle);
usersRouter.get("/userPost", getUserPostArticles);
usersRouter.post("/updateProfile", updateInformation);
usersRouter.post("/updateUserProfile", handleUpdateUserProfile);
usersRouter.post("/followedUser", handleFollowedUser);
usersRouter.get("/getMyMoments", handleGetMyMoments);
usersRouter.get("/getUserFollow", handleGetUserFollow);
usersRouter.get("/getUsers", handleGetAllUsers);
usersRouter.post("/adminLogin", handleAdminLogin);
usersRouter.post("/updatePassword", encrypt, handleUpdatePassword);

usersRouter.post("/adminDelete", handleAdminDeleteUser);


module.exports = usersRouter;
