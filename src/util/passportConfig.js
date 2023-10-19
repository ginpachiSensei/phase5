const passport = require("passport");
const userModel = require("../models/userModel.js");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

// Passport Configuration
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Email not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

/**
 * @desc generate jwt token
 * @param {object} user - user object model from mongodb
 * @returns {token} jwt toke
 */
const generateJwtToken = (user) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

/**
 * @desc - login success and set cookies to user with jwt cookie as http-only
 *  and login cookie
 * @param {} res
 * @param {object} user - user object from mongodb
 * @param {*} token - jwt token
 */
const loginSuccess = (res, user, token) => {
  const response = {
    msg: "Authentication successful",
    user: {
      _id: user._id,
      email: user.email,
    },
  };

  const tokenCookie = cookie.serialize("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 3600,
    path: "/",
  });

  const loginCookie = cookie.serialize("login", true, {
    secure: true,
    maxAge: 3600,
    path: "/",
  });

  res.setHeader("Set-Cookie", tokenCookie);
  res.setHeader("Set-Cookie", loginCookie);
  res.status(200).json(response);
};

const loginFailed = (res) => {
  res.status(401).json({ msg: "Authentication failed" });
};

module.exports = { generateJwtToken, loginSuccess, loginFailed };
