const articleComment = require("../models/articleComment.model");
const users = require("../models/users.model");

async function retainLike(u_id, c_id) {
  const isDuplicated = await articleComment.find({ _id: c_id });
  const likeContainer = isDuplicated[0].commentInfo.commentLiked;
  var flag;
  if (!likeContainer.includes(u_id)) {
    const res = await articleComment.updateOne(
      { _id: c_id },
      { $push: { "commentInfo.commentLiked": u_id } }
    );
    if (res) flag = true;
  } else {
    const res = await articleComment.updateOne(
      { _id: c_id },
      { $pull: { "commentInfo.commentLiked": u_id } }
    );
    if (res) flag = false;
  }
  if (flag == true || flag == false) {
    const res = await articleComment.find({ _id: c_id });
    const likes = res[0].commentInfo.commentLiked;

    return { flag, likes };
  }
}

async function retainReplyContent( c_id, data) {
  const res = await articleComment.updateOne(
    { _id: c_id },
    {
      $push: { "commentInfo.reply": data },
    }
  
  );
  const replys = await articleComment.find({ _id: c_id });
  for (let item of replys[0].commentInfo.reply) {
    const userInfo = await users.find({ _id: item.user });
    for (let i of userInfo) {
      let newUserInfo = {
        avatarURL: i.userInfo.avatarURL,
        position: i.userInfo.position,
        nickname: i.userInfo.nickname,
      };
      item.userInfo = newUserInfo;
    }
  }

  return replys[0].commentInfo.reply;
}

async function getReplyerInfo(arr) {
  const usersInfo = await users.find({});
  console.log(usersInfo.length,arr.length)

  for(let i of arr){
    usersInfo.forEach(j =>{
      if(j._id.toString()==i.commentInfo.reply.user.toString()){
        i.commentInfo.reply.userInfo = j.userInfo;
      }
    })
   
  }
  return arr;
  
}

module.exports = {
  retainLike,
  retainReplyContent,
  getReplyerInfo,
};
