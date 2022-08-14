import { request } from "./request.js";

export async function postArticleImage(file, token) {
  return await request({
    url: `uploads/articleImage`,
    method: "post",
    data: file,
    headers: {
      authorization: token,
    },
  });
}

export async function postArticle(articleContent, u_id, token) {
  return await request({
    url: `article/${u_id}/postArticle`,
    method: "post",
    data: articleContent,
    headers: {
      authorization: token,
    },
  });
}

export async function getArticles(skip) {
  return await request({
    url: `article/getArticles`,
    method: "get",
    params: {
      limit: 15,
      skip: skip,
    },
  });
}

export async function likedArticle(article_id, u_id) {
  return await request({
    url: `article/likedArticle`,
    method: "post",
    data: {
      article_id,
      u_id,
    },
  });
}

export async function deleteArticle(article_id, authorization, u_id) {
  return await request({
    url: `article/delete`,
    method: "post",
    headers: {
      authorization,
    },
    data: {
      article_id,
      u_id,
    },
  });
}

export async function articleComment(article_id, u_id, u_info, commentContent) {
  return await request({
    url: `article/comment`,
    method: "post",
    data: {
      article_id,
      u_id,
      u_info,
      commentContent,
    },
  });
}

export async function getArticleComment(article_id, skip) {
  return await request({
    url: `article/getArticleComment`,
    method: "get",
    params: { article_id, limit: 3, skip },
  });
}

export async function getAuthorInfo(u_id) {
  return await request({
    url: `article/getAuthorInfo`,
    method: "get",
    params: { u_id },
  });
}


export async function updateArticle(data){
  return await request({
    url: 'article/updateArticle',
    method: "post",
    data
  })
}



