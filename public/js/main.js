document.addEventListener("DOMContentLoaded", () => {
  // 1) Read the theme value from localStorage and set the UI accordingly
  const savedTheme = localStorage.getItem("theme");
  let isDarkMode = false;
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    isDarkMode = true;
  } else {
    isDarkMode = false;
  }

  // 2) Set the initial theme icon based on whether dark mode is active
  const themeToggle = document.createElement("img");
  themeToggle.alt = "Toggle Theme";
  themeToggle.className = "theme-toggle";
  themeToggle.id = "themeToggle";
  themeToggle.src = isDarkMode ? "../icon/sun.png" : "../icon/moon.png";

  document.body.appendChild(themeToggle);

  // 3) On theme toggle, update both the UI and localStorage
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      themeToggle.src = "../icon/sun.png";
      localStorage.setItem("theme", "dark");
    } else {
      themeToggle.src = "../icon/moon.png";
      localStorage.setItem("theme", "light");
    }
  });

  // Create the main container (shifted up slightly to match styling in main)
  const container = document.createElement("div");
  container.className = "container";
  document.body.appendChild(container);

  // Create title
  const h1 = document.createElement("h1");
  h1.textContent = "Turtle Soup Riddle";
  container.appendChild(h1);

  // Create descriptive paragraph
  const p = document.createElement("p");
  p.textContent = "Ask yes/no questions to uncover the hidden story behind a mysterious scenario!";
  container.appendChild(p);

  // Create button container
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  container.appendChild(buttonContainer);

  // Create "Play" button
  const btnPlay = document.createElement("button");
  btnPlay.textContent = "Play";
  buttonContainer.appendChild(btnPlay);
  // Bind click event to Play button to redirect to chat page (chat.html)
  btnPlay.addEventListener("click", () => {
    window.location.href = "../html/chat.html";
  });

  // Create "Create One" button
  const btnCreate = document.createElement("button");
  btnCreate.textContent = "Create One";
  buttonContainer.appendChild(btnCreate);
  // Bind click event to Create button to redirect to create page (create.html)
  btnCreate.addEventListener("click", () => {
    window.location.href = "../html/create.html";
  });
});
