const express = require("express");
const {
  signup,
  signin,
  signout,
  getUsers,
  getTeachers,
  deleteUser,
  editUser,
  allUsers,
  getWishlist,
  payPicUpdate,
} = require("../controllers/auth");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../validators/auth");
const router = express();
const User = require("../models/user");
const { adminMiddleware, requireSignin } = require("../common-middleware");
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

router.post("/signin", validateSigninRequest, isRequestValidated, signin);

router.post("/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/signout", signout);
router.get("/getUsers", getUsers);
router.get("/getTeachers", getTeachers);
router.get("/wishlist", requireSignin, getWishlist);
router.post("/user/deleteUser", requireSignin, adminMiddleware, deleteUser);
router.post("/user/editUser", requireSignin, editUser);
router.put(
  "/user/payPicUpdate",
  requireSignin,
  upload.single("payPicture"),
  payPicUpdate
);
module.exports = router;
router.get("/getUserSearch", requireSignin, allUsers);
