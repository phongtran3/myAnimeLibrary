const express = require("express");
const verifyToken = require("../middleware/auth.js");
const { getUser, updateProfile } = require("../controllers/users.js");

const router = express.Router();

//READ
router.get("/:userName", getUser); //Get user
//router.get("/:id/animelist", verifyToken, getAnimeList); //Get user's animeList
//router.get("/:id/mangalist", verifyToken, getMangaList); //Get user's mangalist

//router.get("/:userId/animelist", verifyToken, getUserAnimeList); //Get user's animeList
//router.get("/:userId/mangalist", verifyToken, getUserMangaList); //Get user's mangalist

//UPDATE
//router.patch("/:id", verifyToken, addRemoveAnime);
router.patch("/:id/update", verifyToken, updateProfile);

module.exports = router;
