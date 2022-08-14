const Router = require("koa-router");
const {
  questionImageUpload,
  questionCommentImageUpload,
  imageQuestionCommentResize
} = require("../middleware/file.middle");
const {
  handleQuestionImage,
  handleGetQuestionImage,
  handleQuestionCommentImage,
  handleGetQuestionCommentImage,
  handlePostQuestion,
  handleGetQuestions,
  handleSubmitQuestion,
  handleDeleteAnswer,
  handleWatchedQuestion,
  handleReceivedAnswer,
  handleLikedQuestion,
  handleDeleteQuestion,
  handleFindQuestion,
  handleGetIssues
} = require("../controllers/question");
const verifyAuth = require("../middleware/verifyAuth.middle");
const questionRouter = new Router({ prefix: "/question" });

questionRouter.post(
  "/post",
  verifyAuth,
  questionImageUpload,
  handleQuestionImage
);
questionRouter.get("/questionImage", handleGetQuestionImage);

questionRouter.post("/postQuestion", handlePostQuestion);
questionRouter.get("/getQuestions", handleGetQuestions);

questionRouter.post(
  "/questionComment",
  verifyAuth,
  questionCommentImageUpload,
  imageQuestionCommentResize,
  handleQuestionCommentImage
);
questionRouter.get("/QuestionCommentImage", handleGetQuestionCommentImage);
questionRouter.get("/findQuestion", handleFindQuestion);

questionRouter.post("/submitQuestion", handleSubmitQuestion);
questionRouter.post("/deleteAnswer", handleDeleteAnswer)
questionRouter.post("/watchedQuestion", handleWatchedQuestion)
questionRouter.post("/receivedAnswer", handleReceivedAnswer)
questionRouter.post("/likedQuestion", handleLikedQuestion)
questionRouter.post("/deleteQuestion", handleDeleteQuestion)

questionRouter.get("/getIssues", handleGetIssues);







module.exports = questionRouter;
