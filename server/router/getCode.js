const Router = require("koa-router");
const { verifyCode } = require("../controllers/getCode");

const getCodeRouter = new Router({ prefix: "/getcode" });

getCodeRouter.get("/", verifyCode);

module.exports = getCodeRouter;
