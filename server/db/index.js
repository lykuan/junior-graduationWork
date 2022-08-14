const mongoose = require("mongoose");

const { DATABASE } = require("../app.config");

mongoose.connect(`mongodb://localhost:27017/graduation`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", (err) => {
  if (!err) console.log("数据库链接成功");
});

module.exports = db;
