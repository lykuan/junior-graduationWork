const path = require("path");
const fs = require("fs");
const util = require("util");
const { encryptMd5 } = require("../utils/encryption");
const {
  create,
  findUser,
  findEamil,
  login,
  findUserInfo,
  getUserLiked,
  getUserPostedArticle,
  updateUserData,
  alterUserProfile,
  followedUser,
  captureUserFollow,
  retainAvatarURL,
  captureUsers,
  updatePassword,
  adminDeleteUser,
} = require("../service/users.service");

const { captureUserMoments } = require("../service/moment.service");
const { userArticles } = require("../service/article.service");

const { findAvatarByUserId } = require("../service/file.service");
const { adminLogin } = require("../service/admin.service");
class Users {
  //用户注册接口
  async register(ctx, next) {
    //从请求体里拿出我们填写的注册数据
    let { user: username, pass: password, email } = ctx.request.body;
    //从数据库中查询用户
    const users = await findUser();
    //通过数组的方法遍历来查看数据库中是否已经有了该用户，确保用户独一无二
    let userIsExist = users.some((item) => {
      return item.username == username;
    });
    //查询邮箱是否存在
    // const emails = await findEamil();
    // let emailIsExist = emails.some((item) => {
    //   return item.email == email;
    // });
    //通过逻辑判断如果两者都不存在则注册该用户,然后给客户端返回一个布尔值来表示用户注册成功是否
    if (!userIsExist) {
      const res = await create(username, password, email);
      ctx.body = true;
    } else {
      ctx.body = false;
    }
  }

  //用户登录接口
  async login(ctx, next) {
    //请求体拿出用户输入的用户名和密码
    let { username, password } = ctx.request.body;
    //判断有一项是否为空 为空就返回错误信息并终止函数
    if (!username || !password) {
      ctx.body = { message: "用户名或密码不能为空", empty: true };
      return;
    }
    //给密码加密处理不让明文显示
    password = encryptMd5(password);
    //通过正则判断用户输入的是否是邮箱
    const reg = /^\w+@(\w+)+\.(com|cn)$/i;
    let flag = reg.test(username);
    //如果是邮箱则会通过邮箱查询数据库里是否有该用户
    const res = await login(username, flag);
    //如果数组长度大于0则说明数据库里有数据表明该用户已经注册
    if (res.length > 0) {
      //通过flag的布尔值来控制是否用邮箱来匹配还是用户名来匹配
      let successLogin = flag
        ? res[0].email == username && password == res[0].password
        : res[0].username == username && password == res[0].password;
      //通过sucessLogin的布尔值来表示登录是否成功,并给客户端返回提示信息和登录成功的布尔值
      ctx.body = successLogin
        ? { message: "登录成功", login: true, data: res }
        : { message: "用户名或密码错误", login: false };

      if (successLogin) {
        ctx.user = res[0];
        await next();
      }
    } else {
      //查询结果不大于0说明用户没有注册
      ctx.body = { message: "用户名或邮箱不存在", isExist: false };
    }
  }

  async getUserInfo(ctx, next) {
    const { token, uId: u_id } = ctx.query;
    if (!u_id) return;
    const user = await findUserInfo(u_id);
    const avatar = await findAvatarByUserId(u_id);
    if (!avatar) {
      user.userInfo.avatarURL = "null";
      ctx.body = { data: user, status: 200 };
      return;
    }

    const newFilePath = `${
      avatar.filename.match(/[0-9]*/g)[0]
    }-small${path.extname(avatar.filename)}`;
    const avatarPath = path.resolve(
      __dirname,
      `../uploads/avatar/${newFilePath}`
    );
    const stat = util.promisify(fs.stat);
    const res = await stat(avatarPath)
      .then((val) => {})
      .catch((err) => {
        return true;
      });
    if (res) {
      user.userInfo.avatarURL = "null";
      ctx.body = { data: user, status: 200 };
    } else {
      ctx.body = { data: user, status: 200 };
    }
  }

  async avatarInfo(ctx, next) {
    let uId = ctx.params.u_id;
    const avatarAbout = await findAvatarByUserId(uId);

    if (!avatarAbout)
      return (ctx.body = {
        data: { avatarURL: "null", message: "请上传头像" },
      });

    const newFile = `${
      avatarAbout.filename.match(/[0-9]*/g)[0]
    }-small${path.extname(avatarAbout.filename)}`;

    const avatarUrl = `http://localhost:8888/users/${uId}/avatar`;
    //将图片路由保存到数据库中
    const avatar = await retainAvatarURL(avatarUrl, uId);
    const p = path.resolve(__dirname, `../uploads/avatar/${newFile}`);

    const stat = util.promisify(fs.stat);
    const res = await stat(p)
      .then((val) => {})
      .catch((err) => {
        return true;
      });
    if (res) ctx.body = { data: { avatarURL: "null", message: "请上传头像" } };
    else {
      const avatarContent = fs.createReadStream(p);
      ctx.response.set("content-type", avatarAbout.mimetype);
      ctx.body = avatarContent;
    }
  }

  async getUserLikedArticle(ctx, next) {
    const uId = ctx.query[0];
    const userLiked = await getUserLiked(uId);
    ctx.body = {
      data: {
        userLiked,
      },
    };
  }

  async getUserPostArticles(ctx, next) {
    const uId = ctx.query[0];
    const res = await userArticles(uId);
    ctx.body = res;
  }

  async updateInformation(ctx, next) {
    const { u_id, profileC } = ctx.request.body;
    const res = await updateUserData(u_id, profileC);
    if (res) {
      ctx.body = {
        modified: true,
        data: profileC,
      };
    } else {
      ctx.body = {
        modified: false,
      };
    }
  }

  async handleUpdateUserProfile(ctx, next) {
    const { u_id, profileData } = ctx.request.body;
    const res = await alterUserProfile(u_id, profileData);
    ctx.body = res;
  }

  async handleFollowedUser(ctx, next) {
    const { user, followed } = ctx.request.body;
    const res = await followedUser(user, followed);
    ctx.body = res;
  }

  async handleGetMyMoments(ctx, next) {
    const u_id = ctx.query.u_id;
    const userMoments = await captureUserMoments(u_id);
    ctx.body = userMoments;
  }

  async handleGetUserFollow(ctx, next) {
    const { u_id, follow } = ctx.query;
    const followsInfo = await captureUserFollow(u_id, follow);
    ctx.body = followsInfo;
  }

  async handleGetAllUsers(ctx, next) {
    ctx.body = await captureUsers();
  }

  async handleAdminLogin(ctx, next) {
    const { username, password } = ctx.request.body;
    const res = await adminLogin(username, password);

    ctx.body = res;
  }

  async handleUpdatePassword(ctx, next) {
    const { u_id, pass } = ctx.request.body;
    const res = await updatePassword(u_id, pass);
    if (res) {
      ctx.body = { message: "密码修改成功", success: res };
    } else {
      ctx.body = { message: "密码修改失败", success: res };
    }
  }

  async handleAdminDeleteUser(ctx, next) {
    const { u_id } = ctx.request.body;
    const res = await adminDeleteUser(u_id);
    ctx.body = res;
  }
}
module.exports = new Users();
