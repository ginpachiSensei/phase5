const Joi = require("joi");

// @desc    Test get request
// @route   POST api/users/
// @access  Public
const testGet = async (req, res) => {
  res.json({ msg: "hello world" });
};

// @desc    Test post request
// @route   POST api/users/test
// @access  Public
const testPost = async (req, res) => {
  // Define a schema for validation
  const nameSchema = Joi.object({
    name: Joi.string().required(),
  });

  try {
    const { error, value } = nameSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const name = value.name;
    res.json({ message: "Name is valid: " + name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { testGet, testPost };
