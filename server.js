import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import OpenAI from "openai";
import db from "./db/db.js";  // Your existing db.js file for SQLite setup

const app   = express();
const port  = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

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

const OPENAI_API_KEY = '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';
const openaiClient   = new OpenAI({ apiKey: OPENAI_API_KEY });

// 存储对话上下文（全局变量，demo 用；生产环境建议使用其他会话管理方式）
let conversationHistory = [
  { role: "system", content:
      "你现在扮演“海龟汤大师”，负责主持与裁判“海龟汤”游戏。\n" +
      "你的第一语言是英语，除非用户尝试用其他语言和你交流。\n" +
      "你的职责如下：\n" +
      "1. 提供看似荒诞的‘谎面’，背后隐藏合理的故事；\n" +
      "2. 引导玩家通过提问猜测逐步还原真相；\n" +
      "3. 你会根据玩家提问回答“是”、“否”或“不相关”，必要时补充提示；\n" +
      "4. 风格偏向悬疑、惊悚、反转和黑色幽默；\n" +
      "5. 当玩家准确猜出关键线索（例如电话铃声暴露位置）时，请**立即揭晓完整答案**并结束本局游戏。\n" +
      "请先向玩家打个招呼并问他们希望以什么风格开始游戏。"
  }
];

// 记录当前抽出的谜题（隐藏解答）
let currentPuzzle = null;

// ---------- 判断是否进入“数据库”模式 只在用户提到“数据库”或“标签/tag/#”时触发 ----------
function isDBMode(message) {
  return /(?:数据库|标签[:：]?\s*[\w\u4e00-\u9fa5]+|tag[:：]?\s*[\w\u4e00-\u9fa5]+|#\w+)/i.test(message);
}

// ---------- 从用户消息里提取标签 支持 "#红汤"/"标签红汤"/"标签:红汤"/"tag:红汤" ----------
function extractTag(message) {
  const hashMatch = message.match(/#([\w\u4e00-\u9fa5]+)/);
  if (hashMatch) return hashMatch[1];
  const keyMatch = message.match(/(?:标签|tag)[:：]?\s*([\w\u4e00-\u9fa5]+)/i);
  if (keyMatch) return keyMatch[1];
  return null;
}

// ---------- 检测文本是否含中文 ----------
function isChineseText(text) {
  return /[\u4e00-\u9fa5]/.test(text);
}

// ---------- 检测是否为玩家请求揭晓真相/答案 ----------
function wantSolution(msg) {
  return /(答案|真相|solution|reveal|tell me the answer)/i.test(msg);
}

// --------------------------------------------
app.post('/api/getReply', async (req, res) => {
  const userMessage = req.body.question;

  // --- 若正在进行的谜题，且玩家请求“答案”则直接揭晓 ---
  if (currentPuzzle && wantSolution(userMessage)) {
    const answer = currentPuzzle.lang === 'zh'
      ? `完整答案：${currentPuzzle.solution}`
      : `Solution: ${currentPuzzle.solution}`;
    currentPuzzle = null;
    conversationHistory = [conversationHistory[0]];
    return res.json({ reply: answer });
  }

  // --- 判断是否走“数据库取题”分支 ---
  if (isDBMode(userMessage)) {
    const wantedTag = extractTag(userMessage);
    const sql = wantedTag
      ? `SELECT * FROM puzzles WHERE tags LIKE ? ORDER BY RANDOM() LIMIT 1`
      : `SELECT * FROM puzzles ORDER BY RANDOM() LIMIT 1`;
    const params = wantedTag ? [`%${wantedTag}%`] : [];

    db.get(sql, params, async (err, row) => {
      if (err) {
        console.error("数据库查询错误:", err);
        return res.status(500).json({ reply: '数据库查询时出错' });
      }
      if (!row) {
        return res.json({ reply: '数据库中未找到任何符合条件的海龟汤' });
      }

      // 语言感知：中文环境直接返回，否则先翻译 Title+Puzzle
      const wantZh = isChineseText(userMessage);
      let sendToUser, hiddenSolution, langMark;

      if (wantZh) {
        sendToUser     = `标题：${row.title}\n汤面：${row.description}`;
        hiddenSolution = row.solution;
        langMark       = 'zh';
      } else {
        try {
          const trPrompt = [
            { role: "system", content: "You are a concise, suspenseful translator." },
            { role: "user", content:
                `Translate the following Turtle Soup title and puzzle into natural English, keep it concise:\n` +
                `Title: ${row.title}\nPuzzle: ${row.description}\n\n` +
                `Return ONLY the translated title and puzzle.`
            }
          ];
          const trRes = await openaiClient.chat.completions.create({
            model: "gpt-4o",
            messages: trPrompt,
          });
          sendToUser = trRes.choices[0].message.content.trim();
        } catch (e) {
          console.error("翻译失败:", e);
          sendToUser = `Title: ${row.title}\nPuzzle: ${row.description}`;
        }
        hiddenSolution = row.solution;
        langMark       = 'en';
      }

      // 重置对话历史，插入隐藏解答 system
      conversationHistory = [
        conversationHistory[0],
        { role: "system", content:
            `[HiddenSolution]\n${hiddenSolution}\n\n` +
            `在玩家揭晓前，只能以“是/否/不相关”回答，必要时给提示线索；` +
            `当玩家完全猜中关键机制后，请直接揭晓完整答案。`
        }
      ];
      currentPuzzle = { solution: hiddenSolution, lang: langMark };
      return res.json({ reply: sendToUser });
    });

    return;
  }

  // --- 默认：正常对话 / 提问阶段 ---
  conversationHistory.push({ role: "user", content: userMessage });
  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: conversationHistory,
    });
    const reply = response.choices[0].message.content;
    conversationHistory.push({ role: "assistant", content: reply });

    // 限制历史长度
    const maxHistory = 50;
    if (conversationHistory.length > maxHistory) {
      conversationHistory = [conversationHistory[0], ...conversationHistory.slice(-maxHistory+1)];
    }

    res.json({ reply });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: '调用 OpenAI API 时出错' });
  }
});

// ------------------------
// Puzzle 上传部分（保持不变）
// ------------------------

app.post('/api/puzzles', (req, res) => {
  const { titleInput, puzzleInput, storyInput, tags } = req.body;
  if (!titleInput || !puzzleInput || !storyInput) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const tagsStr = Array.isArray(tags) ? tags.join(',') : '';
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
