const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  user: String,
  pwd: String,
});

const admin = mongoose.model("admin", adminSchema);

module.exports = admin;
