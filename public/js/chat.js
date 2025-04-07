document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------
  // 创建顶部两个按钮：home 与主题切换
  // ---------------------------
  // Home 图标按钮（左上角）
  const homeIcon = document.createElement("img");
  homeIcon.className = "top-button home-button";
  homeIcon.id = "homeIcon";
  homeIcon.src = "../icon/home.png"; // home icon
  homeIcon.alt = "主页";
  document.body.appendChild(homeIcon);
  
  // 主题切换图标按钮（右上角）
  const themeToggle = document.createElement("img");
  themeToggle.className = "top-button theme-toggle";
  themeToggle.id = "themeToggle";
  themeToggle.src = "../icon/moon.png"; // 初始为月亮图标
  themeToggle.alt = "切换主题";
  document.body.appendChild(themeToggle);
  
  // ---------------------------
  // 创建聊天内容区域
  // ---------------------------
  const chatContainer = document.createElement("div");
  chatContainer.id = "chatContainer";
  chatContainer.className = "chat-container";
  document.body.appendChild(chatContainer);
  
  // ---------------------------
  // 创建输入区域
  // ---------------------------
  const inputArea = document.createElement("div");
  inputArea.className = "input-area";
  document.body.appendChild(inputArea);
  
  // 使用 contenteditable 的 div 作为输入框
  const composer = document.createElement("div");
  composer.id = "composer-background";
  composer.setAttribute("contenteditable", "true");
  composer.setAttribute("data-placeholder", "询问任何问题");
  inputArea.appendChild(composer);
  
  // ---------------------------
  // 主页导航：点击 home 图标返回主页
  // ---------------------------
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
  
  function updateStylesForMode() {
    // 更新输入区域样式
    if (document.body.classList.contains("dark-mode")) {
      composer.style.backgroundColor = "#303030";
      composer.style.borderColor = "#555";
      composer.style.color = "#fff";
      chatContainer.style.backgroundColor = "#222";
    } else {
      composer.style.backgroundColor = "#fff";
      composer.style.borderColor = "#ccc";
      composer.style.color = "#000";
      chatContainer.style.backgroundColor = "#f9f9f9";
    }
  }
  updateStylesForMode();
  
  // ---------------------------
  // 粘贴事件：只插入纯文本
  // ---------------------------
  composer.addEventListener("paste", (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text/plain");
    document.execCommand("insertText", false, text);
  });
  
  // ---------------------------
  // 处理中文输入法组合状态
  // ---------------------------
  let isComposing = false;
  composer.addEventListener("compositionstart", () => {
    isComposing = true;
  });
  composer.addEventListener("compositionend", () => {
    isComposing = false;
  });
  
  // ---------------------------
  // 回车键监听（非 Shift+Enter 且非组合状态下提交消息）
  // ---------------------------
  composer.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // ---------------------------
  // 发送消息逻辑
  // ---------------------------
  function sendMessage() {
    const text = composer.innerText.trim();
    if (text !== "") {
      addChatMessage(text, "user");
      composer.innerHTML = ""; // 清空输入框
      fetch('http://localhost:3000/api/getReply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text })
      })
      .then(response => response.json())
      .then(data => {
        addChatMessage(data.reply, "bot");
      })
      .catch(error => {
        console.error("Error:", error);
      });
      // 模拟回复（此处可替换为实际调用后端 API 的逻辑）
      // setTimeout(() => {
      //   addChatMessage("这是模拟回复内容。", "bot");
      // }, 500);
    }
  }
  
  // ---------------------------
  // 动态添加聊天消息
  // ---------------------------
  function addChatMessage(message, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message", sender);
    msgDiv.textContent = message;
    
    // 根据 sender 设置气泡位置：  
    // 用户消息气泡置右；系统消息气泡置中
    if (sender === "user") {
      if (document.body.classList.contains("dark-mode")) {
        msgDiv.style.backgroundColor = "#444"; // 深灰色
        msgDiv.style.color = "#fff";
      } else {
        msgDiv.style.backgroundColor = "#f0f0f0"; // 浅灰色
        msgDiv.style.color = "#000";
      }
      msgDiv.style.alignSelf = "flex-end";
    } else {
      if (document.body.classList.contains("dark-mode")) {
        msgDiv.style.backgroundColor = "#000"; // 黑色
        msgDiv.style.color = "#fff";
      } else {
        msgDiv.style.backgroundColor = "#fff"; // 白色
        msgDiv.style.color = "#000";
      }
      msgDiv.style.alignSelf = "flex-start";
    }
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
});