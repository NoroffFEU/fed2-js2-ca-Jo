import { API_BASE, API_KEY, ACCESS_TOKEN } from "../../api/constants";
export async function getPostsAPI() {
  const response = await fetch(`${API_BASE}/social/posts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });
  const data = await response.json();
  return data;
}
export async function getPostByIdAPI(postId) {
  const response = await fetch(`${API_BASE}/social/posts/${postId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });
  const data = await response.json();
  return data;
}
