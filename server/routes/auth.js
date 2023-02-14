//AUTHENTICATION ROUTER
const express = require("express");
const router = express.Router();

const { login } = require("../controllers/auth.js");

router.post("/login", login); //User login request

module.exports = router;
