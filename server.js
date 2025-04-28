import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import OpenAI from "openai";
import db from "./db/db.js";  // Your existing db.js file for SQLite setup

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public directory.
app.use(express.static(path.join(__dirname, 'public')));

// Use body-parser middleware to parse JSON request bodies.
app.use(bodyParser.json());

// 默认根路径指向 public 目录下的 index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ------------------------
// OpenAI / 海龟汤 游戏部分
// ------------------------

const OPENAI_API_KEY = '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'; // Replace with your real API key in production!
const openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });

// 存储对话上下文（全局变量，demo用；生产环境建议使用其他会话管理方式）
let conversationHistory = [
  { role: "system", content: "你现在扮演“海龟汤大师”，负责主持与裁判“海龟汤”游戏。你的第一语言是英语，除非用户尝试用其他语言和你交流。你的职责如下：\n1. 提供看似荒诞的‘谎面’，背后隐藏合理的故事；\n2. 引导玩家通过提问猜测逐步还原真相；\n3. 你只能回答‘是’、‘否’或‘不相关’，必要时补充提示；\n4. 风格偏向悬疑、惊悚、反转和黑色幽默；\n请先向玩家打个招呼并问他们希望以什么风格开始游戏." }
];

// ---------- 新增：数据库模式识别函数 ----------
function isDBMode(message) {
  const patterns = [
    '数据库', '查询', 
    '经典', '经典的', '经典版', 'classic',
    'exist', 'exists', '存在的', 
    '网上的', 'on Internet',
    'tiktok', 'bilibili', '抖音', 'b站', 'video', '视频', 
    '烧脑', 'brain', 'brain teaser',
  ];
  const regex = new RegExp(patterns.join('|'), 'i');
  return regex.test(message);
}
// --------------------------------------------

app.post('/api/getReply', async (req, res) => {
  const userMessage = req.body.question;

  // --- 新增：判断是否进入“数据库”模式并随机查询 ---
  if (isDBMode(userMessage)) {
    db.get(`SELECT * FROM puzzles ORDER BY RANDOM() LIMIT 1`, [], (err, row) => {
      if (err) {
        console.error("数据库查询错误:", err);
        return res.status(500).json({ reply: '数据库查询时出错' });
      }
      if (row) {
        const reply = `这是一个从数据库中随机选出的海龟汤：\n标题: ${row.title}\n描述: ${row.description}\nTags: ${row.tags || '无'}`;
        return res.json({ reply });
      } else {
        return res.json({ reply: '数据库中未找到任何海龟汤' });
      }
    });
    return;
  }
  // --- 其余逻辑保持不变 ---
  // 若是首次对话，则先发出初始问候
  if (conversationHistory.length === 1) {
    const initialGreeting = "Welcome to the Turtle Soup game! I'm the Turtle Soup Master. Which genre would you like to start with today? Cold Case, Locked Room, Urban Tales, or something else? Also, do you want me to randomly generate a turtle soup line, or start a classic turtle soup line? \n欢迎来到海龟汤游戏！我是海龟汤大师。今天你想以哪种风格开始？冷案、密室、都市怪谈还是其他？另外，你希望我随机生成一条海龟汤，还是开始一条经典的海龟汤？";
    conversationHistory.push({ role: "assistant", content: initialGreeting });
    return res.json({ reply: initialGreeting });
  }

  // 将用户消息加入对话历史
  conversationHistory.push({ role: "user", content: userMessage });

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",  // Adjust the model if necessary
      messages: conversationHistory,
    });

    const reply = response.choices[0].message.content;
    conversationHistory.push({ role: "assistant", content: reply });

    // 为防止 token 超限，限制历史对话长度（保留系统初始消息）
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

// ------------------------
// Puzzle 上传部分
// ------------------------

// POST /api/puzzles：保存用户提交的 Puzzle（新增 titleInput 字段）
app.post('/api/puzzles', (req, res) => {
  const { titleInput, puzzleInput, storyInput, tags } = req.body;

  if (!titleInput || !puzzleInput || !storyInput) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // 将 tags 数组存为逗号分隔字符串
  const tagsStr = Array.isArray(tags) ? tags.join(',') : '';

  // puzzles 表需事先有 tags TEXT 字段
  db.run(
    `INSERT INTO puzzles (title, description, solution, tags) VALUES (?, ?, ?, ?)`,
    [titleInput, puzzleInput, storyInput, tagsStr],
    function(err) {
      if (err) {
        console.error("数据库错误:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ id: this.lastID, message: "Puzzle saved" });
    }
  );
});


// GET /api/puzzles：可按 ?tag=xxx 过滤
app.get('/api/puzzles', (req, res) => {
  const { tag } = req.query;

  let sql  = `SELECT * FROM puzzles `;
  const params = [];

  if (tag) {
    sql += `WHERE tags LIKE ? `;
    params.push(`%${tag}%`);
  }

  sql += `ORDER BY created_at DESC`;

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error("数据库错误:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
