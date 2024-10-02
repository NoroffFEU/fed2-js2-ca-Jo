import { API_BASE, API_KEY } from "../../api/constants";
import { getPosts } from "/src/js/ui/post/view.js";

export async function onDeletePost(event, postId) {
  const confirmed = confirm("Are you sure you want to delete this post?");

  if (!confirmed) {
    return;
  }

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to delete a post.");
      return;
    }

    console.log(postId);

    const response = await fetch(
        `https://v2.api.noroff.dev/social/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-Noroff-API-Key": "7fd0f3fa-3c34-4f9a-8f28-95d00d9aa532",
            Authorization: `Bearer ${token}`,
          },
        }
    );

    if (response.status === 401) {
      alert("Unauthorized! Please log in again.");
      return;
    }

    if (response.status !== 204) {
      throw new Error(`Error: ${response.status}`);
    }

    console.log("Post deleted successfully");
    getPosts();
  } catch (error) {
    if (error.message.includes("403")) {
      alert("Forbidden: You do not have permission to delete this post.");
    } else {
      console.error("Failed to delete post:", error);
      alert("Failed to delete the post. Error: " + error.message);
    }
  }
}

window.onDeletePost = onDeletePost;
