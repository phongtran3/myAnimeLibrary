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
    console.log("getUser try");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

async function updateProfile(req, res) {
  try {
    let regEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const { id } = req.params;
    const { attribute, value, currentPassword } = req.body.data;
    const user = await User.findById(id);

    const matchPassword = await bcrypt.compare(currentPassword, user.password);
    if (!matchPassword)
      return res.status(400).json({ message: "Incorrect Password" });

    if (attribute === "email" && !regEmail.test(value))
      return res.status(400).json({ message: "Invalid Email Address" });

    user[attribute] = value;
    console.log(user.userName);
    await user.save();

    user.password = undefined;
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

module.exports = {
  getUser,
  updateProfile,
};
