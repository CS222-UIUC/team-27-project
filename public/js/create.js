document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------
  // Create the top two buttons: home and theme toggle
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
  themeToggle.src = "../icon/moon.png";
  themeToggle.alt = "Toggle Theme";
  document.body.appendChild(themeToggle);

  homeIcon.addEventListener("click", () => {
    window.location.href = "../index.html"; // Adjust if you have an index page
  });

  let isDarkMode = false;
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    isDarkMode = !isDarkMode;
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
  // Create the middle box and style it
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

  // Header
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
  // Create the Submit button
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
  // Submit button event: send the data via POST
  // ---------------------------
  submitButton.addEventListener("click", () => {
    const puzzleText = puzzleInput.value;
    const storyText = storyInput.value;
    
    fetch('http://localhost:3000/api/puzzles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ puzzleInput: puzzleText, storyInput: storyText })
    })
      .then(response => response.json())
      .then(data => {
        alert("Puzzle submitted and saved with id: " + data.id);
        // 清空输入框
        puzzleInput.value = "";
        storyInput.value = "";
      })
      .catch(err => {
        alert("Error submitting puzzle: " + err.message);
      });
  });
  
  // ---------------------------
  // Update theme styles (已删除 contentArea 的引用)
  // ---------------------------
  function updateStylesForMode() {
    if (document.body.classList.contains("dark-mode")) {
      document.body.style.backgroundColor = "#121212";
      puzzleBox.style.backgroundColor = "#222";
      puzzleBox.style.color = "#fff";
      submitButton.style.backgroundColor = "#444";
      submitButton.style.color = "#fff";
    } else {
      document.body.style.backgroundColor = "#fff";
      puzzleBox.style.backgroundColor = "#f9f9f9";
      puzzleBox.style.color = "#000";
      submitButton.style.backgroundColor = "#f0f0f0";
      submitButton.style.color = "#000";
    }
  }
  updateStylesForMode();
});
