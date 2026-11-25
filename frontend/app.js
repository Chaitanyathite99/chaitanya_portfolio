const themeToggle = document.querySelector("#theme-toggle");
const sparkButton = document.querySelector("#spark-button");
const motivation = document.querySelector("#motivation");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

const encouragements = [
  "Tiny steps still move you forward.",
  "Your next idea might be the good one.",
  "Bugs are just plot twists in your origin story.",
  "Make it work, then make it delightful.",
  "You have excellent main-character energy.",
];
let encouragementIndex = 0;

themeToggle.addEventListener("click", () => {
  const darkMode = document.body.classList.toggle("dark-theme");
  themeToggle.setAttribute("aria-label", darkMode ? "Switch to light theme" : "Switch to dark theme");
  document.querySelector('meta[name="theme-color"]').content = darkMode ? "#202024" : "#f8f5ee";
});

sparkButton.addEventListener("click", () => {
  motivation.textContent = encouragements[encouragementIndex];
  encouragementIndex = (encouragementIndex + 1) % encouragements.length;
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formStatus.textContent = "Sending your demo hello…";
  formStatus.dataset.state = "sending";

  const formData = new FormData(contactForm);
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      formStatus.textContent = result.error ?? "Something went wrong. Please try again.";
      formStatus.dataset.state = "error";
      return;
    }
    formStatus.textContent = result.message;
    formStatus.dataset.state = "success";
    contactForm.reset();
  } catch {
    formStatus.textContent = "Could not reach the demo API. Is the Python server running?";
    formStatus.dataset.state = "error";
  }
});

