const { retainMomentImageInfo } = require("../service/momentImage.service");

const {
  createAvatar,
  findAvatarByUserId,
  updateAvatar,
} = require("../service/file.service");

async function handleImage(ctx, next) {
  const { filename, mimetype, size } = ctx.req.file;
  let u_id = ctx.user.id;
  const avatarExist = await findAvatarByUserId(u_id);
  if (avatarExist) {
    const res = await updateAvatar(u_id, filename, mimetype, size);
    ctx.body = u_id;
    return;
  }
  //将图像信息保存到数据库中
  const res = await createAvatar(filename, mimetype, u_id, size);
  ctx.body = res.u_id;
}

async function handleMomentImage(ctx, next) {
  const { filename, mimetype, size } = ctx.req.file;
  const res = await retainMomentImageInfo(filename, mimetype, size);
  const imageUrl = `http://localhost:8888/moment/momentImage/?file=${res._id}`;
  ctx.body = imageUrl;
}

module.exports = { handleImage, handleMomentImage };
