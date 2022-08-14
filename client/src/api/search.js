import { request } from "./request";

export async function search(searchInfo, skip) {
  return request({
    method: "get",
    url: "/search",
    params: { searchInfo, limit: 15, skip },
  });
}
