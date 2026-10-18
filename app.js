
import { onLogin } from "./login.js";

const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

function getSafeDestination() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next");

  // Only allow navigation to simple HTML pages on this site.
  if (
    next &&
    /^\.\/[a-zA-Z0-9_-]+\.html(?:[?#].*)?$/.test(next)
  ) {
    return next;
  }

  return "./index.html";
}

// If already logged in, don't show the login form again.
if (sessionStorage.getItem("lotrLoggedIn") === "true") {
  window.location.replace(getSafeDestination());
} else {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (loginButton.disabled) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    loginButton.disabled = true;
    loginButton.textContent = "Checking...";
    loginMessage.textContent = "";
    loginMessage.className = "";

    const randomDelay = Math.floor(Math.random() * 751) + 250;

    window.setTimeout(() => {
      const result = onLogin(username, password);

      loginMessage.textContent = result.message;
      loginMessage.className = result.success ? "success" : "error";

      if (result.success) {
        window.location.replace(getSafeDestination());
      } else {
        loginButton.disabled = false;
        loginButton.textContent = "Login";
      }
    }, randomDelay);
  });
}
