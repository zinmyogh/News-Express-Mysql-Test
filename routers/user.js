const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
// const multer = require("multer");

var user = require("../controllers/userController");

// let upload = multer({ dest: "./public/uploads/" }).single("file");
// let moreUpload = multer({ dest: "./public/uploads/" }).array("file", 5);

router.post("/register", user.register);
router.post("/login", user.login);
router.get("/gettotallike", user.gettotallikecount);
router.get("/getarticlepostcount", user.getarticlepostcount);
router.post("/changepass", user.changepass);
router.post("/adduserinfo", user.adduserinfo);
router.post("/uploadprofile", upload.single("file"), user.uploadprofile);
// router.post("/uploadimages", upload.array("files"), user.uploadimages);
// router.get("/getuserinfo", user.getuserinfo);

module.exports = router;
