const express = require("express");

const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url.js");
const URL = require("./models/url.js");
const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() => {
  console.log("Mongodb connected");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
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
