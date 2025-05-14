document.addEventListener("DOMContentLoaded", () => {
  // 1) 读取 localStorage 中的主题值，设置界面
  const savedTheme = localStorage.getItem("theme");
  let isDarkMode = false;
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    isDarkMode = true;
  } else {
    isDarkMode = false;
  }

  // 2) 根据是否暗色模式来决定初始图标
  const themeToggle = document.createElement("img");
  themeToggle.alt = "Toggle Theme";
  themeToggle.className = "theme-toggle";
  themeToggle.id = "themeToggle";
  themeToggle.src = isDarkMode ? "../icon/sun.png" : "../icon/moon.png";

  document.body.appendChild(themeToggle);

  // 3) 在主题切换时，同时更新 localStorage
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

});
