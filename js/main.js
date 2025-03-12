document.addEventListener("DOMContentLoaded", () => {
  // 创建 style 标签并添加样式
  const style = document.createElement("style");
  style.textContent = `
    /* 基础样式 */
    body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
      background-color: #fff;
      color: #000;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s, color 0.3s;
    }
    /* 整体内容容器，向上移动 */
    .container {
      text-align: center;
      transform: translateY(-50px);
    }
    /* 顶部图标区域：放置在右上角，图标放大一倍 */
    .theme-toggle {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 64px;
      height: 64px;
      cursor: pointer;
      border: none;
      outline: none;
      background-color: transparent;
      display: block;
    }
    .theme-toggle:focus,
    .theme-toggle:active {
      outline: none;
    }
    /* 按钮容器：垂直排列并居中 */
    .button-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    /* 按钮样式（浅色模式下） */
    .button-container button {
      margin: 10px 0;
      padding: 12px 24px;
      font-size: 18px;
      cursor: pointer;
      background-color: #ddd;
      border: 2px solid #fff;
      border-radius: 4px;
      transition: background-color 0.3s, color 0.3s, border 0.3s;
      color: #000;
      width: 200px;
    }
    .button-container button:hover {
      background-color: #ccc;
    }
    h1 {
      margin-bottom: 10px;
    }
    p {
      margin-bottom: 30px;
    }
    /* 深色模式下的样式 */
    body.dark-mode {
      background-color: #000;
      color: #fff;
    }
    /* 深色模式下，图标颜色反转 */
    body.dark-mode .theme-toggle {
      filter: invert(1);
    }
    /* 深色模式下，按钮文字和背景、边框样式 */
    body.dark-mode .button-container button {
      color: #fff;
      background-color: #333;
      border: 2px solid #fff;
    }
    body.dark-mode .button-container button:hover {
      background-color: #555;
    }
  `;
  document.head.appendChild(style);

  // 创建主题切换图标
  const themeToggle = document.createElement("img");
  themeToggle.src = "../icon/moon.png"; // 初始为月亮图标
  themeToggle.alt = "Toggle Theme";
  themeToggle.className = "theme-toggle";
  themeToggle.id = "themeToggle";
  document.body.appendChild(themeToggle);

  // 创建整体容器
  const container = document.createElement("div");
  container.className = "container";
  document.body.appendChild(container);

  // 创建标题
  const h1 = document.createElement("h1");
  h1.textContent = "Turtle Soup Riddle";
  container.appendChild(h1);

  // 创建描述段落
  const p = document.createElement("p");
  p.textContent = "Ask yes/no questions to uncover the hidden story behind a mysterious scenario!";
  container.appendChild(p);

  // 创建按钮容器
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  container.appendChild(buttonContainer);

  // 创建按钮 Play
  const btnPlay = document.createElement("button");
  btnPlay.textContent = "Play";
  buttonContainer.appendChild(btnPlay);
  // 为 Play 按钮绑定点击事件，跳转到聊天页面（chat.html）
  btnPlay.addEventListener("click", () => {
    window.location.href = "chat.html";
  });

  // 创建按钮 Create One
  const btnCreate = document.createElement("button");
  btnCreate.textContent = "Create One";
  buttonContainer.appendChild(btnCreate);

  // 主题切换逻辑
  let isDarkMode = false; // 当前模式标记

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    isDarkMode = !isDarkMode;
    // 根据当前模式切换图标
    if (isDarkMode) {
      themeToggle.src = "../icon/sun.png";
    } else {
      themeToggle.src = "../icon/moon.png";
    }
  });
});
