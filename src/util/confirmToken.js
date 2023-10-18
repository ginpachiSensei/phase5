const bcrypt = require("bcryptjs");

const generateConfirmationToken = async () => {
  // Generate a unique value, such as a UUID
  const uniqueValue = process.env.EMAIL_CONFIRM_TOKEN_SECRET;

  // Generate a hash of the unique value
  const saltRounds = 10; // Adjust the number of salt rounds for security
  const hashedValue = await bcrypt.hash(uniqueValue, saltRounds);

  return hashedValue;
};

module.exports = { generateConfirmationToken };
