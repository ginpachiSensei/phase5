const dotenv = require("dotenv");
const express = require("express");
const userRoutes = require("./routes/userRoutes.js");
const connectDB = require("./config/dbConfig.js");
dotenv.config();

const app = express();

app.use(express.json());

//db connection
connectDB();

// Routes
app.use("/api/users", userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
