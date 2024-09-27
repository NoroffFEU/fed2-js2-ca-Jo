import "./css/style.css"; // This should remain the same
import router from "./js/router/index.js"; // Update this to point to the correct router file
await router(window.location.pathname);