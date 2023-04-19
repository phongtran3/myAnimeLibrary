const User = require("../models/user.js");

//READ
async function getUser(req, res) {
  try {
    const { userName } = req.params;
    //const user = await User.findById(id);
    const user = await User.findOne({ userName: userName });

    res.status(200).json(user);
    console.log("getUser try");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

async function updateProfile(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    console.log(req.body.attribute);
    console.log(req.body.value);
    console.log(user.userName);
    console.log(user[req.body.attribute]);

    user[req.body.attribute] = req.body.value;
    console.log(user.userName);
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

module.exports = {
  getUser,
  updateProfile,
};
