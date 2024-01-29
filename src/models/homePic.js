const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const homepicSchema = new Schema(
  {
    image: { type: String },
    nature: { type: String },
  },
  { timestamps: true }
);

module.exports = Course = model("homepic", homepicSchema);
