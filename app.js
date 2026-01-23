const express = require("express");
const path = require("path");
const sessionMiddleware = require("./config/session");
const authRoutes = require("./routes/authRoutes");
const videoRoutes = require("./routes/videoRoutes");
const requireAuth = require("./middleware/requireAuth");

const app = express();

// Render/Proxy safety (needed for secure cookies behind a proxy)
app.set("trust proxy", 1);

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// body parsing
app.use(express.urlencoded({ extended: true }));

// sessions
app.use(sessionMiddleware);

// make user available in views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// routes
app.use(authRoutes);
app.use(videoRoutes);

// protected home
app.get("/", requireAuth, (req, res) => {
  res.render("home", { user: req.session.user });
});

// fallback
app.use((req, res) => {
  res.status(404).send("Not Found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
