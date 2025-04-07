import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 使用 express.static 提供静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 可选：设置根路径为 index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

import bodyParser from "body-parser";
import fetch from "node-fetch";
import OpenAI from "openai";

const OPENAI_API_KEY = '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'

app.use(bodyParser.json());

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

// POST 接口，接收前端发送的消息
app.post('/api/getReply', async (req, res) => {
  const userMessage = req.body.question;
  try {
    // 调用 OpenAI 的 ChatGPT API
    const response = await client.chat.completions.create({
      model: "gpt-4o", // 或者使用 "gpt-4"
      messages: [
        { role: "system", content: "" },
        { role: "user", content: userMessage }
      ]
    });
    
    // 从返回结果中提取回复内容
    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: '调用 OpenAI API 时出错' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
