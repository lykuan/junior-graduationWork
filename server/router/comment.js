const Router = require("koa-router");
const {giveLike,replyComment} = require("../controllers/comment")

const commentRouter = new Router({prefix:"/articleComment"});



commentRouter.post("/giveLike",giveLike);
commentRouter.post("/reply",replyComment)



module.exports = commentRouter;