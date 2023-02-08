//AUTHENTICATION ROUTER
const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/auth.js");

router.post("/register", register); //Register new user
router.post("/login", login); //User login request

module.exports = router;
