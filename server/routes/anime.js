const express = require("express");
const { addAnime, removeAnime } = require("../controllers/anime.js");
const verifyToken = require("../middleware/auth.js");
const router = express.Router();

router.post("/", verifyToken, addAnime);

router.patch("/:id/remove", verifyToken, removeAnime);

module.exports = router;
