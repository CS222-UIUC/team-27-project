import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import OpenAI from "openai";
import db from "./db/db.js";  // SQLite database setup

const app  = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Serve static assets from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming JSON request bodies
app.use(bodyParser.json());

// Route for root path, serving index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---------------------------------------------
// OpenAI-based Turtle Soup game logic
// ---------------------------------------------

const OPENAI_API_KEY = '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';
const openaiClient   = new OpenAI({ apiKey: OPENAI_API_KEY });

// In-memory conversation history (demo use only)
let conversationHistory = [
  { role: "system", content:
      "You are the 'Turtle Soup Master' hosting a game of logical deduction.\n" +
      "Your primary language is English unless the user speaks otherwise.\n" +
      "Instructions:\n" +
      "1. Provide a seemingly absurd surface story with a hidden logical explanation.\n" +
      "2. Guide the player by answering Yes/No/Irrelevant to their questions.\n" +
      "3. Give hints when necessary, and reveal the full story once key logic is guessed.\n" +
      "4. Maintain a tone of suspense, mystery, and dark humor.\n" +
      "Please greet the player and ask which tone/style they'd like to play."
  }
];

// Currently loaded puzzle (hidden solution)
let currentPuzzle = null;

// Check if the user input indicates database mode
function isDBMode(message) {
  return /(?:数据库|标签[:：]?\s*[\w\u4e00-\u9fa5]+|tag[:：]?\s*[\w\u4e00-\u9fa5]+|#\w+)/i.test(message);
}

// Extract tag from user message
function extractTag(message) {
  const hashMatch = message.match(/#([\w\u4e00-\u9fa5]+)/);
  if (hashMatch) return hashMatch[1];
  const keyMatch = message.match(/(?:标签|tag)[:：]?\s*([\w\u4e00-\u9fa5]+)/i);
  if (keyMatch) return keyMatch[1];
  return null;
}

// Check if text contains Chinese characters
function isChineseText(text) {
  return /[\u4e00-\u9fa5]/.test(text);
}

// Check if user is asking to reveal the solution
function wantSolution(msg) {
  return /(答案|真相|solution|reveal|tell me the answer)/i.test(msg);
}

// ---------------------------------------------
// API endpoint for chat interaction
// ---------------------------------------------
app.post('/api/getReply', async (req, res) => {
  const userMessage = req.body.question;

  // Reveal solution if requested
  if (currentPuzzle && wantSolution(userMessage)) {
    const answer = currentPuzzle.lang === 'zh'
      ? `完整答案：${currentPuzzle.solution}`
      : `Solution: ${currentPuzzle.solution}`;
    currentPuzzle = null;
    conversationHistory = [conversationHistory[0]];
    return res.json({ reply: answer });
  }

  // Branch: retrieve puzzle from database
  if (isDBMode(userMessage)) {
    const wantedTag = extractTag(userMessage);
    const sql = wantedTag
      ? `SELECT * FROM puzzles WHERE tags LIKE ? ORDER BY RANDOM() LIMIT 1`
      : `SELECT * FROM puzzles ORDER BY RANDOM() LIMIT 1`;
    const params = wantedTag ? [`%${wantedTag}%`] : [];

    db.get(sql, params, async (err, row) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ reply: 'Database query failed' });
      }
      if (!row) {
        return res.json({ reply: 'No matching puzzle found in database' });
      }

      // Language detection: use Chinese if user input is in Chinese
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
          console.error("Translation failed:", e);
          sendToUser = `Title: ${row.title}\nPuzzle: ${row.description}`;
        }
        hiddenSolution = row.solution;
        langMark       = 'en';
      }

      // Reset conversation history and inject hidden solution
      conversationHistory = [
        conversationHistory[0],
        { role: "system", content:
            `[HiddenSolution]\n${hiddenSolution}\n\n` +
            `Until the player guesses the key mechanism, only answer with Yes/No/Irrelevant.` +
            `Once the key logic is guessed, reveal the full solution.`
        }
      ];
      currentPuzzle = { solution: hiddenSolution, lang: langMark };
      return res.json({ reply: sendToUser });
    });

    return;
  }

  // Default behavior: continue conversation
  conversationHistory.push({ role: "user", content: userMessage });
  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: conversationHistory,
    });
    const reply = response.choices[0].message.content;
    conversationHistory.push({ role: "assistant", content: reply });

    // Limit max history length
    const maxHistory = 50;
    if (conversationHistory.length > maxHistory) {
      conversationHistory = [conversationHistory[0], ...conversationHistory.slice(-maxHistory + 1)];
    }

    res.json({ reply });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: 'Failed to call OpenAI API' });
  }
});

// ---------------------------------------------
// Puzzle submission endpoint
// ---------------------------------------------
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
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ id: this.lastID, message: "Puzzle saved" });
    }
  );
});

// ---------------------------------------------
// Puzzle retrieval endpoint (optionally filtered by tag)
// ---------------------------------------------
app.get('/api/puzzles', (req, res) => {
  const { tag } = req.query;
  let sql = `SELECT * FROM puzzles `;
  const params = [];
  if (tag) {
    sql += `WHERE tags LIKE ? `;
    params.push(`%${tag}%`);
  }
  sql += `ORDER BY created_at DESC`;
  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

// ---------------------------------------------
// Start the server
// ---------------------------------------------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
