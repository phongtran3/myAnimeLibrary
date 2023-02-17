const User = require("../models/user.js");

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

module.exports = {
  getUser,
};
