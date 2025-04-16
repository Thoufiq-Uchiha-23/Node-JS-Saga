const URL = require("../models/url.js");

const generateShortURL = async (req, res) => {
  const { nanoid } = await import("nanoid");
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });
  const shortID = nanoid(8);
  console.log(body)
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });

  console.log("short URL",body.url)
  return res.json({ id: shortID });
};

const getAnalytics = async (req, res) => {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  })
}
module.exports = {
  generateShortURL,
  getAnalytics,
}