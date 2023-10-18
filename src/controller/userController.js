const Joi = require("joi");
const userModel = require("../models/userModel.js");
const sendMail = require("../util/sendMail.js");
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

module.exports = { registerUser, confirmUserEmail };
