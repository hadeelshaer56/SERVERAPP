const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Optional: on Render you can mount a Persistent Disk and point DATA_DIR to it
// Example: DATA_DIR=/var/data
const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, "..");

fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "db.sqlite");
const db = new sqlite3.Database(dbPath);

// Enable foreign keys in SQLite
// (Must be enabled per-connection)
db.run("PRAGMA foreign_keys = ON;");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      fullName TEXT NOT NULL,
      passwordHash TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  // Favorites table: each user can save multiple YouTube videos
  db.run(`
    CREATE TABLE IF NOT EXISTS Favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      videoId TEXT NOT NULL,
      title TEXT NOT NULL,
      thumbnailUrl TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
      UNIQUE (userId, videoId)
    )
  `);
});

module.exports = db;
