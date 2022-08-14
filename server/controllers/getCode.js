const { sendMail } = require("../utils/sendEmailCode");

class GetCode {
  async verifyCode(ctx, next) {
    const  email  = ctx.query[0];
    let code = Math.floor((Math.random() + Math.random() * 9) * 100000);
    
    const data = {};
    let p = new Promise((resolve, reject) => {
      sendMail(email, code, resolve);
    });
     data.message = await p;
    ctx.status = 200;
    ctx.body = data;
  }
}

module.exports = new GetCode();
