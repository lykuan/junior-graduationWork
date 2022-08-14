import { request } from "./request";

export async function postMoment(data, authorization) {
  return request({
    method: "post",
    url: "/moment/post",
    headers: {
      authorization,
    },
    data: data,
  });
}

export async function getMoments() {
  return request({
    method: "get",
    url: "/moment/getMoments",
    params: {
      limit: 0,
      skip: 0,
    },
  });
}

export async function likedMoment(u_id, authorization, m_id) {
  return request({
    method: "post",
    url: "/moment/likedMoment",
    headers: {
      authorization,
    },
    data: {
      u_id,
      m_id,
    },
  });
}

export async function deleteMoment(m_id) {
  return request({
    method: "post",
    url: "/moment/deleteMoment",
    data: {
      m_id,
    },
  });
}

export async function getMomentsByCircle(circle) {
  return request({
    method: "get",
    url: "/moment/getTagMoments",
    params: {
      circle,
    },
  });
}

export async function reviewMoment(m_id, u_id, content) {
  return request({
    method: "post",
    url: "/moment/reviewMoment",
    data: {
      m_id,
      u_id,
      content,
    },
  });
}

export async function getMomentComments(m_id) {
  return request({
    method: "get",
    url: "/moment/getMomentComments",
    params: {
      m_id,
    },
  });
}




