const bcrypt = require("bcryptjs");

const Users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "satyam",
    email: "satyam@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "shivam",
    email: "shivam@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

module.exports = Users;
