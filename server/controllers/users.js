const User = require("../models/user.js");
const bcrypt = require("bcrypt");

const REG_EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const ATTRIBUTES = {
  EMAIL: "email",
  PASSWORD: "password",
  SOCIAL_MEDIA_HANDLES: "socialMediaHandles",
  PICTURE_PATH: "picturePath",
};

async function updateEmail(user, value) {
  if (!REG_EMAIL.test(value)) throw new Error("Invalid Email Address");
  const existingUser = await User.findOne({ email: value });
  if (existingUser) {
    throw new Error("User already exists with that email");
  }
  user.email = value;
}

async function updatePassword(user, value) {
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(value, salt);
}

function updateSocialMediaHandle(user, value) {
  if (value.includes("twitter")) user.socialMediaHandles.set("twitter", value);
  else if (value.includes("instagram"))
    user.socialMediaHandles.set("instagram", value);
  else if (value.includes("youtube"))
    user.socialMediaHandles.set("youtube", value);
  else user.socialMediaHandles.set("github", value);
}

//READ
async function getUser(req, res) {
  try {
    const { userName } = req.params;
    const user = await User.findOne({ userName: userName });

    user.password = undefined;
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

async function getAllUser(req, res) {
  try {
    let query = User.find({}, { userName: 1, picturePath: 1 });
    let users;
    if (req.query.search != null && req.query.search != "") {
      query.regex("userName", new RegExp(req.query.search), "i");
      users = await query.exec();
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

async function updateProfile(req, res) {
  try {
    const { id } = req.params;
    const { attribute, value, currentPassword } = req.body;
    console.log(attribute);
    console.log(value);
    console.log(req.file.location);

    if (!Object.values(ATTRIBUTES).includes(attribute)) {
      return res.status(400).json({ message: "Invalid attribute" });
    }

    const user = await User.findById(id);
    const matchPassword = await bcrypt.compare(currentPassword, user.password);

    if (!matchPassword)
      return res.status(400).json({ message: "Incorrect Password" });

    switch (attribute) {
      case ATTRIBUTES.EMAIL:
        await updateEmail(user, value);
        break;
      case ATTRIBUTES.PASSWORD:
        await updatePassword(user, value);
        break;
      case ATTRIBUTES.SOCIAL_MEDIA_HANDLES:
        updateSocialMediaHandle(user, value);
        break;
      case ATTRIBUTES.PICTURE_PATH:
        user[attribute] = req.file.location;
        break;
      default:
        user[attribute] = value;
    }

    await user.save();
    user.password = undefined;
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

async function followUnfollowUser(req, res) {
  try {
    const { id, followerId } = req.params;
    const user = await User.findById(id);
    const followUser = await User.findById(followerId);

    if (user.following.includes(followerId)) {
      //Unfollowing user
      user.following = user.following.filter((id) => id !== followerId);
      followUser.followers = followUser.followers.filter((id) => id !== id);
    } else {
      //Following user
      user.following.push(followerId);
      followUser.followers.push(id);
    }
    await user.save();
    await followUser.save();
    res.status(200).json([user, followUser]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getFollowers(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const followers = await Promise.all(
      user.followers.map((id) => User.findById(id))
    );
    const following = await Promise.all(
      user.following.map((id) => User.findById(id))
    );

    const formattedFollowers = followers.map(
      ({ _id, firstName, lastName, picturePath, userName }) => {
        return { _id, firstName, lastName, picturePath, userName };
      }
    );
    const formattedFollowing = following.map(
      ({ _id, firstName, lastName, picturePath, userName }) => {
        return { _id, firstName, lastName, picturePath, userName };
      }
    );

    res.status(200).json([formattedFollowers, formattedFollowing]);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

module.exports = {
  getUser,
  updateProfile,
  getAllUser,
  followUnfollowUser,
  getFollowers,
};
