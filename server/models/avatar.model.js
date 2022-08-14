const mongoose = require("mongoose");

const { Schema } = mongoose;

const AvatarSchema = new Schema(
  {
    filename: { type: String},
    mimetype: String,
    u_id: { type: Schema.Types.ObjectId ,trim:true},
    size: Number,
    createTime: {
      type: Date,
      default: Date.now,
    },
    updateTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
  }
);

const avatar = mongoose.model("avatar", AvatarSchema);

module.exports = avatar;
