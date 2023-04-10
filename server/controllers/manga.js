const UserManga = require("../models/manga.js");
const User = require("../models/user.js");

async function addManga(req, res) {
  try {
    const { userId, title, genres, coverImage, siteUrl, userStatus, status } =
      req.body.data;
    const user = await User.findById(userId); //May have to change
    console.log(req.body.data);
    //console.log(genres);
    // console.log(user);
    const mangaObj = {
      title,
      genres,
      coverImage,
      siteUrl,
      userStatus,
      status,
    };
    user.mangas.push(mangaObj);
    await user.save();
    res.status(201).json(user.manga);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

module.exports = {
  addManga,
};
