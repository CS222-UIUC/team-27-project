import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

// 设置根路径为 index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(bodyParser.json());

const OPENAI_API_KEY = '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'; // 请替换为你的真实 API KEY
const client = new OpenAI({ apiKey: OPENAI_API_KEY });

// 存储对话上下文
let conversationHistory = [
  { role: "system", content: "你现在扮演“海龟汤大师”，负责主持与裁判“海龟汤”游戏。你的职责如下：\n1. 提供看似荒诞的‘谎面’，背后隐藏合理的故事；\n2. 引导玩家通过提问猜测逐步还原真相；\n3. 你只能回答‘是’、‘否’或‘不相关’，必要时补充提示；\n4. 风格偏向悬疑、惊悚、反转和黑色幽默；\n请先向玩家打个招呼并问他们希望以什么风格开始游戏。" }
];

app.post('/api/getReply', async (req, res) => {
  const userMessage = req.body.question;

  // 如果是首次对话，可以先发出问候
  if (conversationHistory.length === 1) {
    // 先添加 AI 的初始问候
    const initialGreeting = "欢迎来到海龟汤游戏，我是海龟汤大师。今天你想以哪种风格开始？冷案、密室、都市怪谈还是其他？";
    conversationHistory.push({ role: "assistant", content: initialGreeting });
    return res.json({ reply: initialGreeting });
  }

  conversationHistory.push({ role: "user", content: userMessage });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: conversationHistory,
    });

    const reply = response.choices[0].message.content;

    // 将助手的回答加入到历史中，便于后续上下文
    conversationHistory.push({ role: "assistant", content: reply });

    // 控制对话历史长度，避免 token 超限
    const maxHistoryLength = 50;
    if (conversationHistory.length > maxHistoryLength) {
      conversationHistory = [conversationHistory[0], ...conversationHistory.slice(-maxHistoryLength + 1)];
    }

    res.json({ reply });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: '调用 OpenAI API 时出错' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});