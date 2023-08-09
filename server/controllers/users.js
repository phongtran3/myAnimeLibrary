const User = require("../models/user.js");
const bcrypt = require("bcrypt");

//READ
async function getUser(req, res) {
  try {
    const { userName } = req.params;
    //const user = await User.findById(id);
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
    console.log(req.query.search);
    if (req.query.search != null && req.query.search != "") {
      query.regex("userName", new RegExp(req.query.search), "i");
      users = await query.exec();
    }
    //const users = await query.exec();

    //console.log(users);
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

async function updateProfile(req, res) {
  try {
    let regEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const { id } = req.params;
    const { attribute, value, currentPassword } = req.body;
    const user = await User.findById(id);

    const matchPassword = await bcrypt.compare(currentPassword, user.password);
    if (!matchPassword)
      return res.status(400).json({ message: "Incorrect Password" });

    if (attribute === "email") {
      if (!regEmail.test(value))
        return res.status(400).json({ message: "Invalid Email Address" });

      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already exists with that email" });
      }
    }

    if (attribute === "password") {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(value, salt);
      user[attribute] = hashedPassword;
    } else if (attribute === "socialMediaHandles") {
      if (value.includes("twitter"))
        user.socialMediaHandles.set("twitter", value);
      else if (value.includes("instagram"))
        user.socialMediaHandles.set("instagram", value);
      else if (value.includes("youtube"))
        user.socialMediaHandles.set("youtube", value);
      else user.socialMediaHandles.set("github", value);
    } else user[attribute] = value;

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
    res.status(404).json({ message: error.message });
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
