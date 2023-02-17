const express = require("express");
const { addAnime } = require("../controllers/anime.js");
const verifyToken = require("../middleware/auth.js");
const router = express.Router();

router.post("/", verifyToken, addAnime);

module.exports = router;
