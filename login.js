
const MAX_ATTEMPTS = 4;
const ATTEMPTS_KEY = "lotrIncorrectAttempts";

// Do not change the credentials import/export structure required by your homework.
export function onLogin(username, password) {
  const attempts = Number(
    sessionStorage.getItem(ATTEMPTS_KEY) || "0"
  );

  if (attempts >= MAX_ATTEMPTS) {
    return {
      success: false,
      message: "Login blocked: Too many incorrect attempts."
    };
  }

  const validCredentials =
    (username === "friend" && password === "Mellon");

  if (validCredentials) {
    sessionStorage.setItem("lotrLoggedIn", "true");
    sessionStorage.setItem("lotrUsername", username);
    sessionStorage.removeItem(ATTEMPTS_KEY);

    return {
      success: true,
      message: "Logged in successfully!"
    };
  }

  const nextAttempts = attempts + 1;

  sessionStorage.setItem(ATTEMPTS_KEY, String(nextAttempts));

  if (nextAttempts >= MAX_ATTEMPTS) {
    return {
      success: false,
      message: "Login blocked: Too many incorrect attempts."
    };
  }

  return {
    success: false,
    message: `Incorrect credentials. ${
      MAX_ATTEMPTS - nextAttempts
    } attempt(s) remaining.`
  };
}
