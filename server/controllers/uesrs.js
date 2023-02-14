const User = require("../models/user.js");
const UserAnime = require("../models/userAnime.js");
const userManaga = require("../models/userManaga.js");
//READ
async function getUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    res.status(200).json(user);
    console.log("getUser try");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

async function getAnimeList(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const userAnime = await UserAnime.findOne({ userId: user._id });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

async function getMangaList(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const userManga = await userManga.findOne({ userId: user._id });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

module.exports = {
  getUser,
  getAnimeList,
  getMangaList,
};
