import { API_KEY } from "./constants";

export function headers(API_KEY) {
  const headers = new Headers();

  if (API_KEY) {
    headers.append("X-Noroff-API-Key", API_KEY);
  }

  return headers;
}
