document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------
  // 创建头部区域
  // ---------------------------
  const header = document.createElement("header");
  header.style.cssText = `
    position: relative;
    width: 100%;
    height: 60px;
    /* 不使用分割线 */
    /* border-bottom: 1px solid #ccc; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  `;
  
  // 左上角：使用 home 图标替代返回文字
  const homeIcon = document.createElement("img");
  homeIcon.className = "home-icon";
  homeIcon.id = "homeIcon";
  homeIcon.src = "../icon/home.png"; // home icon
  homeIcon.alt = "主页";
  homeIcon.style.cssText = `
    width: 64px;
    height: 64px;
    cursor: pointer;
    border: none;
    outline: none;
    background-color: transparent;
    display: block;
  `;
  header.appendChild(homeIcon);
  
  // 右上角：主题切换图标
  const themeToggle = document.createElement("img");
  themeToggle.className = "theme-toggle";
  themeToggle.id = "themeToggle";
  themeToggle.src = "../icon/moon.png"; // 初始为月亮图标
  themeToggle.alt = "切换主题";
  themeToggle.style.cssText = `
    width: 64px;
    height: 64px;
    cursor: pointer;
    border: none;
    outline: none;
    background-color: transparent;
    display: block;
  `;
  header.appendChild(themeToggle);
  document.body.appendChild(header);
  
  // ---------------------------
  // 创建聊天内容区域
  // ---------------------------
  const chatContainer = document.createElement("div");
  chatContainer.id = "chatContainer";
  chatContainer.className = "chat-container";
  chatContainer.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background-color: #f9f9f9;
  `;
  document.body.appendChild(chatContainer);
  
  // ---------------------------
  // 创建输入区域
  // ---------------------------
  const inputArea = document.createElement("div");
  inputArea.className = "input-area";
  inputArea.style.cssText = `
    padding: 10px 20px;
    /* 不使用顶部边框 */
    /* border-top: 1px solid #ccc; */
    display: flex;
    align-items: center;
  `;
  
  // 使用 contenteditable 的 div 作为输入框
  const composer = document.createElement("div");
  composer.id = "composer-background";
  composer.setAttribute("contenteditable", "true");
  composer.setAttribute("data-placeholder", "询问任何问题");
  composer.style.cssText = `
    flex: 1;
    min-height: 44px;
    max-height: 25vh;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 1.5rem;
    padding: 10px 14px;
    background-color: #fff;
    transition: background-color 0.3s, border-color 0.3s;
    outline: none; /* 去除聚焦时蓝色边框 */
    font-size: 16px;
    color: inherit;
  `;
  inputArea.appendChild(composer);
  document.body.appendChild(inputArea);
  
  // ---------------------------
  // 主页导航：点击 home 图标返回主页
  // ---------------------------
  homeIcon.addEventListener("click", () => {
    window.location.href = "index.html"; // 根据实际路径调整
  });
  
  // ---------------------------
  // 主题切换逻辑
  // ---------------------------
  let isDarkMode = false;
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    isDarkMode = !isDarkMode;
    // 通过 CSS filter 实现图标颜色反转
    // 同时切换 home 图标也采用 filter 反转（可在 CSS 中统一处理）
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
    // 更新输入框
    if (document.body.classList.contains("dark-mode")) {
      composer.style.backgroundColor = "#303030";
      composer.style.borderColor = "#555";
      composer.style.color = "#fff";
      // 聊天内容背景
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
      
      // 伪代码：调用后端 API 获取回复
      /*
      fetch('/api/getReply', {
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
      */
      
      // 模拟回复
      setTimeout(() => {
        addChatMessage("这是模拟回复内容。", "bot");
      }, 500);
    }
  }
  
  // ---------------------------
  // 动态添加聊天消息
  // ---------------------------
  function addChatMessage(message, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message", sender);
    msgDiv.textContent = message;
    
    // 根据 sender 设置背景颜色和对齐方式：
    // 用户消息（输入）居右，系统消息居左。
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
