const fs = require("fs");
const path = require("path");

const Private_key = fs.readFileSync(
  path.resolve(__dirname, "./keys/private.key")
);

const Public_key = fs.readFileSync(
  path.resolve(__dirname, "./keys/public.key")
);

module.exports = { APP_HOST, APP_PORT, DATABASE } = process.env;

module.exports.Public_key = Public_key;
module.exports.Private_key = Private_key;
