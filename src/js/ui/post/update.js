import { getPostByIdAPI } from "/src/js/api/post/read.js";
import { updatePostAPI } from "/src/js/api/post/update.js";

export async function updatePost(postId) {
  const postToUpdate = await getPostByIdAPI(postId);

  if (postToUpdate) {
    openUpdateForm(postToUpdate);
  } else {
    alert("Post not found for update.");
  }
}

function openUpdateForm(post) {
  const updateForm = document.getElementById("updateForm");
  updateForm.elements["title"].value = post.data.title || "";
  updateForm.elements["body"].value = post.data.body || "";
  updateForm.elements["tags"].value = post.data.tags
      ? post.data.tags.join(", ")
      : "";

  console.log("Post Data:", post);
  updateForm.setAttribute("data-post-id", post.data.id);
  updateForm.setAttribute("data-media-url", post.data.media.url || "");
  document.getElementById("updateModal").style.display = "flex";
}

document.addEventListener("DOMContentLoaded", () => {
  const closeModalBtn = document.getElementById("closeModalBtn");
  const updateModal = document.getElementById("updateModal");

  // Close modal when clicking outside of it
  window.addEventListener("click", (event) => {
    if (event.target === updateModal) {
      updateModal.style.display = "none";
    }
  });

  const updateForm = document.getElementById("updateForm");
  updateForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const postId = Number(event.target.getAttribute("data-post-id"));
    if (isNaN(postId)) {
      alert("Invalid post ID.");
      return;
    }
    const mediaURL = event.target.getAttribute("data-media-url") || "";

    const updatedTitle = event.target.elements["title"].value;
    const updatedBody = event.target.elements["body"].value;
    const updatedTags = event.target.elements["tags"].value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

    console.log("Form Data:", {
      title: updatedTitle,
      body: updatedBody,
      tags: updatedTags,
      media: mediaURL,
    });

    try {
      const data = await updatePostAPI(postId, {
        title: updatedTitle,
        body: updatedBody,
        tags: updatedTags,
        media: { url: mediaURL, alt: "" },
      });
      console.log("Update Response:", data);
      updateModal.style.display = "none";
    } catch (error) {
      console.error("Error updating post:", error);
    }
  });

  // Close modal button event listener
  closeModalBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    updateModal.style.display = 'none';
  });
});