const express = require("express");
// const users = require("./MOCK_DATA.json");
const { connectMongoDB } = require("./connection.js");
const fs = require("fs");

const app = express();
const PORT = 8000;

const { logReqRes } = require("./middlewares/index.js");

const userRouter = require("./routes/user.routes");

connectMongoDB("mongodb://0.0.0.0/youtube-app-1").then(() => {
  console.log("MongoDB connected successfully");
})

// Middlewares - Plugins
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"));

app.use((req, res, next) => {
  console.log("Hello from Middleware 2");
  next();
});

// ROUTES
app.use("/api/users", userRouter);

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
