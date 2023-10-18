const Joi = require("joi");
const userModel = require("../models/userModel.js");

// @desc    Handle new user Registration
// @route   POST api/users/
// @access  Public
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
  if (user) {
    res.status(201).json({ msg: "Email already registered" });
  } else {
    const newUser = new userModel({ name, email, password });
    try {
      await newUser.save();
      res.status(200).json({ msg: "done" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
    // send email on new user registration
    // sendMail(email);
  }
};

module.exports = { registerUser };
