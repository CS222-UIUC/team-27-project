document.addEventListener("DOMContentLoaded", () => {
  // 创建主题切换图标（右上角）
  const themeToggle = document.createElement("img");
  themeToggle.src = "../icon/moon.png"; // 初始为月亮图标
  themeToggle.alt = "Toggle Theme";
  themeToggle.className = "theme-toggle";
  themeToggle.id = "themeToggle";
  document.body.appendChild(themeToggle);

  // 创建整体容器（内容向上移动，与 main 的样式保持一致）
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
  // 绑定 Play 按钮点击事件，跳转到聊天页面（chat.html）
  btnPlay.addEventListener("click", () => {
    window.location.href = "../html/chat.html";
  });

  // 创建按钮 Create One
  const btnCreate = document.createElement("button");
  btnCreate.textContent = "Create One";
  buttonContainer.appendChild(btnCreate);
  btnCreate.addEventListener("click", () => {
    window.location.href = "../html/create.html";
  });

  // 主题切换逻辑：切换 dark-mode 类，并根据状态更改图标
  let isDarkMode = false;
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      themeToggle.src = "../icon/sun.png";
    } else {
      themeToggle.src = "../icon/moon.png";
    }
  });
});
