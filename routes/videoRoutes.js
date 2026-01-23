const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const videoController = require("../controllers/videoController");

router.get("/videos", requireAuth, (req, res) => videoController.showPage(req, res));
router.post("/videos/save", requireAuth, (req, res) => videoController.saveFavorite(req, res));
router.post("/videos/delete", requireAuth, (req, res) => videoController.deleteFavorite(req, res));

module.exports = router;