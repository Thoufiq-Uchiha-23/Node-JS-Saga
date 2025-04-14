const express = require("express");
// const users = require("./MOCK_DATA.json");
const fs = require("fs");
const mongoose = require("mongoose");
const { type } = require("os");
const app = express();
const PORT = 8000;

const userRouter = require("./routes/user.routes")

// Connection
mongoose
  .connect("mongodb://0.0.0.0/youtube-app-1")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("Mongo Error", err);
  });

// Middlewares - Plugins
app.use(express.urlencoded({ extended: false }));

// MIDDLEWARE - Plugin
app.use((req, res, next) => {
  // console.log("Hello from Middleware 1")
  fs.appendFile(
    "./log.txt",
    `\n ${Date.now()} ${req.method} ${req.ip} ${req.path}`,
    (err, data) => {
      next();
    }
  );
});

app.use((req, res, next) => {
  console.log("Hello from Middleware 2");
  next();
});

// ROUTES
app.use("/user", userRouter);

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
