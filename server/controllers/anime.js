//const UserAnime = require("../models/anime.js");
const User = require("../models/user.js");

async function addAnime(req, res) {
  try {
    const {
      userId,
      title,
      genres,
      format,
      coverImage,
      siteUrl,
      userStatus,
      status,
    } = req.body.data;
    const user = await User.findById(userId); //May have to change
    //console.log(req.body.data);
    //console.log(genres);
    // console.log(user);
    let index = user.animes.findIndex((anime) => anime.title === title);
    if (index <= -1) {
      //anime is not in the list and needs to be added
      const animeObj = {
        title,
        genres,
        format,
        coverImage,
        siteUrl,
        userStatus,
        status,
      };
      user.animes.push(animeObj);
    } else {
      //anime is in the list and userStatus needs to updated
      user.animes[index].userStatus = userStatus;
    }

    await user.save();
    res.status(201).json(user.animes);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

async function removeAnime(req, res) {
  try {
    console.log("Removing Anime");
    const { id } = req.params;
    const { itemId } = req.body.data;
    const user = await User.findById(id);
    //console.log(itemId);
    //const animeToDelete = user.animes.find((x) => x.id === itemId);
    //console.log(animeToDelete);

    user.animes.splice(
      user.animes.findIndex((el) => el.id === itemId),
      1
    );
    await user.save();
    res.status(201).json(user.animes);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

async function updateAnime(req, res) {
  try {
    const { id } = req.params;
    const { itemId, userStatus } = req.body.data;

    const user = await User.findById(id);
    let objIndex = user.animes.findIndex((el) => el.id === itemId);
    if (user.animes[objIndex].userStatus === userStatus)
      res.status(201).json(user.animes);
    else {
      user.animes[objIndex].userStatus = userStatus;
      await user.save();
      res.status(201).json(user.animes);
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

module.exports = {
  addAnime,
  removeAnime,
  updateAnime,
};
