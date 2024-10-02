import { API_BASE, API_KEY } from "../../api/constants";

export async function updatePostAPI(
  id,
  { title, body, tags, media = { url: "", alt: "" } }
) {
  const numericId = Number(id);

  if (isNaN(numericId)) {
    throw new Error("Post ID must be a valid number");
  }

  const response = await fetch(`${API_BASE}/social/posts/${numericId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ title, body, tags, media }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Error: ${data.message}`);
  }

  return data;
}
