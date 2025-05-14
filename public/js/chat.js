document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------
  // Create top two buttons: Home and Theme Toggle
  // ---------------------------

  // Home icon button (top-left)
  const homeIcon = document.createElement("img");
  homeIcon.className = "top-button home-button";
  homeIcon.id = "homeIcon";
  homeIcon.src = "../icon/home.png"; // home icon
  homeIcon.alt = "Home";
  document.body.appendChild(homeIcon);
  
  // Theme toggle icon button (top-right)
  const themeToggle = document.createElement("img");
  themeToggle.className = "top-button theme-toggle";
  themeToggle.id = "themeToggle";
  // Icon source will be set below based on localStorage
  themeToggle.alt = "Toggle Theme";
  document.body.appendChild(themeToggle);
  
  // ---------------------------
  // Create chat content area
  // ---------------------------
  const chatContainer = document.createElement("div");
  chatContainer.id = "chatContainer";
  chatContainer.className = "chat-container";
  document.body.appendChild(chatContainer);
  
  // ---------------------------
  // Create input area
  // ---------------------------
  const inputArea = document.createElement("div");
  inputArea.className = "input-area";
  document.body.appendChild(inputArea);
  
  // Use a contenteditable div as the input box
  const composer = document.createElement("div");
  composer.id = "composer-background";
  composer.setAttribute("contenteditable", "true");
  composer.setAttribute("data-placeholder", "Ask anything");
  inputArea.appendChild(composer);
  
  // ---------------------------
  // Home navigation: click home icon to return to homepage
  // ---------------------------
  homeIcon.addEventListener("click", () => {
    window.location.href = "../index.html"; // Adjust path as needed
  });
  
  // ---------------------------
  // Initialize theme state (stored in localStorage to persist across pages)
  // ---------------------------
  const savedTheme = localStorage.getItem("theme");
  let isDarkMode = false;
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    isDarkMode = true;
  } else {
    isDarkMode = false;
  }
  // Set theme icon and home icon styling to match main.js logic
  themeToggle.src = isDarkMode ? "../icon/sun.png" : "../icon/moon.png";
  homeIcon.style.filter = isDarkMode ? "brightness(0) invert(1)" : "none";
  themeToggle.style.filter = isDarkMode ? "brightness(0) invert(1)" : "none";
  
  // ---------------------------
  // Theme toggle logic
  // ---------------------------
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    isDarkMode = !isDarkMode;
    // Update icons and save the theme in localStorage
    if (isDarkMode) {
      themeToggle.src = "../icon/sun.png";
      homeIcon.style.filter = "brightness(0) invert(1)";
      themeToggle.style.filter = "brightness(0) invert(1)";
      localStorage.setItem("theme", "dark");
    } else {
      themeToggle.src = "../icon/moon.png";
      homeIcon.style.filter = "none";
      themeToggle.style.filter = "none";
      localStorage.setItem("theme", "light");
    }
    updateStylesForMode();
  });
  
  function updateStylesForMode() {
    // Update input and chat area styles based on theme
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
  // Paste event: only allow plain text
  // ---------------------------
  composer.addEventListener("paste", (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text/plain");
    document.execCommand("insertText", false, text);
  });
  
  // ---------------------------
  // Handle Chinese IME composition state
  // ---------------------------
  let isComposing = false;
  composer.addEventListener("compositionstart", () => {
    isComposing = true;
  });
  composer.addEventListener("compositionend", () => {
    isComposing = false;
  });
  
  // ---------------------------
  // Global flag: whether waiting for AI response
  // ---------------------------
  let isWaiting = false;
  
  // ---------------------------
  // Enter key listener (submit message unless Shift+Enter or composing)
  // ---------------------------
  composer.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // ---------------------------
  // Message sending logic
  // ---------------------------
  function sendMessage() {
    // Do nothing if already waiting for reply
    if (isWaiting) return;

    const text = composer.innerText.trim();
    if (text !== "") {
      addChatMessage(text, "user");
      composer.innerHTML = ""; // Clear input box
      isWaiting = true; // Set waiting flag

      fetch('http://localhost:3000/api/getReply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text })
      })
      .then(response => response.json())
      .then(data => {
        addChatMessage(data.reply, "bot");
        isWaiting = false; // Clear waiting flag on success
      })
      .catch(error => {
        console.error("Error:", error);
        isWaiting = false; // Also clear waiting flag on error
      });
    }
  }
  
  // ---------------------------
  // Dynamically add chat messages
  // ---------------------------
  function addChatMessage(message, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message", sender);
    msgDiv.style.whiteSpace = 'pre-wrap';
    msgDiv.textContent = message;
    
    // Align bubble based on sender:  
    // user message to right; bot message to left
    if (sender === "user") {
      if (document.body.classList.contains("dark-mode")) {
        msgDiv.style.backgroundColor = "#444"; // dark gray
        msgDiv.style.color = "#fff";
      } else {
        msgDiv.style.backgroundColor = "#f0f0f0"; // light gray
        msgDiv.style.color = "#000";
      }
      msgDiv.style.alignSelf = "flex-end";
    } else {
      if (document.body.classList.contains("dark-mode")) {
        msgDiv.style.backgroundColor = "#000"; // black
        msgDiv.style.color = "#fff";
      } else {
        msgDiv.style.backgroundColor = "#fff"; // white
        msgDiv.style.color = "#000";
      }
      msgDiv.style.alignSelf = "flex-start";
    }
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  
  // ---------------------------
  // Initialize chat with greeting from bot
  // ---------------------------
  function initializeChat() {
    fetch('http://localhost:3000/api/getReply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: "" })
    })
    .then(response => response.json())
    .then(data => {
      addChatMessage(data.reply, "bot");
    })
    .catch(error => {
      console.error("Error initializing chat:", error);
    });
  }
  
  // Call initialization after page is loaded
  initializeChat();
});
