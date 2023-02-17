const UserAnime = require("../models/anime.js");
const User = require("../models/user.js");

async function addAnime(req, res) {
  try {
    const { userId, title, genre, format, coverImage, siteUrl, userStatus } =
      req.body;
    const user = await User.findById(userId); //May have to change

    const animeObj = {
      title,
      genre,
      format,
      coverImage,
      siteUrl,
      userStatus,
    };
    user.animes.push(animeObj);
    await user.save();
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

async function getUserAnimes(req, res) {
  try {
    const user = await User.findById(req.id);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

module.exports = {
  addAnime,
  getUserAnimes,
};
