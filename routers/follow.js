const follow = require("../controllers/followController");
const express = require("express");
const router = express.Router();

router.post("/follow", follow.follow);
router.get("/getfollowers", follow.getfollowers);
router.get("/getfollow", follow.getfollow);

module.exports = router;
