const HomePic = require("../models/homePic");

exports.addHomePic = (req, res) => {
  const { nature } = req.body;
  try {
    const newpic = new HomePic({ nature });
    if (req.file) {
      newpic.image = process.env.API + "/public/" + req.file.filename;
    }
    newpic.save();
    res.status(201).json({ newpic });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.deleteHomePic = async (req, res) => {
  const { imageId } = req.body;
  try {
    const findimage = await HomePic.findByIdAndDelete({ _id: imageId });
    res.status(201).json({ message: "image removed" });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.getAllHomepic = (req, res) => {
  HomePic.find({}).exec((error, images) => {
    if (error) return res.status(400).json({ error });
    if (images) return res.status(200).json({ images });
  });
};

exports.editHomePic = async (req, res) => {
  try {
    const findHomePic = await HomePic.findByIdAndUpdate(
      { _id: req.body._id },
      {
        image: process.env.API + "/public/" + req.file.filename,
      },
      { new: true }
    );
    res.status(201).json({ message: "image updated", findHomePic });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
