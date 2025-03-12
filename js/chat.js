// 文件路径: team-27-project/js/chat.js

document.addEventListener("DOMContentLoaded", () => {
  // 示例：创建一个返回主页的按钮
  const backBtn = document.createElement("button");
  backBtn.textContent = "← Home";
  backBtn.style.margin = "10px";
  backBtn.addEventListener("click", () => {
    window.location.href = "./index.html"; 
  });
  document.body.appendChild(backBtn);

  // 聊天容器
  const chatContainer = document.createElement("div");
  chatContainer.style.display = "flex";
  chatContainer.style.flexDirection = "column";
  chatContainer.style.height = "80vh";
  chatContainer.style.overflowY = "auto";
  chatContainer.style.margin = "0 20px";
  document.body.appendChild(chatContainer);

  // 输入区域
  const inputArea = document.createElement("div");
  inputArea.style.display = "flex";
  inputArea.style.borderTop = "1px solid #ccc";
  inputArea.style.padding = "10px";

  const chatInput = document.createElement("input");
  chatInput.type = "text";
  chatInput.placeholder = "Ask your riddle...";
  chatInput.style.flex = "1";
  chatInput.style.marginRight = "10px";

  const sendBtn = document.createElement("button");
  sendBtn.textContent = "Send";

  inputArea.appendChild(chatInput);
  inputArea.appendChild(sendBtn);
  document.body.appendChild(inputArea);

  // 发送消息示例
  sendBtn.addEventListener("click", () => {
    const userText = chatInput.value.trim();
    if (userText) {
      appendMessage(userText, "user");
      chatInput.value = "";

      // 模拟回复
      setTimeout(() => {
        appendMessage("Mock response from 'bot'.", "bot");
      }, 500);
    }
  });

  function appendMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.textContent = text;
    msgDiv.style.margin = "5px 0";
    msgDiv.style.padding = "10px 15px";
    msgDiv.style.borderRadius = "8px";
    msgDiv.style.maxWidth = "60%";
    if (sender === "user") {
      msgDiv.style.alignSelf = "flex-end";
      msgDiv.style.backgroundColor = "#cde8ff";
    } else {
      msgDiv.style.alignSelf = "flex-start";
      msgDiv.style.backgroundColor = "#eee";
    }
    chatContainer.appendChild(msgDiv);
    // 滚动到底
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
});
