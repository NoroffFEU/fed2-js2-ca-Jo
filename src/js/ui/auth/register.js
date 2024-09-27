import { API_AUTH_REGISTER } from "../../api/constants";

export async function onRegister(event) {
  event.preventDefault();

  const form = new FormData(event.target);
  const name = form.get("name");
  const email = form.get("email");
  const password = form.get("password");
  const bio = form.get("bio") || "";
  const avatarUrl = form.get("link") || "";
  const avatarAlt = form.get("avatarAlt") || "";
  const bannerUrl = form.get("link") || "";
  const bannerAlt = form.get("bannerAlt") || "";
  const body = {
    name: name,
    email: email,
    password: password,
    bio: bio,
    avatar: {
      url: avatarUrl,
      alt: avatarAlt,
    },
    banner: {
      url: bannerUrl,
      alt: bannerAlt,
    },
    venueManager: true,
  };
  try {
    const response = await fetch(API_AUTH_REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      alert("Registration successful! Please log in.");
      window.location.href = "/auth/login/index.html";
    } else {
      const errorData = await response.json();

      console.error("Registration failed with status:", response.status);
      console.log("Full error data:", errorData);

      alert("Registration failed: " + JSON.stringify(errorData, null, 2));
    }
  } catch (error) {
    console.error("Error during registration:", error);
    alert("Error during registration: " + error.message);
  }
}
