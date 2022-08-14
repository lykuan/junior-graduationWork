const momentImage = require("../models/momentImage.model");
class MomentImageService {
  async retainMomentImageInfo(filename, mimetype, size) {
    var imageInfo = "";
    await momentImage.create(
      {
        filename: filename,
        mimetype: mimetype,
        size: size,
      },
      (err, doc) => {
        if (!err) {
          imageInfo = doc;
        }
      }
    );
    const res = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(imageInfo);
      }, 20);
    });
    return res;
  }


  async getMomentImageInfo(img_id){
      return await momentImage.find({'_id':img_id})
  }
}

module.exports = new MomentImageService();
