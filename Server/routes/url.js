const express = require("express");
const { auth } = require("../middlewares/auth");
const { Url } = require("../models/url.model");
const { nanoid } = require("nanoid");
const urlRouter = express.Router();

urlRouter.get("/recents", auth, async (req, res) => {
  try {
    const user = req.user;

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const recent = await Url.find({
      user: user._id,
      time: { $gte: twentyFourHoursAgo },
    });
    res.status(201).json({ message: "recents", recent, isOk: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", isOk: false });
  }
});

urlRouter.post("/shorten", auth, async (req, res) => {
  try {
    const user = req.user;
    const { originalUrl } = req.body;
    let url = await Url.findOne({ user: user._id, originalUrl });

    if (url) {
      url = await Url.findOneAndUpdate(
        { user: user._id, originalUrl },
        { $set: { time: Date.now() } },
        { new: true } // Return the updated document
      );
      return res.status(201).json({ newUrl: url, isOk: true });
    }

    const shortUrl = nanoid(8);

    const newUrl = new Url({
      originalUrl,
      shortUrl,
      user: user._id,
      time: Date.now(),
    });

    await newUrl.save();

    res.status(201).json({ newUrl, isOk: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", isOk: false });
  }
});

urlRouter.get('/getHistory', auth, async(req, res)=>{
  try {
    const user = req.user;

    const recent = await Url.find({
      user: user._id,
    });
    res.status(201).json({ message: "History", recent, isOk: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", isOk: false });
  }
})

urlRouter.get('/api/url/getHistory', auth, async(req, res)=>{
  try {
    const user = req.user;

    const recent = await Url.find({
      user: user._id,
    });
    res.status(201).json({ message: "History", recent, isOk: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", isOk: false });
  }
})

module.exports = { urlRouter };
