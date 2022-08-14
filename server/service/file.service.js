const avatar = require("../models/avatar.model");

class FileService {
  async createAvatar(filename, mimetype, u_id, size) {
    return await avatar.create({
      filename: filename,
      mimetype: mimetype,
      u_id,
      size,
    });
  }

  async findAvatarByUserId(userId) {
    const avatarDetail = await avatar.find({ u_id: userId });
    return avatarDetail[0];
  }

  async updateAvatar(userId, filename, mimetype, size) {
    const updateRes = await avatar.updateOne(
      { "u_id": userId },
      {
        $set: { "filename": filename,"mimetype": mimetype,"size": size  },
        
      }
    );
    return updateRes;
  }
}

module.exports = new FileService();
