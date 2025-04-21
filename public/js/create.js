document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------
  // 创建顶部两个按钮：home 与主题切换
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
  // Home 按钮：返回主页
  // ---------------------------
  homeIcon.addEventListener("click", () => {
    window.location.href = "../index.html";
  });

  // ---------------------------
  // 初始化主题（读取 localStorage）
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
  // 主题切换逻辑（与 chat.js 一致）
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
  // 创建中间输入框等元素
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
  // “The puzzle” 输入区
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
  // “The whole Story” 输入区
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
  // Submit 按钮
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
  // Submit 事件：POST 数据
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
        puzzleInput.value = "";
        storyInput.value = "";
      })
      .catch(err => {
        alert("Error submitting puzzle: " + err.message);
      });
  });
  
  // ---------------------------
  // 根据主题更新样式
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
