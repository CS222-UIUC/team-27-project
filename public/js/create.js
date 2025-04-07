document.addEventListener("DOMContentLoaded", () => {
    // ---------------------------
    // 创建顶部两个按钮：home 与主题切换
    // ---------------------------
    // Home 图标按钮（左上角）
    const homeIcon = document.createElement("img");
    homeIcon.className = "top-button home-button";
    homeIcon.id = "homeIcon";
    homeIcon.src = "../icon/home.png";
    homeIcon.alt = "主页";
    document.body.appendChild(homeIcon);
  
    // 主题切换图标按钮（右上角）
    const themeToggle = document.createElement("img");
    themeToggle.className = "top-button theme-toggle";
    themeToggle.id = "themeToggle";
    themeToggle.src = "../icon/moon.png"; // 初始为月亮图标
    themeToggle.alt = "切换主题";
    document.body.appendChild(themeToggle);
  
    // 主页导航：点击 home 图标返回主页
    homeIcon.addEventListener("click", () => {
      window.location.href = "../index.html"; // 根据实际路径调整
    });
  
    // ---------------------------
    // 主题切换逻辑
    // ---------------------------
    let isDarkMode = false;
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      isDarkMode = !isDarkMode;
      // 通过 CSS filter 实现图标颜色反转，同时同步 home 图标
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
    // 创建中间的方框（类似表格的样式）
    // ---------------------------
    const puzzleBox = document.createElement("div");
    puzzleBox.id = "puzzleBox";
    // 设置方框样式
    puzzleBox.style.width = "400px";
    puzzleBox.style.margin = "50px auto"; // 居中并设置上边距
    puzzleBox.style.padding = "20px";
    puzzleBox.style.border = "1px solid #ccc";
    puzzleBox.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
    puzzleBox.style.display = "flex";
    puzzleBox.style.flexDirection = "column";
    puzzleBox.style.alignItems = "center";
    
    // 在方框最上面添加居中的标题
    const header = document.createElement("h2");
    header.textContent = "Create Your Own Puzzle";
    header.style.textAlign = "center";
    header.style.width = "100%";
    puzzleBox.appendChild(header);
    
    // 可选：添加一个内容区域，未来可用来放置拼图元素或其他内容
    const contentArea = document.createElement("div");
    contentArea.id = "puzzleContent";
    contentArea.style.width = "100%";
    contentArea.style.height = "200px"; // 示例高度
    contentArea.style.border = "1px solid #ddd";
    contentArea.style.margin = "20px 0";
    contentArea.style.display = "flex";
    contentArea.style.justifyContent = "center";
    contentArea.style.alignItems = "center";
    contentArea.textContent = "Puzzle content area";
    puzzleBox.appendChild(contentArea);
    
    // 创建 Submit 按钮，放在方框底部
    const submitButton = document.createElement("button");
    submitButton.id = "submitButton";
    submitButton.textContent = "Submit";
    submitButton.style.padding = "10px 20px";
    submitButton.style.fontSize = "16px";
    submitButton.style.cursor = "pointer";
    puzzleBox.appendChild(submitButton);
    
    // 将方框添加到页面
    document.body.appendChild(puzzleBox);
    
    // Submit 按钮点击事件处理
    submitButton.addEventListener("click", () => {
      alert("Puzzle submitted!");
    });
    
    // ---------------------------
    // 根据主题更新页面样式
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
    
    // 初始调用更新主题样式
    updateStylesForMode();
  });
  
  