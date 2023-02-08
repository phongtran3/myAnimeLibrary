const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

//User Registration.
async function register(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    //New user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const newUser = await user.save(); // Save new user to database

    res.status(201).json(newUser);
    console.log("register try");
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("register catch");
  }
}

//User Login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.find({ email: email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    delete user.password;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  register,
  login,
};
