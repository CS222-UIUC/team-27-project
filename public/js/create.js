// create.js:
document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------
  // Create top two buttons: Home and Theme Toggle
  // ---------------------------
  const homeIcon = document.createElement("img");
  homeIcon.className = "top-button home-button";
  homeIcon.id = "homeIcon";
  homeIcon.src = "../icon/home.png";
  homeIcon.alt = "Home";
  document.body.appendChild(homeIcon);

  const themeToggle = document.createElement("img");
  themeToggle.className = "top-button theme-toggle";
  themeToggle.id = "themeToggle";
  themeToggle.alt = "Toggle Theme";
  document.body.appendChild(themeToggle);

  // ---------------------------
  // Home button: return to homepage
  // ---------------------------
  homeIcon.addEventListener("click", () => {
    window.location.href = "../index.html";
  });

  // ---------------------------
  // Initialize theme (read from localStorage)
  // ---------------------------
  const savedTheme = localStorage.getItem("theme");
  let isDarkMode = false;
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    isDarkMode = true;
  } else {
    isDarkMode = false;
  }
  themeToggle.src = isDarkMode ? "../icon/sun.png" : "../icon/moon.png";
  homeIcon.style.filter  = isDarkMode ? "brightness(0) invert(1)" : "none";
  themeToggle.style.filter = isDarkMode ? "brightness(0) invert(1)" : "none";

  // ---------------------------
  // Theme toggle logic (same as in chat.js)
  // ---------------------------
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    isDarkMode = !isDarkMode;

    if (isDarkMode) {
      themeToggle.src = "../icon/sun.png";
      homeIcon.style.filter  = "brightness(0) invert(1)";
      themeToggle.style.filter = "brightness(0) invert(1)";
      localStorage.setItem("theme", "dark");
    } else {
      themeToggle.src = "../icon/moon.png";
      homeIcon.style.filter  = "none";
      themeToggle.style.filter = "none";
      localStorage.setItem("theme", "light");
    }
    updateStylesForMode();
  });

  // ---------------------------
  // Create central input box and related elements
  // ---------------------------
  const puzzleBox = document.createElement("div");
  puzzleBox.id = "puzzleBox";
  puzzleBox.style.width = "600px";
  puzzleBox.style.margin = "50px auto";
  puzzleBox.style.padding = "20px";
  puzzleBox.style.border = "1px solid #ccc";
  puzzleBox.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
  puzzleBox.style.display = "flex";
  puzzleBox.style.flexDirection = "column";
  puzzleBox.style.alignItems = "center";

  const header = document.createElement("h2");
  header.textContent = "Create Your Own Puzzle";
  header.style.textAlign = "center";
  header.style.width = "100%";
  puzzleBox.appendChild(header);

  // ---------------------------
  // "Title" input section (new)
  // ---------------------------
  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Title:";
  titleLabel.style.width = "100%";
  titleLabel.style.margin = "10px 0 5px 0";
  titleLabel.style.fontWeight = "bold";
  puzzleBox.appendChild(titleLabel);

  const titleInput = document.createElement("input");
  titleInput.id = "titleInput";
  titleInput.type = "text";
  titleInput.placeholder = "Enter the title";
  titleInput.style.width = "100%";
  titleInput.style.padding = "10px";
  titleInput.style.boxSizing = "border-box";
  puzzleBox.appendChild(titleInput);

  // ---------------------------
  // "The puzzle" input section
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
  // "The whole Story" input section
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
  // "Tags" input section
  // ---------------------------
  const tagsLabel = document.createElement("label");
  tagsLabel.textContent = "Tags:";
  tagsLabel.style.width = "100%";
  tagsLabel.style.margin = "10px 0 5px 0";
  tagsLabel.style.fontWeight = "bold";
  puzzleBox.appendChild(tagsLabel);

  const tagInput = document.createElement("input");
  tagInput.type = "text";
  tagInput.id = "tagInput";
  tagInput.placeholder = "Enter a tag and press Enter";
  tagInput.style.width = "100%";
  tagInput.style.padding = "10px";
  tagInput.style.boxSizing = "border-box";
  puzzleBox.appendChild(tagInput);

  const tagsContainer = document.createElement("div");
  tagsContainer.id = "tagsContainer";
  tagsContainer.style.width = "100%";
  tagsContainer.style.marginTop = "10px";
  tagsContainer.style.display = "flex";
  tagsContainer.style.flexWrap = "wrap";
  puzzleBox.appendChild(tagsContainer);

  const tags = [];

  tagInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && tagInput.value.trim() !== "") {
      event.preventDefault();
      const tagText = tagInput.value.trim();
      if (!tags.includes(tagText)) {
        tags.push(tagText);

        // Create a tag bubble
        const tagElement = document.createElement("span");
        tagElement.textContent = tagText + " ✕";          // Display a clickable ✕
        tagElement.style.padding = "5px 10px";
        tagElement.style.margin = "5px";
        tagElement.style.backgroundColor = isDarkMode ? "#555" : "#ddd";
        tagElement.style.borderRadius = "15px";
        tagElement.style.fontSize = "14px";
        tagElement.style.cursor = "pointer";
        tagsContainer.appendChild(tagElement);

        // Click to remove the tag and delete it from the array
        tagElement.addEventListener("click", () => {
          tagsContainer.removeChild(tagElement);
          const idx = tags.indexOf(tagText);
          if (idx !== -1) tags.splice(idx, 1);
        });
      }
      tagInput.value = "";
    }
  });

  // ---------------------------
  // Submit button
  // ---------------------------
  const submitButton = document.createElement("button");
  submitButton.id = "submitButton";
  submitButton.textContent = "Submit";
  submitButton.style.padding = "10px 20px";
  submitButton.style.fontSize = "16px";
  submitButton.style.cursor = "pointer";
  submitButton.style.marginTop = "20px";
  puzzleBox.appendChild(submitButton);

  document.body.appendChild(puzzleBox);

  // ---------------------------
  // Submit event: POST data
  // ---------------------------
  submitButton.addEventListener("click", () => {
    const titleText  = titleInput.value.trim();
    const puzzleText = puzzleInput.value.trim();
    const storyText  = storyInput.value.trim();

    fetch('http://localhost:3000/api/puzzles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        titleInput:  titleText,
        puzzleInput: puzzleText,
        storyInput:  storyText,
        tags:        tags
      })
    })
      .then(response => response.json())
      .then(data => {
        alert("Puzzle submitted and saved with id: " + data.id);
        titleInput.value  = "";
        puzzleInput.value = "";
        storyInput.value  = "";
        tagsContainer.innerHTML = "";
        tags.length = 0;
      })
      .catch(err => {
        alert("Error submitting puzzle: " + err.message);
      });
  });

  // ---------------------------
  // Update styles based on current theme
  // ---------------------------
  function updateStylesForMode() {
    if (document.body.classList.contains("dark-mode")) {
      document.body.style.backgroundColor = "#121212";
      puzzleBox.style.backgroundColor = "#222";
      puzzleBox.style.color = "#fff";
      submitButton.style.backgroundColor = "#444";
      submitButton.style.color = "#fff";
      // Dim tag background color in dark mode
      const tagSpans = tagsContainer.querySelectorAll("span");
      tagSpans.forEach(span => {
        span.style.backgroundColor = "#555";
      });
    } else {
      document.body.style.backgroundColor = "#fff";
      puzzleBox.style.backgroundColor = "#f9f9f9";
      puzzleBox.style.color = "#000";
      submitButton.style.backgroundColor = "#f0f0f0";
      submitButton.style.color = "#000";
      // Restore tag background color in light mode
      const tagSpans = tagsContainer.querySelectorAll("span");
      tagSpans.forEach(span => {
        span.style.backgroundColor = "#ddd";
      });
    }
  }
  updateStylesForMode();
});
