
const loggedIn = sessionStorage.getItem("lotrLoggedIn") === "true";

// Redirect visitors who are not logged in.
if (!loggedIn) {
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  const nextPage =
    "./" + currentPage + window.location.search + window.location.hash;

  window.location.replace(
    "./login.html?next=" + encodeURIComponent(nextPage)
  );
}

// Handle logout.
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("lotrLoggedIn");
    sessionStorage.removeItem("lotrUsername");

    window.location.replace("./login.html");
  });
}

// Handle quiz submission.
const quizForm = document.getElementById("quizForm");

if (quizForm) {
  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const quizMessage = document.getElementById("quizMessage");

    quizMessage.textContent =
      "Your answers have been submitted! Well done, Middle-earth explorer.";

    quizMessage.classList.add("success");
  });
}
