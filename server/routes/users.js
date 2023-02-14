const express = require("express");
const verifyToken = require("../middleware/auth.js");
const {
  getUser,
  getAnimeList,
  getMangaList,
} = require("../controllers/uesrs.js");

const router = express.Router();

//READ
router.get("/:id", verifyToken, getUser); //Get user
router.get("/:id/animelist", verifyToken, getAnimeList); //Get user's animeList
router.get("/:id/mangalist", verifyToken, getMangaList); //Get user's mangalist

//UPDATE
//router.patch("/:id", verifyToken, addRemoveAnime);

module.exports = router;
