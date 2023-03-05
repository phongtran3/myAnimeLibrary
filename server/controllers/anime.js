const UserAnime = require("../models/anime.js");
const User = require("../models/user.js");

async function addAnime(req, res) {
  try {
    const { userId, title, genres, format, coverImage, siteUrl, userStatus } =
      req.body.data;
    const user = await User.findById(userId); //May have to change
    console.log(req.body.data);
    //console.log(genres);
    // console.log(user);
    const animeObj = {
      title,
      genres,
      format,
      coverImage,
      siteUrl,
      userStatus,
    };
    user.animes.push(animeObj);
    await user.save();
    res.status(201).json(user.animes);
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
