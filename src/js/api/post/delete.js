import { API_BASE, API_KEY, ACCESS_TOKEN } from "../../api/constants";
export async function deletePostAPI(id) {
  const response = await fetch(`${API_BASE}/social/posts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json", 
      "X-Noroff-API-Key": API_KEY, 
      Authorization: `Bearer ${ACCESS_TOKEN}`, 
    },
  });
  const data = await response.json();
  return data;
}
