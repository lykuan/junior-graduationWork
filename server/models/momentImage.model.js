const mongoose = require("mongoose");

const { Schema } = mongoose;

const MomentImageSchema = new Schema(
  {
    filename: { type: String},
    mimetype: String,
    m_id: { type: Schema.Types.ObjectId ,trim:true},
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

const momentImage = mongoose.model("momentImage", MomentImageSchema);

module.exports = momentImage;
