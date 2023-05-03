const UserManga = require("../models/manga.js");
const User = require("../models/user.js");

async function addManga(req, res) {
  try {
    const {
      userId,
      title,
      genres,
      coverImage,
      siteUrl,
      userStatus,
      status,
      format,
    } = req.body.data;
    const user = await User.findById(userId); //May have to change
    console.log(req.body.data);
    //console.log(genres);
    // console.log(user);
    const mangaObj = {
      title,
      genres,
      format,
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

async function removeManga(req, res) {
  try {
    console.log("removing manga");
    const { id } = req.params;
    const { itemId } = req.body.data;
    const user = await User.findById(id);
    user.mangas.splice(
      user.mangas.findIndex((el) => el.id === itemId),
      1
    );
    await user.save();
    res.status(201).json(user.mangas);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

async function updateManga(req, res) {
  try {
    console.log("updating manga");
    const { id } = req.params;
    const { itemId, userStatus } = req.body.data;

    const user = await User.findById(id);
    let objIndex = user.mangas.findIndex((el) => el.id === itemId);
    if (user.mangas[objIndex].userStatus === userStatus)
      res.status(201).json(user.mangas);
    else {
      user.mangas[objIndex].userStatus = userStatus;
      await user.save();
      res.status(201).json(user.mangas);
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

module.exports = {
  addManga,
  removeManga,
  updateManga,
};
