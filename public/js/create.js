document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------
  // Create the top two buttons: home and theme toggle
  // ---------------------------
  // Home icon button (top-left)
  const homeIcon = document.createElement("img");
  homeIcon.className = "top-button home-button";
  homeIcon.id = "homeIcon";
  homeIcon.src = "../icon/home.png";
  homeIcon.alt = "Home";
  document.body.appendChild(homeIcon);

  // Theme toggle icon button (top-right)
  const themeToggle = document.createElement("img");
  themeToggle.className = "top-button theme-toggle";
  themeToggle.id = "themeToggle";
  themeToggle.src = "../icon/moon.png"; // initial icon: moon
  themeToggle.alt = "Toggle Theme";
  document.body.appendChild(themeToggle);

  // Home navigation: clicking the home icon returns to the home page
  homeIcon.addEventListener("click", () => {
    window.location.href = "../index.html"; // adjust path as necessary
  });

  // ---------------------------
  // Theme toggle logic
  // ---------------------------
  let isDarkMode = false;
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    isDarkMode = !isDarkMode;
    // Invert icon colors using CSS filter, syncing both icons
    if (isDarkMode) {
      themeToggle.style.filter = "invert(1)";
      homeIcon.style.filter = "invert(1)";
    } else {
      themeToggle.style.filter = "none";
      homeIcon.style.filter = "none";
    }
    updateStylesForMode();
  });

  // ---------------------------
  // Create the middle box (similar to a table) and enlarge it
  // ---------------------------
  const puzzleBox = document.createElement("div");
  puzzleBox.id = "puzzleBox";
  // Adjust the box style
  puzzleBox.style.width = "600px";            // Enlarged width
  puzzleBox.style.margin = "50px auto";         // Centered with top margin
  puzzleBox.style.padding = "20px";
  puzzleBox.style.border = "1px solid #ccc";
  puzzleBox.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
  puzzleBox.style.display = "flex";
  puzzleBox.style.flexDirection = "column";
  puzzleBox.style.alignItems = "center";

  // Add a centered header at the top of the box
  const header = document.createElement("h2");
  header.textContent = "Create Your Own Puzzle";
  header.style.textAlign = "center";
  header.style.width = "100%";
  puzzleBox.appendChild(header);

  // ---------------------------
  // Add "The puzzle" input area
  // ---------------------------
  const puzzleLabel = document.createElement("label");
  puzzleLabel.textContent = "The puzzle:";
  puzzleLabel.style.width = "100%";
  puzzleLabel.style.margin = "10px 0 5px 0";
  puzzleLabel.style.fontWeight = "bold";
  puzzleBox.appendChild(puzzleLabel);

  const puzzleInput = document.createElement("textarea");
  puzzleInput.id = "puzzleInput";
  puzzleInput.style.width = "100%";
  puzzleInput.style.height = "100px";
  puzzleInput.style.padding = "10px";
  puzzleInput.placeholder = "Enter the puzzle content";
  puzzleInput.style.boxSizing = "border-box";
  puzzleBox.appendChild(puzzleInput);

  // ---------------------------
  // Add "The whole Story" input area
  // ---------------------------
  const storyLabel = document.createElement("label");
  storyLabel.textContent = "The whole Story:";
  storyLabel.style.width = "100%";
  storyLabel.style.margin = "10px 0 5px 0";
  storyLabel.style.fontWeight = "bold";
  puzzleBox.appendChild(storyLabel);

  const storyInput = document.createElement("textarea");
  storyInput.id = "storyInput";
  storyInput.style.width = "100%";
  storyInput.style.height = "150px";
  storyInput.style.padding = "10px";
  storyInput.placeholder = "Enter the story content";
  storyInput.style.boxSizing = "border-box";
  puzzleBox.appendChild(storyInput);

  
  // ---------------------------
  // Create the Submit button at the bottom of the box
  // ---------------------------
  const submitButton = document.createElement("button");
  submitButton.id = "submitButton";
  submitButton.textContent = "Submit";
  submitButton.style.padding = "10px 20px";
  submitButton.style.fontSize = "16px";
  submitButton.style.cursor = "pointer";
  submitButton.style.marginTop = "20px";

  const spacer = document.createElement("div");
  spacer.style.height = "20px";
  puzzleBox.appendChild(spacer);


  puzzleBox.appendChild(submitButton);

  // Append the box to the page
  document.body.appendChild(puzzleBox);

  // Submit button click event handler
  submitButton.addEventListener("click", () => {
    alert(
      "Puzzle submitted!\n" +
      "The puzzle: " + puzzleInput.value + "\n" +
      "The whole Story: " + storyInput.value
    );
  });

  // ---------------------------
  // Update styles based on the current theme (light/dark)
  // ---------------------------
  function updateStylesForMode() {
    if (document.body.classList.contains("dark-mode")) {
      document.body.style.backgroundColor = "#121212";
      puzzleBox.style.backgroundColor = "#222";
      puzzleBox.style.color = "#fff";
      contentArea.style.backgroundColor = "#333";
      contentArea.style.borderColor = "#555";
      submitButton.style.backgroundColor = "#444";
      submitButton.style.color = "#fff";
    } else {
      document.body.style.backgroundColor = "#fff";
      puzzleBox.style.backgroundColor = "#f9f9f9";
      puzzleBox.style.color = "#000";
      contentArea.style.backgroundColor = "#fff";
      contentArea.style.borderColor = "#ccc";
      submitButton.style.backgroundColor = "#f0f0f0";
      submitButton.style.color = "#000";
    }
  }

  // Initial call to set the theme styles
  updateStylesForMode();
});

  
  