const crypto = require("crypto");
function encryptMd5(password) {
  const hash = crypto.createHash("md5");
  const newPassword = hash.update(password).digest("hex");
  return newPassword;
}

function decryptMd5(password) {
  const hash = crypto.createHash("md5");
  const newPassword = hash.update(password).digest("string");
  return newPassword;
}
module.exports = { encryptMd5, decryptMd5 };
