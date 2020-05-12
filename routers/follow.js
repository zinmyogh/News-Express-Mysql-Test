const follow = require("../controllers/followController");
const express = require("express");
const router = express.Router();

router.post("/follow", follow.follow);

module.exports = router;
