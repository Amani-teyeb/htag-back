const express = require("express");
const router = express();
const { requireSignin, adminMiddleware } = require("../common-middleware");
const { addvideoCourse, getvideoCourse } = require("../controllers/course");

router.post("/coursevideo/create", requireSignin, addvideoCourse);
router.get("/coursevideo/get", getvideoCourse);

module.exports = router;
