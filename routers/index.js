const express = require("express");
const router = express.Router();

const cate = require("../controllers/testController");

router.get("/useruser", cate.getUser);
router.get("/post", cate.getPost);

module.exports = router;
