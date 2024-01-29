const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const courseVideoSchema = new Schema(
  {
    url: { type: String, require: true },
    titre: { type: String, require: true },
    level: { type: String, require: true },
    theme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theme",
    },
    group: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Course = model("videocourse", courseVideoSchema);
