// db.js
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Calculate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path (created automatically if it does not exist)
const dbPath = path.resolve(__dirname, 'database.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("数据库连接错误:", err);
  } else {
    console.log("成功连接到 SQLite 数据库。");
  }
});

// Initialize database, create tables if they do not exist
db.serialize(() => {
  // Create puzzles table
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

  // Create tags table
  db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `, (err) => {
    if (err) console.error("创建 tags 表出错:", err);
    else console.log("tags 表已就绪");
  });

  // Create puzzle_tags table
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
