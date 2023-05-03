const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.js");
const {
  addManga,
  removeManga,
  updateManga,
} = require("../controllers/manga.js");

router.post("/", verifyToken, addManga);

router.patch("/:id/remove", verifyToken, removeManga);
router.patch("/:id/update", verifyToken, updateManga);

module.exports = router;
