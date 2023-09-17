const mongoose = require("mongoose");

const mycourseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseItems: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Theme",
          required: true,
        },
      },
    ],
    payMeth: { type: String },
    payImage: { type: String },
    payed: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Mycourse", mycourseSchema);
