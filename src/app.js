import "./css/style.css";
import "/src/index.css";

import router from "./js/router";

await router(window.location.pathname);
