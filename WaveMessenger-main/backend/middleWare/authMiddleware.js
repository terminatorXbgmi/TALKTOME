const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const protect = async (req, res, next) => {
  let token;
  // check wheter token is present and that is a bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decode payload
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      // selest("-password")
      req.user = await User.findById(decode.id).select("-password");
      next();
    } catch (err) {
      res.status(401).json({ Error: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ Error: "Not authorized, token failed" });
  }
};

module.exports = protect;
