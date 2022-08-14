const Koa = require("koa");
require("./db/index");
const parser = require("koa-bodyparser");
const cors = require("koa2-cors");

const usersRouter = require("./router/users");
const getCodeRouter = require("./router/getCode");
const uploadRouter = require("./router/fileUpload");
const articleRouter = require("./router/article");
const commentRouter = require("./router/comment")
const momentRouter = require("./router/moment")
const questionRouter = require('./router/question');
const searchRouter = require('./router/search')

const app = new Koa();

app.use(cors());
app.use(parser());

app.use(getCodeRouter.routes());
app.use(getCodeRouter.allowedMethods());
app.use(usersRouter.routes());
app.use(usersRouter.allowedMethods());

app.use(uploadRouter.routes());
app.use(uploadRouter.allowedMethods());

app.use(articleRouter.routes())
app.use(articleRouter.allowedMethods())

app.use(commentRouter.routes());
app.use(commentRouter.allowedMethods())

app.use(momentRouter.routes());
app.use(momentRouter.allowedMethods());

app.use(questionRouter.routes())
app.use(questionRouter.allowedMethods())

app.use(searchRouter.routes())
app.use(searchRouter.allowedMethods())

app.listen(8888, () => {
  console.log("服务器启动成功");
});
