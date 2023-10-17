const dotenv = require("dotenv");
const express = require("express");
const userRoutes = require("./routes/userRoutes.js");
dotenv.config();

const app = express();

app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
