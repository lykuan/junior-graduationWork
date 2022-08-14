import { request } from "./request.js";

export async function registerUser(data) {
  return await request({
    url: "users/register",
    method: "post",
    data,
  });
}

export async function getCode(email) {
  return await request({
    url: "getcode",
    method: "get",
    params: email,
  });
}

export async function userLogin(users) {
  return await request({
    url: "users/login",
    method: "post",
    data: users,
  });
}

export async function usersInfo(uId) {
  return await request({
    url: "users/userInfo",
    method: "get",
    params: {
      uId,
    },
  });
}

export async function getUserAvatar(uId) {
  return await request({
    url: `users/${uId}/avatar`,
    method: "get",
    params: {
      u_id: uId,
    },
  });
}

export async function userlikedArticle(u_id) {
  return await request({
    url: `users/userlikedArticle`,
    method: "get",
    params: u_id,
  });
}

export async function getUserPost(u_id) {
  return await request({
    url: `users/userPost`,
    method: "get",
    params: u_id,
  });
}

export async function updateProfile(u_id, profileC) {
  return await request({
    url: `users/updateProfile`,
    method: "post",
    data: {
      u_id,
      profileC,
    },
  });
}

export async function updateUserProfile(u_id, profileData) {
  return await request({
    url: `users/updateUserProfile`,
    method: "post",
    data: {
      u_id,
      profileData,
    },
  });
}

export async function followedUser(user, followed) {
  return request({
    method: "post",
    url: "/users/followedUser",
    data: {
      user,
      followed,
    },
  });
}

export async function getMyMoments(u_id) {
  return request({
    method: "get",
    url: "/users/getMyMoments",
    params: {
      u_id,
    },
  });
}

export async function getUserFollow(u_id, follow) {
  return request({
    method: "get",
    url: "/users/getUserFollow",
    params: {
      u_id,
      follow,
    },
  });
}

export async function updatePassword(u_id,pass) {
  return request({
    method: "post",
    url: "/users/updatePassword",
    data: {
      u_id,
      pass
    },
  });
}


