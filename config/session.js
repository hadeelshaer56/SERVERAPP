const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const path = require("path");
const fs = require("fs");

// In production (Render), make sure SESSION_SECRET is set
const isProd = process.env.NODE_ENV === "production";
const SESSION_SECRET = process.env.SESSION_SECRET;
if (isProd && !SESSION_SECRET) {
  throw new Error("Missing SESSION_SECRET env var in production");
}

// Optional: on Render you can mount a Persistent Disk and point DATA_DIR to it
// Example: DATA_DIR=/var/data
const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, "..");

// Ensure directory exists (important if DATA_DIR is used)
fs.mkdirSync(dataDir, { recursive: true });

module.exports = session({
  store: new SQLiteStore({
    db: "sessions.sqlite",
    dir: dataDir,
  }),
  secret: SESSION_SECRET || "dev_secret_change_me",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1 hour
    sameSite: "lax",
    secure: isProd, // requires HTTPS (Render provides HTTPS)
  },
});
