const express = require("express");
const { requireSignin, userMiddleware } = require("../common-middleware");
const router = express.Router();
const {
  addToWishlist,
  // removeCourseFromFav,
  // getCourseList,
  // getAllCourseList,
} = require("../controllers/mycourse");

router.put("/mycourse/addcourse", requireSignin, addToWishlist);
// router.post("/mycourse/removecourse", requireSignin, removeCourseFromFav);
// router.get("/mycourse/getcourseliste", requireSignin, getCourseList);
// router.get("/mycourse/getallcourseliste", getAllCourseList);
module.exports = router;
