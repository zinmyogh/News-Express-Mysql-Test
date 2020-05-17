const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

const moment = require("../controllers/momentController");

router.get("/getmoment", moment.getmoment);
router.post("/add/moment", moment.postmoment);
router.post("/uploadimages", upload.array("file"), moment.uploadimages);
router.delete("/deletemoment", moment.deletemoment);

module.exports = router;
