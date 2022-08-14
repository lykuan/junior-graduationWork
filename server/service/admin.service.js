const admin = require("../models/admin.model");

class adminService {
  async adminLogin(user, pwd) {
    const res = await admin.find({ user: user });
    if (res.length < 1) {
      return { message: "超级用户不存在" };
    } else {
      const [res] = await admin.find({ user });

      if (res.user == user && res.pwd == pwd) {
        return { message: "登录成功", user };
      } else {
        return { message: "密码错误" };
      }
    }
  }
}

module.exports = new adminService();
