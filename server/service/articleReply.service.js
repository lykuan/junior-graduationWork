const articleReply = require("../models/articleReply.model.js");
const articleComment = require("../models/articleComment.model");
const mongoose = require("mongoose")

async function postReply(a_id, c_id, u_id, reply_c) {
//   const res = await articleReply.create(
//     {
//       article_id: a_id,
//       comment_id: c_id,
//       user_id: u_id,
//       replyContent: reply_c,
//     },
//     (err, doc) => {
//       //   console.log(doc);
//     }
//   );
//   const findRes = await articleReply.find({})

//   const result = await articleReply.aggregate([
//     {
//       $lookup: {
//         from: "users",
//         localField: "user_id",
//         foreignField: "_id",
//         as: "replyerInfo",
//       },
//     },
//   ]);
//   console.log(result)
const articleAll = await articleComment.find({})

    const articleAllInfo = articleComment.aggregate([
        
        {
            $match:{article_id:mongoose.Types.ObjectId(a_id)}
        },
        {
            $lookup:{
                from: "articlereplies",
                localField:"_id",
                foreignField:'comment_id',
                as: "replyInfo"
            }
        }
       
       
    ])

    console.log(articleAllInfo)
  return articleAllInfo
}

module.exports = {
  postReply,
};
