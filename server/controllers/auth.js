const JWT = require("jsonwebtoken");

const { Private_key } = require("../app.config");
const { findUserInfo } = require("../service/users.service");
const {decryptMd5} = require('../utils/encryption')
class Auth {
  async auth(ctx, next) {
    let { _id: id, username } = ctx.user;
    let user = { id, username };
    console.log(user)
    //给用户颁发token
    const token = JWT.sign(user, Private_key, {
      algorithm: "RS256",
      expiresIn: 60 * 60 * 24 * 15,
    });
    if (token) {
      const {password, userInfo } = await findUserInfo(id);
      
      ctx.body = {
        message: "登录成功",
        status:200,
        login:true,
        username,
        password,
        id,
        token,
        userInfo,
      };
    }
  }
}

module.exports = new Auth();
