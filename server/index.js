const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 3000;
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "password";
const DB_NAME = process.env.DB_NAME || "notes_app";

let db;

const DEFAULT_NOTE = {
  x: 100,
  y: 100,
  width: 360,
  height: 200,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const safeNumber = (value, fallback, min, max) => {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return fallback;

  return clamp(Math.round(numberValue), min, max);
};

const sanitizeNote = (note) => ({
  ...note,
  x: safeNumber(note.x, DEFAULT_NOTE.x, -2000, 5000),
  y: safeNumber(note.y, DEFAULT_NOTE.y, -2000, 5000),
  width: safeNumber(note.width, DEFAULT_NOTE.width, 360, 1600),
  height: safeNumber(note.height, DEFAULT_NOTE.height, 160, 1200),
  content: typeof note.content === "string" ? note.content : "",
});

app.use(
  cors({
    origin: ["http://localhost:5173"],
  }),
);
app.use(express.json());

async function setupDatabase() {
  const setupConnection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
  });

  await setupConnection.query(
    `CREATE DATABASE IF NOT EXISTS ${mysql.escapeId(DB_NAME)}`,
  );
  await setupConnection.end();

  db = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });

  await db.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id VARCHAR(36) PRIMARY KEY,
      x INT NOT NULL DEFAULT 100,
      y INT NOT NULL DEFAULT 100,
      width INT NOT NULL DEFAULT 300,
      height INT NOT NULL DEFAULT 200,
      content LONGTEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.query(
    `
    UPDATE notes
    SET
      x = CASE WHEN x < -2000 OR x > 5000 THEN ? ELSE x END,
      y = CASE WHEN y < -2000 OR y > 5000 THEN ? ELSE y END,
      width = CASE WHEN width < 360 OR width > 1600 THEN ? ELSE width END,
      height = CASE WHEN height < 160 OR height > 1200 THEN ? ELSE height END
    `,
    [DEFAULT_NOTE.x, DEFAULT_NOTE.y, DEFAULT_NOTE.width, DEFAULT_NOTE.height],
  );
}

//Route
app.get("/", (req, res) => {
  res.send("wecole");
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "hello" });
});

app.get("/api/notes", async (req, res) => {
  const [notes] = await db.query(`
    SELECT id, x, y, width, height, content
    FROM notes
    ORDER BY created_at ASC
  `);

  res.json(notes.map(sanitizeNote));
});

app.post("/api/notes", async (req, res) => {
  const { id, x, y, width, height, content } = sanitizeNote(req.body);

  await db.query(
    `
    INSERT INTO notes (id, x, y, width, height, content)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [id, x, y, width, height, content],
  );

  res.status(201).json({ id, x, y, width, height, content });
});

app.put("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { x, y, width, height, content } = sanitizeNote(req.body);

  await db.query(
    `
    UPDATE notes
    SET x=?, y=?, width=?, height=?, content=?
    WHERE id=?
    `,
    [x, y, width, height, content, id],
  );

  res.json({ success: true });
});

app.delete("/api/notes/:id", async (req, res) => {
  const { id } = req.params;

  await db.query("DELETE FROM notes WHERE id=?", [id]);

  res.json({ success: true });
});

setupDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to start server:", error);
    process.exit(1);
  });
