const dotenv = require("dotenv");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/dbConfig.js");
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const passport = require("passport");
dotenv.config();

const app = express();

app.use(express.json());

//db connection
connectDB();

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
// app.use(flash());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
