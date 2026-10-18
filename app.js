
import { onLogin } from "./login.js";

// ========================================
// LEAP YEAR APP
// ========================================

const yearInput = document.getElementById("yearInput");
const yearMessage = document.getElementById("yearMessage");

function checkLeapYear() {
  const input = yearInput.value.trim();

  if (input === "") {
    yearMessage.textContent = "";
    yearMessage.className = "";
    return;
  }

  // Accept only whole numbers.
  if (!/^\d+$/.test(input)) {
    yearMessage.textContent =
      "Invalid year! Enter a whole number from 1 to 9999.";
    yearMessage.className = "error";
    return;
  }

  const year = Number(input);

  // Validate the year range.
  if (year < 1 || year > 9999) {
    yearMessage.textContent =
      "Invalid year! Enter a whole number from 1 to 9999.";
    yearMessage.className = "error";
    return;
  }

  // Check the leap year rules.
  if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
    yearMessage.textContent = `Yes, ${year} is a leap year.`;
    yearMessage.className = "success";
  } else {
    yearMessage.textContent = `No, ${year} is not a leap year.`;
    yearMessage.className = "error";
  }
}

// Check immediately while typing.
if (yearInput && yearMessage) {
  yearInput.addEventListener("input", checkLeapYear);

  // Also check when Enter is pressed.
  yearInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      checkLeapYear();
      yearInput.blur();
    }
  });
}

// ========================================
// CURRENCY CONVERTER APP
// ========================================

// Exchange rate: 1 EUR = 1.1643 USD.
const EUR_USD_RATE = 1.1643;

const conversionDirection =
  document.getElementById("conversionDirection");
const currencyAmount = document.getElementById("currencyAmount");
const convertButton = document.getElementById("convertButton");
const currencyMessage = document.getElementById("currencyMessage");

function convertCurrency() {
  const amountInput = currencyAmount.value.trim();
  const direction = conversionDirection.value;

  // Check for an empty input.
  if (amountInput === "") {
    currencyMessage.textContent = "Please enter an amount.";
    currencyMessage.className = "error";
    return;
  }

  const amount = Number(amountInput);

  // Validate the amount.
  if (!Number.isFinite(amount) || amount <= 0) {
    currencyMessage.textContent =
      "Please enter a valid positive number.";
    currencyMessage.className = "error";
    return;
  }

  // Convert the amount in the selected direction.
  if (direction === "eur-usd") {
    const convertedAmount = amount * EUR_USD_RATE;

    currencyMessage.textContent =
      `${amount.toFixed(2)} EUR = ${convertedAmount.toFixed(2)} USD.`;
  } else {
    const convertedAmount = amount / EUR_USD_RATE;

    currencyMessage.textContent =
      `${amount.toFixed(2)} USD = ${convertedAmount.toFixed(2)} EUR.`;
  }

  currencyMessage.className = "success";
}

// Convert when the button is clicked.
if (
  conversionDirection &&
  currencyAmount &&
  convertButton &&
  currencyMessage
) {
  convertButton.addEventListener("click", convertCurrency);

  // Also convert when Enter is pressed.
  currencyAmount.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      convertCurrency();
    }
  });

  // Clear old feedback when the user changes the direction.
  conversionDirection.addEventListener("change", () => {
    currencyMessage.textContent = "";
    currencyMessage.className = "";
  });

  // Clear old feedback when the user edits the amount.
  currencyAmount.addEventListener("input", () => {
    currencyMessage.textContent = "";
    currencyMessage.className = "";
  });
}

// ========================================
// LOGIN APP
// ========================================

const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

function getSafeDestination() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next");

  // Allow only simple HTML pages on this site.
  if (next && /^\.\/[a-zA-Z0-9_-]+\.html(?:[?#].*)?$/.test(next)) {
    return next;
  }

  return "./index.html";
}

// Redirect users who are already logged in.
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
