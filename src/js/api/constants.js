export function getAccessToken() {
  return localStorage.getItem('token');
}
export const API_KEY = "7fd0f3fa-3c34-4f9a-8f28-95d00d9aa532";
export const ACCESS_TOKEN = getAccessToken()
const options = {
  headers: {
    Authorization:
        `Bearer ${localStorage.getItem("token")}`,
    "X-Noroff-API-Key": "7fd0f3fa-3c34-4f9a-8f28-95d00d9aa532",
  },
};
export const API_BASE = "https://v2.api.noroff.dev";

export const API_AUTH = `${API_BASE}/auth`;

export const API_AUTH_LOGIN = `${API_AUTH}/login`;

export const API_AUTH_REGISTER = `${API_AUTH}/register`;

export const API_AUTH_KEY = `${API_AUTH}/create-api-key`;

export const API_SOCIAL = `${API_BASE}/social`;

export const API_SOCIAL_POSTS = `${API_SOCIAL}/posts`;

export const API_SOCIAL_PROFILES = `${API_SOCIAL}/profiles`;