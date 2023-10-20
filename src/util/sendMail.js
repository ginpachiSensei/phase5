const nodemailer = require("nodemailer");

/**
 *
 * @param {string} email - email id where to send email
 * @param {string} confirmToken - The email confirmation token generate during saving phase of user
 */
const sendMail = async (email, confirmToken) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  //link to confirm email
  const confirmationLink = `http://localhost:5000/api/users/confirm?token=${confirmToken}`;

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "confirm your registration",
    text: `Click the following link to confirm your registration: ${confirmationLink}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = sendMail;
