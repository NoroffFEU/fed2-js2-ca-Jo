import { getPostByIdAPI, getPostsAPI } from "/src/js/api/post/read.js";
import { onDeletePost } from "/src/js/ui/post/delete.js";
import {updatePost} from "./update.js";
import {API_BASE, API_KEY} from "../../api/constants.js";
const btnClear = document.getElementById("btnClear");
const likeEmoji = "👍"; // Only the like emoji
let allPosts = [];
let allTags = new Set();

export async function getPosts() {
  try {
    const response = await getPostsAPI();
    console.log("Posts data:", response);

    allPosts = response.data;
    allPosts.forEach((post) => {
      post.tags.forEach((tag) => allTags.add(tag));
    });
    populateTagFilter(allTags);
    postFeed.innerHTML = "";

    renderPosts(allPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

function populateTagFilter(tags) {
  const filterSelect = document.getElementById("filterSelect");
  filterSelect.innerHTML = `<option value="">Filter by Tag</option>`;

  tags.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    filterSelect.appendChild(option);
  });
}

function renderPosts(posts) {
  const postFeed = document.getElementById("postFeed");
  postFeed.innerHTML = "";

  posts.forEach((post) => {
    const reactions = post.reactions || {};
    const postElement = document.createElement("div");
    postElement.setAttribute("data-id", post.id);
    postElement.className = "post p-4 backdrop transition-shadow";

    postElement.innerHTML = `
      <h2 class="text-xl font-semibold text-blue-600">${post.title}</h2>
      <p class="text-gray-700 my-2">${post.body}</p>
      <span class="text-gray-500">Tags: ${post.tags.join(", ")}</span>
      <div class="mt-4">
        <h4 class="text-lg font-semibold text-gray-800">Author: ${post.author?.name || "Unknown"}</h4>
        <p class="text-gray-500">Email: ${post.author?.email || "N/A"}</p>
      </div>
      ${post.media?.url ? `<img src="${post.media.url}" alt="${post.media.alt}" class="mt-4" />` : ""}
      <div class="mt-4">
        <button class="like-button">${likeEmoji}</button>
      </div>
      <div class="mt-2 reaction-container">
        ${reactions[likeEmoji] ? `<span class="reaction">${likeEmoji}: ${reactions[likeEmoji]}</span>` : ""}
      </div>
      <button onclick="viewPost(${post.id})" class="bg-blue-600 text-white rounded-md p-2 mt-4 hover:bg-blue-700">View</button>
      <button onclick="deletePost(event, ${post.id})" class="bg-red-600 text-white rounded-md p-2 mt-4 hover:bg-red-700 ml-4">Delete</button>
      <button class="bg-purple-600 text-white rounded-md p-2 mt-4 hover:bg-purple-700 ml-4 update-button">Update</button>
    `;

    postFeed.appendChild(postElement);

    const likeButton = postElement.querySelector(".like-button");
    likeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      reactWithLike(post.id);
    });

    const updateButton = postElement.querySelector(".update-button");
    updateButton.addEventListener("click", (event) => {
      event.stopPropagation();
      window.updatePost_(post.id);
    });
  });
}

window.updatePost_ = (postId) => updatePost(postId);
window.deletePost = (event, postId) => onDeletePost(event, postId);

export async function viewPost(postId) {
  try {
    const response = await getPostByIdAPI(postId);
    const post = response.data;
    if (!post) {
      throw new Error("Post not found");
    }

    const postFeed = document.getElementById("postFeed");
    postFeed.innerHTML = "";

    const postElement = document.createElement("div");
    postElement.className = "post-detail p-4 backdrop";

    let tagsDisplay = post.tags && post.tags.length > 0
        ? `<span class="text-gray-500">Tags: ${post.tags.join(", ")}</span>`
        : `<span class="text-gray-500">Tags: None</span>`;

    let mediaDisplay = post.media && post.media.url
        ? `<img src="${post.media.url}" alt="${post.media.alt || "No description"}" class="mt-4" />`
        : `<p class="text-gray-500">No image available</p>`;

    let commentsDisplay = post._count.comments > 0
        ? `<h3 class="text-lg font-semibold mt-4">Comments:</h3>`
        : `<p class="text-gray-500">No comments available</p>`;

    postElement.innerHTML = `
      <h2 class="text-2xl font-bold text-blue-600">${post.title || "No title"}</h2>
      <p class="text-gray-700 my-4">${post.body || "No content available"}</p>
      ${tagsDisplay}
      <p class="text-gray-500">Created at: ${new Date(post.created).toLocaleDateString()}</p>
      ${mediaDisplay}
      <button onclick="goBackToPosts()" class="bg-blue-600 text-white rounded-md p-2 mt-4 hover:bg-blue-700">Go Back to Feed</button>
      ${commentsDisplay}
    `;

    postFeed.appendChild(postElement);
  } catch (error) {
    console.error("Error fetching post details:", error);
    alert("Failed to load post details.");
  }
}
window.viewPost = viewPost;

export function goBackToPosts() {
  renderPosts(allPosts);
}
window.goBackToPosts = goBackToPosts;

document.getElementById("filterSelect").addEventListener("change", (event) => {
  const selectedTag = event.target.value;
  if (selectedTag) {
    const filteredPosts = allPosts.filter((post) => post.tags.includes(selectedTag));
    renderPosts(filteredPosts);
  } else {
    renderPosts(allPosts);
  }
});

document.getElementById("searchInput").addEventListener("input", (event) => {
  const searchText = event.target.value.toLowerCase();
  const filteredPosts = allPosts.filter((post) => {
    return (
        post.title.toLowerCase().includes(searchText) ||
        post.body.toLowerCase().includes(searchText)
    );
  });
  renderPosts(filteredPosts);
});

btnClear.onclick = function () {
  localStorage.clear();
  if (localStorage.length === 0) lsOutput.innerHTML = "";
};

window.reactWithLike = async (postId) => {
  const post = allPosts.find((p) => p.id === postId);
  if (!post) return;

  if (post.reactions && post.reactions[likeEmoji]) {
    alert("You can only like this post once!");
    return;
  }
  try {
    const response = await fetch(`${API_BASE}/social/posts/${postId}/react/👍`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });

    if (!response.ok) {
      new Error("Failed to react to post");
    }

    post.reactions = post.reactions || {};
    post.reactions[likeEmoji] = 1;
    updatePostReactionsInDOM(postId, post.reactions);
  } catch (error) {
    console.error("Error reacting to post:", error);
  }
};

async function updatePostReactionsInDOM(postId, reactions) {
  const postElement = document.querySelector(`.post[data-id="${postId}"]`);
  if (!postElement) return;

  let reactionContainer = postElement.querySelector('.reaction-container');
  if (!reactionContainer) {
    reactionContainer = document.createElement('div');
    reactionContainer.className = 'reaction-container mt-2';
    postElement.appendChild(reactionContainer);
  }

  const updatedReactionsHTML = Object.entries(reactions).map(([emoji, count]) => {
    return `<span class="reaction">${emoji}: ${count}</span>`;
  }).join(" ");

  reactionContainer.innerHTML = updatedReactionsHTML;
}