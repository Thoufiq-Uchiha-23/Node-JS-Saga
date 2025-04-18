const express = require("express");
const path = require("path");

const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url.js");
const staticRoute = require("./routes/staticRouter.js")
const URL = require("./models/url.js");
const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() => {
  console.log("Mongodb connected");
});

// Setting ejs
app.set("view engine", "ejs");
// To tell the path where all views are present
app.set("views", path.resolve("./views") )

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/url", urlRoute);
app.use("/", staticRoute)

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  return res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));
