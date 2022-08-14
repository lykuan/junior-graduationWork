import { request } from "./request.js";

export async function postQuestion(questionInfo) {
  return request({
    method: "post",
    url: "/question/postQuestion",
    data: questionInfo,
  });
}

export async function getQuestions(skip) {
  return request({
    method: "get",
    url: "/question/getQuestions",
    params: {
      limit: 15,
      skip: skip,
    },
  });
}

export async function submitQuestion(commentData) {
  return request({
    method: "post",
    url: "/question/submitQuestion",
    data: commentData,
  });
}

export async function deleteAnswer(q_id, c_id) {
  return request({
    method: "post",
    url: "/question/deleteAnswer",
    data: { q_id, c_id },
  });
}

export async function increaseWatched(q_id) {
  return request({
    method: "post",
    url: "/question/watchedQuestion",
    data: { q_id },
  });
}

export async function receivedAnswer(c_id, u_id) {
  return request({
    method: "post",
    url: "/question/receivedAnswer",
    data: { c_id, u_id },
  });
}

export async function likedQuestion(q_id, u_id) {
  return request({
    method: "post",
    url: "/question/likedQuestion",
    data: { q_id, u_id },
  });
}

export async function deleteQuestion(q_id) {
  return request({
    method: "post",
    url: "/question/deleteQuestion",
    data: { q_id },
  });
}

export async function findQuestion(channel) {
  return request({
    method: "get",
    url: "/question/findQuestion",
    params: { channel },
  });
}
