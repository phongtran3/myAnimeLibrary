const jwt = require("jsonwebtoken");

async function verifyToken(req, res, next) {
  try {
    //console.log("VerifyToken");
    //console.log(req.headers);
    let token = req.header("authorization");
    if (!token) return res.status(403).send("Access denied");

    if (token.startsWith("Bearer "))
      token = token.slice(7, token.length).trimLeft();
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = verifyToken;
