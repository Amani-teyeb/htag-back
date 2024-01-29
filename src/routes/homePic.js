const express = require("express");
const router = express();
const { requireSignin, adminMiddleware } = require("../common-middleware");
const {
  addHomePic,
  deleteHomePic,
  getAllHomepic,
  editHomePic,
} = require("../controllers/homePic");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (res, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post(
  "/homepic/create",

  upload.single("image"),
  addHomePic
);
router.post("/homepic/delete", deleteHomePic);
router.post("/homepic/update", upload.single("image"), editHomePic);
router.get("/homepic", getAllHomepic);

module.exports = router;
