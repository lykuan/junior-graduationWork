const {
  retainLike,
  retainReplyContent,
} = require("../service/comment.service");
const { postReply } = require("../service/articleReply.service");

class CommentService {
  async giveLike(ctx, next) {
    const { u_id, c_id } = ctx.request.body;
    const res = await retainLike(u_id, c_id);
    ctx.body = res;
  }

  async replyComment(ctx, next) {
    const {  c_id, u_id:user, replyContent } = ctx.request.body;
    const objData = {
      user,
      replyContent,
    };
    const res = await retainReplyContent( c_id, objData);
    //  const res = await postReply(a_id,c_id,u_id,replyContent)
     console.log(res)
    ctx.body = res;
  }
}

module.exports = new CommentService();
