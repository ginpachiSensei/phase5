const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel.js");

/**
 * @desc - middleware that verifies if user has a jwt token for further request prossesing
 * if user does not has a valid token subsequest request will not be processed
 * @param  req - require a cookie with jwt in it
 * @param res
 * @param next
 * @returns user data from database with the userid in the token as req.user
 */
const protect = async (req, res, next) => {
  let token;

  // Check if the request contains a cookie named 'jwt'
  if (req.cookies && req.cookies.jwt) {
    try {
      token = req.cookies.jwt;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userModel.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.error(error);

      // Check if the error is due to an invalid token
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      // For other errors (e.g token expired)
      return res
        .status(401)
        .json({ message: "Unauthorized: Token verification failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }
};

module.exports = protect;
