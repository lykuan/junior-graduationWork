import { request } from "./request";

export async function getArticles(skip) {
  return request({
    method: "get",
    url: `article/getArticles`,
    params: {
      limit: 1000,
      skip,
    },
  });
}

export async function getUsers() {
  return request({
    method: "get",
    url: `users/getUsers`,
  });
}

export async function getIssues() {
  return request({
    method: "get",
    url: `question/getIssues`,
  });
}

export async function adminLogin(data) {
  return request({
    method: "post",
    url: `users/adminLogin`,
    data,
  });
}

export async function deleteArticle(id) {
  return request({
    method: "post",
    url: `article/adminDelete`,
    data: {
      id,
    },
  });
}


export async function deleteUser(u_id) {
  return request({
    method: "post",
    url: `users/adminDelete`,
    data: {
      u_id,
    },
  });
}

export async function deleteIssue(q_id) {
  return request({
    method: "post",
    url: `question/deleteQuestion`,
    data: {
      q_id,
    },
  });
}