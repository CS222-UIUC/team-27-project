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


const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db/db"); // 引入数据库初始化模块
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

// 示例 API：获取所有谜题
app.get("/api/puzzles", (req, res) => {
  db.all("SELECT * FROM puzzles", (err, rows) => {
    if (err) {
      res.status(500).json({ error: "获取谜题出错" });
    } else {
      res.json(rows);
    }
  });
});

// 示例 API：添加新的谜题
app.post("/api/puzzles", (req, res) => {
  const { title, description, solution, difficulty } = req.body;
  const sql = `INSERT INTO puzzles (title, description, solution, difficulty) VALUES (?, ?, ?, ?)`;
  db.run(sql, [title, description, solution, difficulty || 1], function(err) {
    if (err) {
      res.status(500).json({ error: "添加谜题出错" });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

// 示例 API：添加标签并关联到某个谜题
app.post("/api/puzzle/:puzzleId/tags", (req, res) => {
  const { puzzleId } = req.params;
  const { tag } = req.body;
  if (!tag) {
    return res.status(400).json({ error: "tag不能为空" });
  }

  // 首先检查标签是否存在，不存在则插入
  db.get("SELECT id FROM tags WHERE name = ?", [tag], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "查询标签出错" });
    }
    if (row) {
      // 如果标签已存在，直接建立关联
      const tagId = row.id;
      insertPuzzleTag(puzzleId, tagId, res);
    } else {
      // 插入新标签
      db.run("INSERT INTO tags (name) VALUES (?)", [tag], function(err) {
        if (err) {
          return res.status(500).json({ error: "添加标签出错" });
        }
        const tagId = this.lastID;
        insertPuzzleTag(puzzleId, tagId, res);
      });
    }
  });
});

// 辅助函数：在 puzzle_tags 表中插入关联记录
function insertPuzzleTag(puzzleId, tagId, res) {
  db.run("INSERT INTO puzzle_tags (puzzle_id, tag_id) VALUES (?, ?)", [puzzleId, tagId], function(err) {
    if (err) {
      res.status(500).json({ error: "关联标签出错" });
    } else {
      res.json({ message: "标签已添加" });
    }
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
