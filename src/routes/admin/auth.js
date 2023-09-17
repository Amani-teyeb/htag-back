const express = require("express");
const {
  signup,
  signin,
  signout,
  registerTeacher,
} = require("../../controllers/admin/auth");
const router = express();

router.post("/admin/signin", signin);

router.post("/admin/signup", signup);
router.post("/admin/addTeacher", registerTeacher);
router.post("/admin/signout", signout);

module.exports = router;
