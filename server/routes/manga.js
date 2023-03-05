const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.js");
const { addManga } = require("../controllers/manga.js");

router.post("/", verifyToken, addManga);

module.exports = router;
