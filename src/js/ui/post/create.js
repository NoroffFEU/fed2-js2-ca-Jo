import { API_SOCIAL_POSTS, ACCESS_TOKEN } from "../../api/constants";
export async function onCreatePost(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const title = form.get("title");
  const body = form.get("body");
  const tags = form.get("tags")
    ? form
        .get("tags")
        .split(",")
        .map((tag) => tag.trim())
    : [];
  const imageURL = form.get("imageURL");

  const post = {
    title: title,
    body: body,
    tags: tags,
    media: {
      url: imageURL || "",
      alt: "",
    },
  };

  console.log("Post object:", post);

  try {
    const API_KEY = "7fd0f3fa-3c34-4f9a-8f28-95d00d9aa532";
    const response = await fetch(API_SOCIAL_POSTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(post),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Post created successfully:", data);
      alert("Post created successfully!");
      window.location.href = "/post/index.html";
    } else {
      const errorData = await response.json();
      console.error("Post creation failed:", errorData);
      alert("Post creation failed: " + errorData.message);
    }
  } catch (error) {
    console.error("Error during post creation:", error);
    alert("An error occurred during post creation.");
  }
}
