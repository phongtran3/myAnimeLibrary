const express = require("express");
const verifyToken = require("../middleware/auth.js");
const getUser = require("../controllers/uesrs.js");

const router = express.Router();

//READ
router.get("/:id", verifyToken, getUser); //Get user

//UPDATE

module.exports = router;
