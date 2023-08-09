const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

//User Registration.
async function register(req, res) {
  try {
    const { firstName, lastName, email, userName, password, picturePath } =
      req.body;
    const oldUser = await User.findOne({ email: email });

    if (oldUser)
      return res
        .status(400)
        .json({ message: "User already exists with that email" });

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    //New user
    const user = new User({
      firstName,
      lastName,
      email,
      userName,
      password: hashedPassword,
      picturePath,
      socialMediaHandles: {
        github: "",
        instagram: "",
        twitter: "",
        youtube: "",
      },
      following: [],
      followers: [],
      isAdult: false,
    });

    //user.socialMediaHandles.set("github", "phongtran3");
    const newUser = await user.save(); // Save new user to database

    user.password = undefined;
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//User Login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    //console.log("email: " + email + " password: " + password);
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.password = undefined;
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  register,
  login,
};
