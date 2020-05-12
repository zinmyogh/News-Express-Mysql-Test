const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const video = require("../controllers/videoController");
const upload = require("../middlewares/upload");

router.get("/getallvideo", video.fgetallvideo);
router.get("/getvideobycategory", video.fgetvideobycategory);
router.post("/postvideo", auth(), video.postvideo);
router.post("/deletevideo", auth(), video.deletevideo);

module.exports = router;
