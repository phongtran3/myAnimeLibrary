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
    const { attribute, value, currentPassword } = req.body;
    console.log(req.body);
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
    } else user[attribute] = value;

    console.log(user[attribute]);
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
