// db/db.js
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// 计算 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 指定数据库文件路径（如果文件不存在，SQLite 会自动创建）
const dbPath = path.resolve(__dirname, 'database.db');

// 直接创建数据库连接，不使用 verbose
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("数据库连接错误:", err);
  } else {
    console.log("成功连接到 SQLite 数据库。");
  }
});

// 初始化数据库，创建相关表
db.serialize(() => {
  // 创建 puzzles 表
  db.run(`
    CREATE TABLE IF NOT EXISTS puzzles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      solution TEXT NOT NULL,
      difficulty INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error("创建 puzzles 表出错:", err);
    else console.log("puzzles 表已就绪");
  });

  // 创建 tags 表
  db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `, (err) => {
    if (err) console.error("创建 tags 表出错:", err);
    else console.log("tags 表已就绪");
  });

  // 创建 puzzle_tags 关联表
  db.run(`
    CREATE TABLE IF NOT EXISTS puzzle_tags (
      puzzle_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (puzzle_id, tag_id),
      FOREIGN KEY (puzzle_id) REFERENCES puzzles(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) console.error("创建 puzzle_tags 表出错:", err);
    else console.log("puzzle_tags 表已就绪");
  });
});

export default db;
