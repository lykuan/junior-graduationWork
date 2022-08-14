const { encryptMd5 } = require("../utils/encryption");

async function encrypt(ctx, next) {
  const { pass: password } = ctx.request.body;

  ctx.request.body.pass = encryptMd5(password);
  await next();
}

module.exports = encrypt;
