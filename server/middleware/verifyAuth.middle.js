const JWT = require("jsonwebtoken");
const { Public_key } = require("../app.config");

async function verifyAuth(ctx, next) {
  try {
    const token = ctx.request.query.token
      ? ctx.request.query.token
      : ctx.request.headers.authorization;
    const { uId } = ctx.request.query;
    const res = JWT.verify(token, Public_key, {
      algorithms: ["RS256"],
    });
    let { id, username } = res;
    ctx.user = { id, username };
    await next();
  } catch (error) {
    console.log(error.message);
    ctx.body = { message: error.message, status: 403 };
    return;
  }
}

module.exports = verifyAuth;
