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
  { role: "system", content: "你是一个友好而专业的助手。" }
];

app.post('/api/getReply', async (req, res) => {
  const userMessage = req.body.question;

  conversationHistory.push({ role: "user", content: userMessage });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: conversationHistory,
    });

    const reply = response.choices[0].message.content;

    // 将助手的回答加入到历史中，便于后续上下文
    conversationHistory.push({ role: "assistant", content: reply });

    // 控制对话历史长度，避免token超限
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
