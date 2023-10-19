const Joi = require("joi");
const userModel = require("../models/userModel.js");
const sendMail = require("../util/sendMail.js");
const passport = require("passport");
const {
  generateJwtToken,
  loginSuccess,
  loginFailed,
} = require("../util/passportConfig.js");
const { generateConfirmationToken } = require("../util/confirmToken.js");

/**
 * @desc    Handle new user Registration
 * @route   POST api/users/
 * @access  Public
 */
const registerUser = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, email, password } = req.body;
  const user = await userModel.findOne({ email });
  const confirmToken = await generateConfirmationToken();
  if (user) {
    res.status(201).json({ msg: "Email already registered" });
  } else {
    const newUser = new userModel({
      name,
      email,
      password,
      isConfirmed: false,
      confirmationToken: confirmToken,
    });
    try {
      await newUser.save();
      res.status(200).json({ msg: "done" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
    // send email on new user registration
    sendMail(email, confirmToken);
  }
};

/**
 * @desc    email confirmation for new users
 * @route   GET api/users/confirm
 * @access  Public
 */
const confirmUserEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: "Token is missing." });
  }

  try {
    const user = await userModel.findOne({ confirmationToken: token });
    if (!user) {
      return res
        .status(404)
        .json({ error: "Token is invalid or has expired." });
    }

    // Mark the user as confirmed in the database
    user.isConfirmed = true;
    user.confirmationToken = "";
    await user.save();

    res.status(200).json({ msg: "Account confirmed successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc - used for authentication of user
 * @param {{email:string,password:string}} req - takes object as input with emial and password as string
 * @param {*} res
 * @param {*} next
 */
const authUser = async (req, res, next) => {
  //request object validation
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return loginFailed(res);
    }
    const token = generateJwtToken(user);
    loginSuccess(res, user, token);
  })(req, res, next);
};

/**
 * @desc - get user details but requires user to be logged in and have a token verfied by
 *  protect middleware
 * @param req
 * @param res
 */
const getUserProfile = async (req, res) => {
  const user = await userModel.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404).json({ msg: "User not found" });
  }
};

/**
 * @desc - update user details but requires user to be logged in and have a token verfied by
 *  protect middleware
 * @param req
 * @param res
 */
const updateUserProfile = async (req, res) => {
  //req validation where atleast one of name email and password is present
  const schema = Joi.object({
    email: Joi.string(),
    password: Joi.string(),
    name: Joi.string(),
  })
    .or("email", "password", "name")
    .min(1);

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const user = await userModel.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404).json({ msg: "User Not Updated" });
  }
};

module.exports = {
  registerUser,
  confirmUserEmail,
  authUser,
  getUserProfile,
  updateUserProfile,
};
