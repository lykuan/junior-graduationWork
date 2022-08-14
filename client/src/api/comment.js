import { request } from "./request.js";

export async function likedComment(u_id, c_id) {
  return await request({
    url: `articleComment/giveLike`,
    method: "post",
    data: {
      u_id,
      c_id,
    },
  });
}

export async function getCommentLikes(a_id) {
  return await request({
    url: `articleComment/getLikes`,
    method: "get",
    params: {
      a_id,
    },
  });
}

export async function replyComment( c_id, u_id, replyContent) {
  return await request({
    url: `articleComment/reply`,
    method: "post",
    data: {
      c_id,
      u_id,
      replyContent,
    },
  });
}

export async function replyLiked(a_id, c_id, r_id, u_id) {
  return await request({
    url: `articleComment/replyLiked`,
    method: "post",
    data: {
      a_id,
      c_id,
      r_id,
      u_id,
    },
  });
}

export async function getReplys(a_id, c_id) {
  return await request({
    url: `articleComment/getReplys`,
    method: "get",
    params: {
      a_id,
      c_id,
    },
  });
}
